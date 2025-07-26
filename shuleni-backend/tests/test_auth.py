import json
from flask_jwt_extended import create_refresh_token, decode_token

def test_register_school_success(client, session):
    data = {
        "name": "New School",
        "owner_name": "Jane Doe",
        "email": "jane@school.com",
        "password": "strongpass123"
    }
    response = client.post("/auth/register/school", json=data)
    
    assert response.status_code == 201
    res = response.get_json()
    assert "school_id" in res
    assert "access_token" in res
    assert "refresh_token" in res

def test_register_school_duplicate_email(client, session, school):
    data = {
        "name": "Duplicate School",
        "owner_name": "John Doe",
        "email": school.email,  # Existing email
        "password": "anotherpass123"
    }
    response = client.post("/auth/register/school", json=data)
    assert response.status_code == 400
    assert response.get_json()["msg"] == "Email already registered"

def test_register_school_invalid_data(client):
    data = {
        "name": "A",
        "owner_name": "",
        "email": "invalid-email",
        "password": "123"
    }
    response = client.post("/auth/register/school", json=data)
    assert response.status_code == 400
    json_data = response.get_json()["errors"]
    assert "name" in json_data
    assert "owner_name" in json_data
    assert "email" in json_data
    assert "password" in json_data

def test_login_success(client, user):
    data = {
        "email": user.email,
        "password": "password"
    }
    response = client.post("/auth/login", json=data)
    assert response.status_code == 200
    res = response.get_json()
    assert "access_token" in res
    assert "refresh_token" in res
    assert res["school_id"] == user.school_id

def test_login_invalid_credentials(client):
    data = {
        "email": "fake@example.com",
        "password": "wrongpass"
    }
    response = client.post("/auth/login", json=data)
    assert response.status_code == 401
    assert response.get_json()["msg"] == "Invalid credentials"

def test_login_missing_fields(client):
    response = client.post("/auth/login", json={})
    assert response.status_code == 400
    assert response.get_json()["msg"] == "Email and password required"

def test_refresh_token_success(client, user):

    refresh = create_refresh_token(identity=str(user.id))

    decoded = decode_token(refresh)
    print("🔍 DECODED REFRESH TOKEN:", decoded)

    headers = {"Authorization": f"Bearer {refresh}"}
    response = client.post("/auth/refresh", headers=headers)

    print("🔁 RESPONSE STATUS:", response.status_code)
    print("🔁 RESPONSE JSON:", response.get_json())

    assert response.status_code == 200
    assert "access_token" in response.get_json()


def test_refresh_token_unauthorized(client):
    response = client.post("/auth/refresh")
    assert response.status_code == 401
