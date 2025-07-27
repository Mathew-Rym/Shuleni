import factory
from factory.alchemy import SQLAlchemyModelFactory
from datetime import datetime, timedelta, timezone
from app.models import Exam
from app import db
from .school import SchoolFactory
from .class_ import ClassFactory
from .user import UserFactory

class ExamFactory(SQLAlchemyModelFactory):
    class Meta:
        model = Exam
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "commit"

    title = factory.Faker("sentence", nb_words=3)
    start_time = factory.LazyFunction(lambda: datetime.now(timezone.utc))
    end_time = factory.LazyFunction(lambda: datetime.now(timezone.utc) + timedelta(minutes=60))
    duration_minutes = 60

    # Create one shared school and assign to both created_by and class_
    school = factory.SubFactory(SchoolFactory)
    created_by = factory.LazyAttribute(lambda obj: UserFactory(school=obj.school))
    class_ = factory.LazyAttribute(lambda obj: ClassFactory(school=obj.school))
