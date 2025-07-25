from app import create_app, db
from app.models import (
    School, User, Class, Enrollment, Resource, Attendance,
    Exam, ExamSubmission, ChatMessage
)
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    print("👉 Seeding DB:", db.engine.url)
    db.drop_all()
    db.create_all()

    ## ------------------------ SCHOOL 1 ------------------------
    school1 = School(
        name="Shuleni Academy",
        owner_name="Admin Alice",
        email="admin@shuleni.com"
    )
    db.session.add(school1)
    db.session.commit()

    admin1 = User(
        name="Admin Alice",
        email="admin@shuleni.com",
        role="admin",
        password_hash=generate_password_hash("admin123"),
        school_id=school1.id
    )
    educator1 = User(
        name="Mr. Teacher",
        email="teacher@shuleni.com",
        role="educator",
        password_hash=generate_password_hash("teach123"),
        school_id=school1.id
    )
    student1 = User(
        name="Student Steve",
        email="student@shuleni.com",
        role="student",
        password_hash=generate_password_hash("student123"),
        school_id=school1.id
    )
    db.session.add_all([admin1, educator1, student1])
    db.session.commit()

    class1 = Class(
        name="Math Class",
        year_level="Grade 6",
        school_id=school1.id
    )
    db.session.add(class1)
    db.session.commit()

    enrollment1 = Enrollment(
        class_id=class1.id,
        user_id=student1.id
    )
    db.session.add(enrollment1)

    resource1 = Resource(
        class_id=class1.id,
        uploaded_by=educator1.id,
        title="Algebra Basics",
        description="Intro to Algebra",
        file_url="https://example.com/algebra.pdf"
    )
    db.session.add(resource1)

    attendance1 = Attendance(
        class_id=class1.id,
        student_id=student1.id,
        educator_id=educator1.id,
        date=datetime.now().date(),
        status="present"
    )
    db.session.add(attendance1)

    exam1 = Exam(
        class_id=class1.id,
        title="Midterm Math Test",
        start_time=datetime.now(),
        end_time=datetime.now() + timedelta(minutes=60),
        duration_minutes=60,
        created_by=educator1.id
    )
    db.session.add(exam1)
    db.session.commit()

    submission1 = ExamSubmission(
        exam_id=exam1.id,
        student_id=student1.id,
        submitted_at=datetime.now(),
        score=88,
        plagiarism_flag=False
    )
    db.session.add(submission1)

    chat1 = ChatMessage(
        class_id=class1.id,
        sender_id=student1.id,
        message="When is the next lesson?"
    )
    db.session.add(chat1)

    ## ------------------------ SCHOOL 2 ------------------------
    school2 = School(
        name="Greenhill School",
        owner_name="Admin Brian",
        email="admin@greenhill.com"
    )
    db.session.add(school2)
    db.session.commit()

    admin2 = User(
        name="Admin Brian",
        email="admin@greenhill.com",
        role="admin",
        password_hash=generate_password_hash("brianadmin"),
        school_id=school2.id
    )
    educator2 = User(
        name="Ms. Grace",
        email="grace@greenhill.com",
        role="educator",
        password_hash=generate_password_hash("grace123"),
        school_id=school2.id
    )
    student2 = User(
        name="Student Sarah",
        email="sarah@greenhill.com",
        role="student",
        password_hash=generate_password_hash("sarah123"),
        school_id=school2.id
    )
    db.session.add_all([admin2, educator2, student2])
    db.session.commit()

    class2 = Class(
        name="Science Class",
        year_level="Grade 5",
        school_id=school2.id
    )
    db.session.add(class2)
    db.session.commit()

    enrollment2 = Enrollment(
        class_id=class2.id,
        user_id=student2.id
    )
    db.session.add(enrollment2)

    resource2 = Resource(
        class_id=class2.id,
        uploaded_by=educator2.id,
        title="Photosynthesis Notes",
        description="Basics of photosynthesis",
        file_url="https://example.com/photosynthesis.pdf"
    )
    db.session.add(resource2)

    attendance2 = Attendance(
        class_id=class2.id,
        student_id=student2.id,
        educator_id=educator2.id,
        date=datetime.now().date(),
        status="absent"
    )
    db.session.add(attendance2)

    exam2 = Exam(
        class_id=class2.id,
        title="Science Quiz 1",
        start_time=datetime.now(),
        end_time=datetime.now() + timedelta(minutes=45),
        duration_minutes=45,
        created_by=educator2.id
    )
    db.session.add(exam2)
    db.session.commit()

    submission2 = ExamSubmission(
        exam_id=exam2.id,
        student_id=student2.id,
        submitted_at=datetime.now(),
        score=92,
        plagiarism_flag=False
    )
    db.session.add(submission2)

    chat2 = ChatMessage(
        class_id=class2.id,
        sender_id=student2.id,
        message="I loved the class today!"
    )
    db.session.add(chat2)

    db.session.commit()
    print("✅ Database seeded successfully with two schools.")
