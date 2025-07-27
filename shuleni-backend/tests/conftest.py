import pytest
import tempfile
from faker import Faker
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token
from app import create_app, db
from sqlalchemy.orm import scoped_session, sessionmaker

fake = Faker()

@pytest.fixture(scope='session')
def app():
    app = create_app('testing')
    app.config['UPLOAD_FOLDER'] = tempfile.mkdtemp()
    app.config['SUBMISSION_FOLDER'] = tempfile.mkdtemp()
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(autouse=True)
def session(app):
    with app.app_context():
        connection = db.engine.connect()
        transaction = connection.begin()

        Session = scoped_session(sessionmaker(bind=connection))
        session = Session()

        yield session

        session.close()
        transaction.rollback()
        connection.close()

@pytest.fixture
def school_factory(session):
    from app.models import School
    def _factory(**kwargs):
        school = School(
            name=kwargs.get('name', fake.company()),
            owner_name=kwargs.get('owner_name', fake.name()),
            email=kwargs.get('email', fake.email())
        )
        session.add(school)
        session.commit()
        return school
    return _factory

@pytest.fixture
def user_factory(session, school_factory):
    from app.models import User
    def _factory(**kwargs):
        school_id = kwargs.get('school_id')
        if not school_id:
            school = school_factory()
            school_id = school.id

        user = User(
            school_id=school_id,
            name=kwargs.get('name', fake.name()),
            email=kwargs.get('email', fake.email()),
            role=kwargs.get('role', 'student')
        )
        user.set_password(kwargs.get('password', 'password'))
        session.add(user)
        session.commit()
        return user
    return _factory

@pytest.fixture
def class_factory(session, school_factory):
    from app.models import Class
    def _factory(**kwargs):
        school_id = kwargs.get('school_id') or school_factory().id
        cls = Class(
            name=kwargs.get('name', fake.word()),
            year_level=kwargs.get('year_level', 'Grade 1'),
            school_id=school_id
        )
        session.add(cls)
        session.commit()
        return cls
    return _factory

@pytest.fixture
def resource_factory(session, class_factory, user_factory):
    from app.models import Resource
    def _factory(**kwargs):
        cls = kwargs.get('class_') or class_factory()
        uploader = kwargs.get('uploaded_by') or user_factory(role='educator', school_id=cls.school_id)
        resource = Resource(
            class_id=cls.id,
            uploaded_by=uploader,
            title=kwargs.get('title', fake.sentence()),
            description=kwargs.get('description', fake.paragraph()),
            file_url=kwargs.get('file_url', 'http://example.com/resource.pdf')
        )
        session.add(resource)
        session.commit()
        return resource
    return _factory

@pytest.fixture
def exam_factory(session, class_factory, user_factory):
    from app.models import Exam
    def _factory(**kwargs):
        cls = kwargs.get('class_') or class_factory()
        creator = kwargs.get('created_by') or user_factory(role='educator', school_id=cls.school_id)
        exam = Exam(
            class_id=cls.id,
            title=kwargs.get('title', 'Midterm Exam'),
            start_time = kwargs.get('start_time', datetime.now(timezone.utc)),
            end_time = kwargs.get('end_time', datetime.now(timezone.utc) + timedelta(minutes=60)),
            duration_minutes=kwargs.get('duration_minutes', 60),
            created_by=creator.id
        )
        session.add(exam)
        session.commit()
        return exam
    return _factory

@pytest.fixture
def headers(user_factory):
    def _headers(role='admin', user=None, **kwargs):
        if not user:
            user = user_factory(role=role, **kwargs)
        token = create_access_token(identity=user.id)
        return {'Authorization': f'Bearer {token}'}
    return _headers
