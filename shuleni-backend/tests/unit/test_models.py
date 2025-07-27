from app import db
from app.models import Enrollment, ExamSubmission
from datetime import date

def test_school_relationships(school_factory, user_factory):
    school = school_factory()
    user = user_factory(school_id=school.id)
    assert user.school_id == school.id
    assert user in school.users

def test_class_enrollments(class_factory, user_factory):
    clazz = class_factory()
    student = user_factory(role='student', school_id=clazz.school_id)
    enrollment = Enrollment(class_id=clazz.id, user_id=student.id)
    db.session.add(enrollment)
    db.session.commit()
    assert enrollment.id in [e.id for e in clazz.enrollments]
    assert enrollment.id in [e.id for e in student.enrollments]

def test_resource_upload_relationship(resource_factory, class_factory, user_factory):
    clazz = class_factory()
    educator = user_factory(role='educator', school_id=clazz.school_id)
    resource = resource_factory(class_=clazz, uploaded_by=educator.id)
    assert resource.id in [r.id for r in clazz.resources]
    assert resource.uploader.id == educator.id

def test_attendance_records(class_factory, user_factory):
    from app.models import Attendance
    clazz = class_factory()
    student = user_factory(role='student', school_id=clazz.school_id)
    educator = user_factory(role='educator', school_id=clazz.school_id)
    
    attendance = Attendance(
        class_id=clazz.id,
        student_id=student.id,
        educator_id=educator.id,
        status='present',
        date=date.today()
    )
    db.session.add(attendance)
    db.session.commit()

    
    assert attendance.id in [a.id for a in clazz.attendance_records]
    assert attendance.id in [a.id for a in student.attendance_as_student]
    assert attendance.id in [a.id for a in educator.attendance_as_educator]

def test_exam_submissions(exam_factory, user_factory):
    from app.models import ExamSubmission
    exam = exam_factory()
    student = user_factory(role='student', school_id=exam.class_.school_id)
    
    submission = ExamSubmission(
        exam_id=exam.id,
        student_id=student.id,
        score=85.5
    )
    db.session.add(submission)
    db.session.commit()

    
    assert submission.id in [s.id for s in exam.submissions]
    assert submission.id in [s.id for s in student.exam_submissions]
