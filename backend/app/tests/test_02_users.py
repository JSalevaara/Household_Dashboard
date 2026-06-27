from app.tests import test_utils


async def test_create_user(client):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword",
    }

    response = await client.post("/users", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == payload["username"]
    assert data["email"] == payload["email"]
    assert "id" in data

    assert "password" not in data
    assert "hashed_password" not in data


async def test_create_duplicate_username(client):
    payload = {
        "username": "duplicateuser",
        "email": "first@example.com",
        "password": "testpassword",
    }

    await client.post("/users", json=payload)

    payload["email"] = "second@example.com"
    response = await client.post("/users", json=payload)

    assert response.status_code == 409
    assert response.json()["detail"] == "Username already taken."


async def test_create_duplicate_email(client):
    payload = {
        "username": "uniqueuser",
        "email": "second@example.com",
        "password": "testpassword",
    }

    await client.post("/users", json=payload)

    payload["username"] = "anotheruser"
    response = await client.post("/users", json=payload)

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered."


async def test_change_username(client):
    payload = {
        "username": "changenameuser",
        "email": "changeusername@example.com",
        "password": "testpassword",
    }

    login_response = await test_utils.login_user(client, payload)

    change_username_response = await client.put(
        "/users/me/username",
        json={"new_username": "newusername", "password": payload["password"]},
        headers=login_response,
    )

    assert change_username_response.status_code == 200
    assert change_username_response.json() == {"message": "Username updated successfully"}


async def test_change_password(client):
    payload = {
        "username": "changepassworduser",
        "email": "changepass@example.com",
        "password": "testpassword",
    }

    login_response = await test_utils.login_user(client, payload)

    change_password_response = await client.put(
        "/users/me/password",
        json={"old_password": payload["password"], "new_password": "newtestpassword"},
        headers=login_response,
    )

    assert change_password_response.status_code == 200
    assert change_password_response.json() == {"message": "Password updated successfully"}
