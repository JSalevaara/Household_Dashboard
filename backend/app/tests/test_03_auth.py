from app.tests import test_utils


async def test_login_success(client):
    payload = {"username": "authuser", "email": "auth@example.com", "password": "authpassword"}
    await test_utils.login_user(client, payload)


async def test_login_failure(client):
    payload = {"username": "authuser2", "email": "auth2@example.com", "password": "authpassword"}
    await client.post("/users", json=payload)

    response = await client.post(
        "/login", json={"username": "wronguser", "password": "wrongpassword"}
    )

    assert response.status_code == 401

    assert response.json() == {"detail": "Invalid credentials"}


async def test_unauthorized_access(client):
    response = await client.get("/me")
    assert response.status_code == 401


# TODO:
# Logout test
# Refresh token test
