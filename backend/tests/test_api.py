from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()
    assert "status" in data