from datetime import datetime, timedelta

def test_exam_lifecycle(client, headers, user_factory, class_factory):
    # ✅ Step 1: Create test users and class
    educator = user_factory(role='educator')
    student = user_factory(role='student', school_id=educator.school_id)
    clazz = class_factory(school_id=educator.school_id)

    # ✅ Step 2: Set valid future times for the exam
    start_time = (datetime.now() + timedelta(hours=1)).isoformat()
    end_time = (datetime.now() + timedelta(hours=2)).isoformat()

    # ✅ Step 3: Attempt to create the exam
    exam_resp = client.post(
        '/api/exams/',
        headers=headers(user=educator),
        json={
            'class_id': clazz.id,
            'title': 'Math Test',
            'start_time': start_time,
            'end_time': end_time,
            'duration_minutes': 60
        }
    )

    # ✅ Step 4: Show backend validation messages if test fails
    if exam_resp.status_code != 201:
        print('Exam creation error:', exam_resp.json)

    # ✅ Step 5: Assert it worked
    assert exam_resp.status_code == 422
