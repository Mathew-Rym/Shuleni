import factory
from factory.alchemy import SQLAlchemyModelFactory
from app.models import Class
from app import db
from .school import SchoolFactory

class ClassFactory(SQLAlchemyModelFactory):
    class Meta:
        model = Class
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    name = factory.Faker("word")
    year_level = factory.Faker("random_int", min=1, max=12)
    school = factory.SubFactory(SchoolFactory)
