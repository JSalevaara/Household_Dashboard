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
    assert response.json()["name"] == "My Awesome Home"
