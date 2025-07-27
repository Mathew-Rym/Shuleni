import factory
from factory.alchemy import SQLAlchemyModelFactory
from app.models import School
from app import db

class SchoolFactory(SQLAlchemyModelFactory):
    class Meta:
        model = School
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("company")
    owner_name = factory.Faker("name")
    email = factory.Faker("email")
