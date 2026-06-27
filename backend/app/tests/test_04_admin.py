from app.models.user import User
from app.tests.test_utils import login_and_make_user_admin, login_user, make_user_admin


async def test_regular_user_access_denied(client):
    payload = {
        "username": "regularuser",
        "email": "regular@example.com",
        "password": "regularpassword",
    }
    headers = await login_user(client, payload)

    response = await client.get("/admin/stats", headers=headers)

    assert response.status_code in [401, 403]


async def test_admin_can_access_users(client, db_session):
    payload = {"username": "adminuser", "email": "admin@example.com", "password": "adminpassword"}

    await client.post("/users", json=payload)
    await make_user_admin(db_session, payload["username"])
    headers = await login_user(client, payload)

    response = await client.get("/admin/users", headers=headers)

    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_admin_cannot_delete_self(client, db_session):
    payload = {"username": "selfadmin", "email": "self@example.com", "password": "selfpassword"}

    my_id, headers = await login_and_make_user_admin(db_session, client, payload)

    response = await client.delete(f"/admin/users/{my_id}", headers=headers)

    assert response.status_code == 400
    assert response.json()["detail"] == "You cannot delete yourself"


async def test_admin_cannot_demote_self(client, db_session):
    payload = {
        "username": "demoteadmin",
        "email": "demote@example.com",
        "password": "demotepassword",
    }

    my_id, headers = await login_and_make_user_admin(db_session, client, payload)

    response = await client.patch(f"/admin/users/{my_id}/role?new_role=user", headers=headers)

    assert response.status_code == 400
    assert response.json()["detail"] == "You cannot demote yourself"


async def test_admin_cannot_change_super_admin_role(client, db_session):
    payload = {
        "username": "superadmin",
        "email": "super@example.com",
        "password": "superpassword",
    }

    await client.post("/users", json=payload)
    await make_user_admin(db_session, payload["username"], is_super=True)

    from sqlalchemy.future import select

    super_user = (
        await db_session.execute(select(User).where(User.username == payload["username"]))
    ).scalar_one()

    admin_payload = {
        "username": "adminuser2",
        "email": "admin2@example.com",
        "password": "adminpassword2",
    }
    await client.post("/users", json=admin_payload)
    await make_user_admin(db_session, admin_payload["username"])
    headers = await login_user(client, admin_payload)

    del_response = await client.delete(f"/admin/users/{super_user.id}", headers=headers)
    assert del_response.status_code == 403
    assert del_response.json()["detail"] == "Cannot delete a super admin"

    reset_response = await client.patch(
        f"/admin/users/{super_user.id}/reset-password",
        json={"new_password": "newpassword"},
        headers=headers,
    )

    assert reset_response.status_code == 403
    assert reset_response.json()["detail"] == "Cannot reset a super admin password"
