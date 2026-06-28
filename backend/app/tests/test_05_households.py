from app.tests.test_utils import login_user


async def test_create_household_success(client):
    user_payload = {
        "username": "houseuser",
        "email": "house@example.com",
        "password": "password123",
    }

    headers = await login_user(client, user_payload)

    response = await client.post(
        "/households/",
        json={"name": "My Awesome Home"},
        headers=headers,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My Awesome Home"
    assert "id" in data


async def test_read_user_households(client):
    user_payload = {"username": "memberuser", "email": "member@example.com", "password": "password"}
    headers = await login_user(client, user_payload)

    await client.post("/households/", json={"name": "Test Home"}, headers=headers)

    response = await client.get("/households/", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Home"


async def test_get_user_households_empty(client):
    user_payload = {
        "username": "lonelyuser",
        "email": "lonely@example.com",
        "password": "lonelypassword",
    }
    headers = await login_user(client, user_payload)

    response = await client.get("/households/", headers=headers)

    assert response.status_code == 200
    assert response.json() == []


async def test_get_user_households_security(client):
    user_payload_a = {"username": "userA", "email": "a@a.com", "password": "p"}
    headers_a = await login_user(client, user_payload_a)
    await client.post("/households/", json={"name": "A's House"}, headers=headers_a)

    user_payload_b = {"username": "userB", "email": "b@b.com", "password": "p"}
    headers_b = await login_user(client, user_payload_b)

    response = await client.get("/households/", headers=headers_b)

    assert response.status_code == 200
    assert response.json() == []
