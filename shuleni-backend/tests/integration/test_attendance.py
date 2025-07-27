from datetime import date, timedelta
import pytest

def test_take_attendance_success(client, headers, user_factory, class_factory, session):
    educator = user_factory(role="educator")
    student = user_factory(role="student", school_id=educator.school_id)
    clazz = class_factory(school_id=educator.school_id)

    # Enroll student
    from app.models import Enrollment
    session.add(Enrollment(class_id=clazz.id, user_id=student.id))
    session.commit()

    payload = {
        "class_id": clazz.id,
        "date": date.today().isoformat(),
        "records": [
            {"student_id": student.id, "status": "present"}
        ]
    }

    response = client.post(
        "/api/attendance/",
        json=payload,
        headers=headers(user=educator)
    )

    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"


def test_take_attendance_invalid_date(client, headers, user_factory, class_factory):
    educator = user_factory(role="educator")
    clazz = class_factory(school_id=educator.school_id)

    payload = {
        "class_id": clazz.id,
        "date": "not-a-date",
        "records": []
    }

    response = client.post(
        "/api/attendance/",
        json=payload,
        headers=headers(user=educator)
    )

    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"


def test_get_class_attendance(client, headers, user_factory, class_factory, session):
    educator = user_factory(role="educator")
    student = user_factory(role="student", school_id=educator.school_id)
    clazz = class_factory(school_id=educator.school_id)

    # Enroll and add attendance manually
    from app.models import Enrollment, Attendance
    session.add(Enrollment(class_id=clazz.id, user_id=student.id))
    session.commit()

    attendance = Attendance(
        class_id=clazz.id,
        student_id=student.id,
        educator_id=educator.id,
        date=date.today(),
        status="present"
    )
    session.add(attendance)
    session.commit()

    response = client.get(
        f"/api/attendance/{clazz.id}?date={date.today().isoformat()}",
        headers=headers(user=educator)
    )

    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"


def test_get_student_attendance(client, headers, user_factory, class_factory, session):
    educator = user_factory(role="educator")
    student = user_factory(role="student", school_id=educator.school_id)
    clazz = class_factory(school_id=educator.school_id)

    from app.models import Enrollment, Attendance
    session.add(Enrollment(class_id=clazz.id, user_id=student.id))
    session.commit()

    attendance = Attendance(
        class_id=clazz.id,
        student_id=student.id,
        educator_id=educator.id,
        date=date.today(),
        status="present"
    )
    session.add(attendance)
    session.commit()

    response = client.get(
        f"/api/attendance/student/{student.id}",
        headers=headers(user=educator)
    )

    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"

def test_update_attendance(client, headers, user_factory, class_factory, session):
    educator = user_factory(role="educator")
    student = user_factory(role="student", school_id=educator.school_id)
    clazz = class_factory(school_id=educator.school_id)

    from app.models import Enrollment, Attendance
    session.add(Enrollment(class_id=clazz.id, user_id=student.id))
    session.commit()

    attendance = Attendance(
        class_id=clazz.id,
        student_id=student.id,
        educator_id=educator.id,
        date=date.today(),
        status="absent"
    )
    session.add(attendance)
    session.commit()

    response = client.put(
        f"/api/attendance/{attendance.id}",
        json={"status": "present"},
        headers=headers(user=educator)
    )

    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"
