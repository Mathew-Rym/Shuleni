import json
import pytest
from app import db
from app.models.user import User
from sqlalchemy.exc import IntegrityError

@pytest.fixture(autouse=True)
def clean_db():
    """Rollback failed transactions and clean all tables after each test."""
    yield
    db.session.rollback()
    for table in reversed(db.metadata.sorted_tables):
        db.session.execute(table.delete())
    db.session.commit()

def test_signup_success(client):
    data = {
        "school_id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "role": "student",
        "password": "password123"
    }
    response = client.post('/auth/signup', json=data)
    assert response.status_code == 201
    assert response.json['user']['email'] == "alice@example.com"

def test_signup_duplicate_email(client):
    try:
        db.session.add(User(
            school_id=1,
            name="Alice",
            email="alice@example.com",
            role="student",
            password_hash="fakehash"
        ))
        db.session.commit()
    except IntegrityError:
        db.session.rollback()

    data = {
        "school_id": 1,
        "name": "Alice",
        "email": "alice@example.com",  # duplicate
        "role": "student",
        "password": "password123"
    }
    response = client.post('/auth/signup', json=data)
    assert response.status_code == 400
    assert "Email already in use" in response.json['error']

def test_login_success(client):
    user = User(
        school_id=1,
        name="Bob",
        email="bob@example.com",
        role="educator"
    )
    user.set_password("secret")
    db.session.add(user)
    db.session.commit()

    response = client.post('/auth/login', json={
        "email": "bob@example.com",
        "password": "secret"
    })
    assert response.status_code == 200
    assert "access_token" in response.json

def test_login_wrong_password(client):
    user = User(
        school_id=1,
        name="Carol",
        email="carol@example.com",
        role="educator"
    )
    user.set_password("correct-password")
    db.session.add(user)
    db.session.commit()

    response = client.post('/auth/login', json={
        "email": "carol@example.com",
        "password": "wrong-password"
    })
    assert response.status_code == 401
    assert "Invalid credentials" in response.json['error']
