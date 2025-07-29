from flask import Flask
from datetime import datetime, timedelta, timezone
from app import create_app, db
from app.models import (
    School, User, Class, Enrollment, Resource, Attendance,
    Exam, ExamSubmission, ChatMessage, Announcement,
    Assignment, AssignmentSubmission, ClassSubject,
    Event, Session, Subject
)

app: Flask = create_app()

def seed_data():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()

        print("Seeding data...")
        
        # Create Schools
        print("Creating schools...")
        school1 = School(
            name="Shuleni High School",
            owner_name="John Doe",
            email="info@shuleni.edu"
        )
        school2 = School(
            name="Prestige Academy",
            owner_name="Jane Smith",
            email="contact@prestige.edu"
        )
        db.session.add_all([school1, school2])
        db.session.commit()

        # Create Users (Admin, Teachers, Students)
        print("Creating users...")
        admin = User(
            school_id=school1.id,
            name="Admin User",
            email="admin@shuleni.edu",
            role="admin",
            avatar_url="https://example.com/avatar1.jpg"
        )
        admin.set_password("admin123")

        teacher1 = User(
            school_id=school1.id,
            name="Math Teacher",
            email="math@shuleni.edu",
            role="teacher",
            avatar_url="https://example.com/avatar2.jpg"
        )
        teacher1.set_password("teacher123")

        teacher2 = User(
            school_id=school1.id,
            name="Science Teacher",
            email="science@shuleni.edu",
            role="teacher",
            avatar_url="https://example.com/avatar3.jpg"
        )
        teacher2.set_password("teacher123")

        student1 = User(
            school_id=school1.id,
            name="Student One",
            email="student1@shuleni.edu",
            role="student",
            avatar_url="https://example.com/avatar4.jpg"
        )
        student1.set_password("student123")

        student2 = User(
            school_id=school1.id,
            name="Student Two",
            email="student2@shuleni.edu",
            role="student",
            avatar_url="https://example.com/avatar5.jpg"
        )
        student2.set_password("student123")

        db.session.add_all([admin, teacher1, teacher2, student1, student2])
        db.session.commit()

        # Create Subjects
        print("Creating subjects...")
        math = Subject(name="Mathematics", school_id=school1.id)
        science = Subject(name="Science", school_id=school1.id)
        english = Subject(name="English", school_id=school1.id)
        db.session.add_all([math, science, english])
        db.session.commit()

        # Create Classes
        print("Creating classes...")
        class1 = Class(
            school_id=school1.id,
            name="Form 1A",
            year_level="Form 1"
        )
        class2 = Class(
            school_id=school1.id,
            name="Form 2B",
            year_level="Form 2"
        )
        db.session.add_all([class1, class2])
        db.session.commit()

        # Create Class Subjects
        print("Creating class subjects...")
        class_subject1 = ClassSubject(
            class_id=class1.id,
            subject_id=math.id,
            teacher_id=teacher1.id
        )
        class_subject2 = ClassSubject(
            class_id=class1.id,
            subject_id=science.id,
            teacher_id=teacher2.id
        )
        db.session.add_all([class_subject1, class_subject2])
        db.session.commit()

        # Create Enrollments
        print("Creating enrollments...")
        enrollment1 = Enrollment(class_id=class1.id, user_id=student1.id)
        enrollment2 = Enrollment(class_id=class1.id, user_id=student2.id)
        enrollment3 = Enrollment(class_id=class2.id, user_id=student1.id)
        db.session.add_all([enrollment1, enrollment2, enrollment3])
        db.session.commit()

        # Create Resources
        print("Creating resources...")
        resource1 = Resource(
            class_id=class1.id,
            uploaded_by=teacher1.id,
            title="Math Syllabus",
            description="Complete syllabus for the term",
            file_url="https://example.com/math_syllabus.pdf"
        )
        resource2 = Resource(
            class_id=class1.id,
            uploaded_by=teacher2.id,
            title="Science Lab Instructions",
            file_url="https://example.com/science_lab.pdf"
        )
        db.session.add_all([resource1, resource2])
        db.session.commit()

        # Create Attendance Records
        print("Creating attendance records...")
        attendance1 = Attendance(
            class_id=class1.id,
            student_id=student1.id,
            teacher_id=teacher1.id,
            date=datetime.now(timezone.utc).date(),
            status="present"
        )
        attendance2 = Attendance(
            class_id=class1.id,
            student_id=student2.id,
            teacher_id=teacher1.id,
            date=datetime.now(timezone.utc).date(),
            status="absent"
        )
        db.session.add_all([attendance1, attendance2])
        db.session.commit()

        # Create Exams
        print("Creating exams...")
        exam1 = Exam(
            class_id=class1.id,
            title="Midterm Math Exam",
            start_time=datetime.now(timezone.utc) + timedelta(days=7),
            end_time=datetime.now(timezone.utc) + timedelta(days=7, hours=2),
            duration_minutes=120,
            created_by=teacher1.id
        )
        exam2 = Exam(
            class_id=class1.id,
            title="Science Quiz",
            start_time=datetime.now(timezone.utc) + timedelta(days=14),
            end_time=datetime.now(timezone.utc) + timedelta(days=14, hours=1),
            duration_minutes=60,
            created_by=teacher2.id
        )
        db.session.add_all([exam1, exam2])
        db.session.commit()

        # Create Exam Submissions
        print("Creating exam submissions...")
        exam_submission1 = ExamSubmission(
            exam_id=exam1.id,
            student_id=student1.id,
            score=85.5
        )
        exam_submission2 = ExamSubmission(
            exam_id=exam1.id,
            student_id=student2.id,
            score=72.0
        )
        db.session.add_all([exam_submission1, exam_submission2])
        db.session.commit()

        # Create Chat Messages
        print("Creating chat messages...")
        chat1 = ChatMessage(
            class_id=class1.id,
            sender_id=teacher1.id,
            message="Remember to submit your assignments by Friday"
        )
        chat2 = ChatMessage(
            class_id=class1.id,
            sender_id=student1.id,
            message="I have a question about problem #3"
        )
        db.session.add_all([chat1, chat2])
        db.session.commit()

        # Create Announcements
        print("Creating announcements...")
        announcement1 = Announcement(
            class_id=class1.id,
            title="School Trip",
            message="We'll be visiting the science museum next week",
            created_by=teacher1.id
        )
        announcement2 = Announcement(
            class_id=class1.id,
            title="Holiday Notice",
            message="No classes on Monday due to public holiday",
            created_by=admin.id
        )
        db.session.add_all([announcement1, announcement2])
        db.session.commit()

        # Create Assignments
        print("Creating assignments...")
        assignment1 = Assignment(
            class_id=class1.id,
            title="Math Homework",
            description="Complete exercises 1-10 on page 45",
            due_date=datetime.now(timezone.utc) + timedelta(days=5),
            created_by=teacher1.id
        )
        assignment2 = Assignment(
            class_id=class1.id,
            title="Science Project",
            description="Prepare a presentation on photosynthesis",
            due_date=datetime.now(timezone.utc) + timedelta(days=14),
            created_by=teacher2.id
        )
        db.session.add_all([assignment1, assignment2])
        db.session.commit()

        # Create Assignment Submissions
        print("Creating assignment submissions...")
        assignment_submission1 = AssignmentSubmission(
            assignment_id=assignment1.id,
            student_id=student1.id,
            file_url="https://example.com/math_homework1.pdf",
            score=95.0
        )
        assignment_submission2 = AssignmentSubmission(
            assignment_id=assignment1.id,
            student_id=student2.id,
            file_url="https://example.com/math_homework2.pdf",
            score=88.5
        )
        db.session.add_all([assignment_submission1, assignment_submission2])
        db.session.commit()

        # Create Events
        print("Creating events...")
        event1 = Event(
            class_id=class1.id,
            title="Parent-Teacher Meeting",
            description="Quarterly meeting with parents",
            start_time=datetime.now(timezone.utc) + timedelta(days=10),
            end_time=datetime.now(timezone.utc) + timedelta(days=10, hours=2),
            created_by=admin.id
        )
        event2 = Event(
            class_id=class1.id,
            title="Science Fair",
            start_time=datetime.now(timezone.utc) + timedelta(days=20),
            created_by=teacher2.id
        )
        db.session.add_all([event1, event2])
        db.session.commit()

        # Create Sessions
        print("Creating sessions...")
        session1 = Session(
            class_id=class1.id,
            title="Math Lesson",
            link="https://meet.example.com/math123",
            start_time=datetime.now(timezone.utc) + timedelta(hours=1),
            end_time=datetime.now(timezone.utc) + timedelta(hours=2),
            hosted_by=teacher1.id
        )
        session2 = Session(
            class_id=class1.id,
            title="Science Lab",
            link="https://meet.example.com/science456",
            start_time=datetime.now(timezone.utc) + timedelta(days=1, hours=10),
            end_time=datetime.now(timezone.utc) + timedelta(days=1, hours=12),
            hosted_by=teacher2.id
        )
        db.session.add_all([session1, session2])
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()