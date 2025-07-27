import factory
from factory.alchemy import SQLAlchemyModelFactory
from app.models import User
from app import db
from tests.factories.school import SchoolFactory

class UserFactory(SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("name")
    email = factory.Faker("email")
    role = factory.Iterator(["student", "educator", "admin"])
    password_hash = factory.Faker("password")
    school = factory.SubFactory(SchoolFactory)
