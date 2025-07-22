from datetime import datetime, timedelta, timezone
from app.models.school import School
from app.models.user import User
from app.models.class_ import Class
from app.models.enrollment import Enrollment
from app.models.resource import Resource
from app.models.attendance import Attendance
from app.models.exam import Exam
from app.models.exam_submission import ExamSubmission
from app.models.chat import ChatMessage
from app.models.videosession import VideoSession
from app.models.club import Club
from app.models.clubmember import ClubMember

def test_school_user_relationship(session):
    school = School(name="TestSchool", owner_name="Admin", email="test@school.com")
    session.add(school); session.commit()
    assert school.id

    user = User(school_id=school.id, name="Alice", email="alice@school.com", role="student", password_hash="pw")
    session.add(user); session.commit()
    assert user.school == school and user in school.users

def test_class_enrollment(session):
    school = School(name="S2", owner_name="Admin2", email="s2@school.com")
    session.add(school); session.commit()

    clazz = Class(school_id=school.id, name="Devops", year_level="1")
    session.add(clazz); session.commit()
    assert clazz.school == school

    user = User(school_id=school.id, name="Bob", email="bob@school.com", role="student", password_hash="pw")
    session.add(user); session.commit()

    enrollment = Enrollment(class_id=clazz.id, user_id=user.id)
    session.add(enrollment); session.commit()
    assert enrollment in clazz.enrollments and enrollment in user.enrollments

def test_resource_attendance_exam_submission(session):
    school = School(name="S3", owner_name="Admin3", email="s3@school.com")
    session.add(school); session.commit()
    user = User(school_id=school.id, name="Eve", email="eve@school.com", role="educator", password_hash="pw")
    session.add(user); session.commit()
    clazz = Class(school_id=school.id, name="S.analysis", year_level="2")
    session.add(clazz); session.commit()

    res = Resource(class_id=clazz.id, uploaded_by=user.id, title="Notes", description="desc", file_url="file.pdf")
    session.add(res); session.commit()
    assert res in clazz.resources and res.uploader == user

    today = datetime.now(timezone.utc).date()
    att = Attendance(class_id=clazz.id, student_id=user.id, educator_id=user.id, date=today, status="present")
    session.add(att); session.commit()
    assert att in clazz.attendance_records

    start = datetime.now(timezone.utc)
    exam = Exam(class_id=clazz.id, title="Test", start_time=start, end_time=start+timedelta(hours=1), duration_minutes=60, created_by=user.id)
    session.add(exam); session.commit()
    assert exam in clazz.exams

    sub = ExamSubmission(exam_id=exam.id, student_id=user.id, score=85.5, plagiarism_flag=False)
    session.add(sub); session.commit()
    assert sub in exam.submissions and sub.student == user

def test_chat_video_club_membership(session):
    school = School(name="S4", owner_name="Admin4", email="s4@school.com")
    session.add(school); session.commit()
    user = User(school_id=school.id, name="Carl", email="carl@school.com", role="student", password_hash="pw")
    session.add(user); session.commit()
    clazz = Class(school_id=school.id, name="Comp Sci", year_level="3")
    session.add(clazz); session.commit()

    chat = ChatMessage(class_id=clazz.id, sender_id=user.id, message="Hello")
    session.add(chat); session.commit()
    assert chat in clazz.chats and chat.sender == user

    now = datetime.now(timezone.utc)
    vs = VideoSession(class_id=clazz.id, hosted_by=user.id, title="Zoom", link="http://", start_time=now, end_time=now)
    session.add(vs); session.commit()
    assert vs in clazz.video_sessions and vs.host == user

    club = Club(school_id=school.id, name="Chess", description="Club")
    session.add(club); session.commit()

    cm = ClubMember(club_id=club.id, user_id=user.id)
    session.add(cm); session.commit()
    assert cm in club.members and cm.user == user
