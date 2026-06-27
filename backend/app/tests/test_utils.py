from sqlalchemy import update

from app.models.user import User


async def login_user(client, payload):
    await client.post("/users", json=payload)

    response = await client.post(
        "/login", json={"username": payload["username"], "password": payload["password"]}
    )

    assert response.status_code == 200, f"Login helper failed: {response.text}"

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "refresh_token" in response.cookies

    return {"Authorization": f"Bearer {data['access_token']}"}


async def make_user_admin(db_session, username: str, is_super: bool = False):
    await db_session.execute(
        update(User).where(User.username == username).values(role="admin", super=is_super)
    )

    await db_session.commit()


async def login_and_make_user_admin(db_session, client, payload):
    await client.post("/users", json=payload)
    await make_user_admin(db_session, payload["username"])
    headers = await login_user(client, payload)

    me_response = await client.get("/me", headers=headers)
    my_id = me_response.json()["id"]

    return my_id, headers
