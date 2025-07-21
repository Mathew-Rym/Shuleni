import os
import pytest
from app import create_app, db

class TestConfig:
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "test-secret"

@pytest.fixture(scope="session")
def app():
    os.environ["DATABASE_URL"] = TestConfig.SQLALCHEMY_DATABASE_URI
    os.environ["JWT_SECRET_KEY"] = TestConfig.JWT_SECRET_KEY
    app = create_app()
    app.config["TESTING"] = True

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope="function")
def session(app):
    from app import db as _db
    with app.app_context():
        yield _db.session
        _db.session.rollback()
