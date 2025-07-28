from app import create_app, db
from flask import Flask
from app.models import (
    School, User, Class, Enrollment, Resource, Attendance, Exam, ExamSubmission,
    Assignment, AssignmentSubmission, ChatMessage, Session
)
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta, timezone

app: Flask = create_app()

with app.app_context():
    # Clear existing data (respect foreign key order)
    print("Deleting existing data...")
    db.session.query(ChatMessage).delete()
    db.session.query(Session).delete()
    db.session.query(AssignmentSubmission).delete()
    db.session.query(Assignment).delete()
    db.session.query(ExamSubmission).delete()
    db.session.query(Exam).delete()
    db.session.query(Attendance).delete()
    db.session.query(Resource).delete()
    db.session.query(Enrollment).delete()
    db.session.query(Class).delete()
    db.session.query(User).delete()
    db.session.query(School).delete()
    db.session.commit()

    # Seed Schools
    print("Seeding schools...")
    schools = [
        School(name="Greenhill Academy", owner_name="Alice Mwangi", email="admin1@greenhill.com"),
        School(name="Bluewave School", owner_name="Bob Otieno", email="admin2@bluewave.com"),
        School(name="Sunrise High", owner_name="Carol Wanjiku", email="admin3@sunrise.com")
    ]
    db.session.add_all(schools)
    db.session.commit()

    # Seed Users (educator + 2 students per school)
    print("Seeding users...")
    users = []
    for school in schools:
        educator = User(
            school_id=school.id,
            name=f"{school.name.split()[0]} Educator",
            email=f"educator@{school.name.lower().replace(' ', '')}.com",
            role="educator",
            password_hash=generate_password_hash("password")
        )
        students = [
            User(
                school_id=school.id,
                name=f"{school.name.split()[0]} Student {i+1}",
                email=f"student{i+1}@{school.name.lower().replace(' ', '')}.com",
                role="student",
                password_hash=generate_password_hash("password")
            )
            for i in range(2)
        ]
        db.session.add(educator)
        db.session.add_all(students)
        users.extend([educator] + students)
    db.session.commit()

    # Seed Classes
    print("Seeding classes...")
    classes = []
    for i, school in enumerate(schools):
        clazz = Class(
            school_id=school.id,
            name=f"Class {i+1}",
            year_level=f"Grade {6+i}"
        )
        db.session.add(clazz)
        classes.append(clazz)
    db.session.commit()

    # Seed Enrollments
    print("Enrolling students...")
    for clazz in classes:
        school_students = [u for u in users if u.school_id == clazz.school_id and u.role == "student"]
        for student in school_students:
            db.session.add(Enrollment(class_id=clazz.id, user_id=student.id))
    db.session.commit()

    # Seed Resources
    print("Adding resources...")
    for clazz in classes:
        teacher = next(u for u in users if u.school_id == clazz.school_id and u.role == "educator")
        db.session.add_all([
            Resource(class_id=clazz.id, uploaded_by=teacher.id, title="Intro Notes", description="PDF notes", file_url="/files/intro.pdf"),
            Resource(class_id=clazz.id, uploaded_by=teacher.id, title="Lesson Slides", description="PowerPoint", file_url="/files/slides.pptx"),
            Resource(class_id=clazz.id, uploaded_by=teacher.id, title="Assignment PDF", description="Homework", file_url="/files/hw.pdf")
        ])
    db.session.commit()

    # Seed Attendance
    print("Taking attendance...")
    for clazz in classes:
        teacher = next(u for u in users if u.school_id == clazz.school_id and u.role == "educator")
        students = [u for u in users if u.school_id == clazz.school_id and u.role == "student"]
        for student in students:
            db.session.add(Attendance(
                class_id=clazz.id,
                student_id=student.id,
                educator_id=teacher.id,
                date=datetime.now(timezone.utc).date(),
                status="present"
            ))
    db.session.commit()

    # Seed Exams and Submissions
    print("Creating exams and submissions...")
    for clazz in classes:
        teacher = next(u for u in users if u.school_id == clazz.school_id and u.role == "educator")
        exam = Exam(
            class_id=clazz.id,
            title="Midterm Exam",
            start_time=datetime.now(timezone.utc),
            end_time=datetime.now(timezone.utc) + timedelta(hours=1),
            duration_minutes=60,
            created_by=teacher.id
        )
        db.session.add(exam)
        db.session.commit()

        students = [u for u in users if u.school_id == clazz.school_id and u.role == "student"]
        for student in students:
            db.session.add(ExamSubmission(
                exam_id=exam.id,
                student_id=student.id,
                submitted_at=datetime.now(timezone.utc),
                score=80 + students.index(student),
                plagiarism_flag=False
            ))
    db.session.commit()

    # Seed Assignments and Submissions
    print("Creating assignments and submissions...")
    for clazz in classes:
        teacher = next(u for u in users if u.school_id == clazz.school_id and u.role == "educator")
        assignment = Assignment(
            class_id=clazz.id,
            title="Homework 1",
            description="Solve problems 1-10",
            due_date=datetime.now(timezone.utc) + timedelta(days=7),
            created_by=teacher.id
        )
        db.session.add(assignment)
        db.session.commit()

        students = [u for u in users if u.school_id == clazz.school_id and u.role == "student"]
        for student in students:
            db.session.add(AssignmentSubmission(
                assignment_id=assignment.id,
                student_id=student.id,
                submitted_at=datetime.now(timezone.utc),
                file_url="/files/submission.pdf",
                score=80 + students.index(student)
            ))
    db.session.commit()

    # Seed Chats
    print("Sending chats...")
    for clazz in classes:
        sender = next(u for u in users if u.school_id == clazz.school_id)
        db.session.add_all([
            ChatMessage(class_id=clazz.id, sender_id=sender.id, message="Hello class!", sent_at=datetime.now(timezone.utc)),
            ChatMessage(class_id=clazz.id, sender_id=sender.id, message="Reminder for tomorrow.", sent_at=datetime.now(timezone.utc))
        ])
    db.session.commit()

    # Seed Video Sessions
    print("Scheduling video sessions...")
    for clazz in classes:
        teacher = next(u for u in users if u.school_id == clazz.school_id and u.role == "educator")
        db.session.add(Session(
            class_id=clazz.id,
            hosted_by=teacher.id,
            title="Zoom Class",
            link="https://zoom.us/fake-link",
            start_time=datetime.now(timezone.utc),
            end_time=datetime.now(timezone.utc) + timedelta(hours=1)
        ))
    db.session.commit()

    print("✅ Done seeding data!")
