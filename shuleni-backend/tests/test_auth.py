import pytest
from app.models import User, School

def test_school_registration(client, session):
    data = {
        "name": "Test School",
        "owner_name": "John Doe",
        "email": "test@school.com",
        "password": "securepassword"
    }
    
    response = client.post('auth/register/school', json=data)
    assert response.status_code == 201
    assert b"School and admin account created" in response.data
    
    # Verify school was created
    school = School.query.first()
    assert school.name == "Test School"
    
    # Verify admin user was created
    admin = User.query.first()
    assert admin.role == "admin"
    assert admin.school_id == school.id

def test_login(client, session, school, user):
    data = {
        "email": user.email,
        "password": "adminpassword"
    }
    
    response = client.post('/auth/login', json=data)
    assert response.status_code == 200
    assert b"access_token" in response.data
    assert b"refresh_token" in response.data