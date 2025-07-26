import pytest
from app import create_app, db
from app.models.user import User
from app.models.school import School
from app.config import TestingConfig
from flask_jwt_extended import create_access_token

@pytest.fixture(scope="session")
def app():
    """Create and configure a new app instance for each test session."""
    app = create_app('app.config.TestingConfig')
    with app.app_context():
        db.create_all()
    yield app
    # Optional: Teardown once per session
    with app.app_context():
        db.drop_all()

@pytest.fixture(autouse=True)
def session(app):
    """Run each test in a clean database context."""
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield db.session
        db.session.remove()

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def school(session):
    """Create a school for testing."""
    from app.models.school import School
    school = School(
        name="Test School",
        owner_name="Owner One",
        email="school@example.com"
    )
    session.add(school)
    session.commit()
    return school

@pytest.fixture()
def user(session, school):
    """Create a test admin user tied to the school."""
    user = User(
        name="Admin User",
        email="admin@example.com",
        role="admin",
        school_id=school.id
    )
    user.set_password("password")
    session.add(user)
    session.commit()
    return user

@pytest.fixture()
def auth_header(user):
    """Return a JWT auth header for the created test user."""
    token = create_access_token(identity=user.id)
    return {"Authorization": f"Bearer {token}"}
