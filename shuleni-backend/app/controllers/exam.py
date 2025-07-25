from datetime import datetime, timezone
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app.models import User, Class, Exam, ExamSubmission, Enrollment
from app.utils.helpers import save_to_db, check_plagiarism

def create_exam(school_id):
    data = request.get_json()
    required = ['class_id', 'title', 'start_time', 'end_time', 'duration_minutes']
    if not all(field in data for field in required):
        return {"msg": "Missing required fields"}, 400
        
    try:
        start_time = datetime.fromisoformat(data['start_time'])
        end_time = datetime.fromisoformat(data['end_time'])
    except ValueError:
        return {"msg": "Invalid datetime format"}, 400
        
    if not Class.query.filter_by(school_id=school_id, id=data['class_id']).first():
        return {"msg": "Class not found"}, 404
        
    exam = Exam(
        class_id=data['class_id'],
        title=data['title'],
        start_time=start_time,
        end_time=end_time,
        duration_minutes=data['duration_minutes'],
        created_by=get_jwt_identity()
    )
    save_to_db(exam)
    return {"msg": "Exam created", "exam_id": exam.id}, 201

def get_exam(school_id, exam_id):
    exam = Exam.query.join(Class).filter(
        Class.school_id == school_id,
        Exam.id == exam_id
    ).first()
    if not exam:
        return {"msg": "Exam not found"}, 404
        
    return {
        "id": exam.id,
        "title": exam.title,
        "start_time": exam.start_time.isoformat(),
        "end_time": exam.end_time.isoformat(),
        "duration": exam.duration_minutes
    }

def list_class_exams(school_id, class_id):
    exams = Exam.query.join(Class).filter(
        Class.school_id == school_id,
        Exam.class_id == class_id
    ).all()
    return [{
        "id": e.id,
        "title": e.title,
        "start_time": e.start_time.isoformat(),
        "end_time": e.end_time.isoformat()
    } for e in exams]

def submit_exam(school_id, exam_id):
    data = request.get_json()
    if not data.get('content'):
        return {"msg": "Exam content required"}, 400

    enrollment = Enrollment.query.filter_by(
    class_id=exam.class_id,
    user_id=student_id
    ).first()

    if not enrollment:
        return {"msg": "Student is not enrolled in this class"}, 403

    exam = Exam.query.join(Class).filter(
        Class.school_id == school_id,
        Exam.id == exam_id
    ).first()
    if not exam:
        return {"msg": "Exam not found"}, 404
        
    now = datetime.now(timezone.utc)
    if now < exam.start_time or now > exam.end_time:
        return {"msg": "Exam is not currently active"}, 403
        
    student_id = get_jwt_identity()
    if ExamSubmission.query.filter_by(exam_id=exam_id, student_id=student_id).first():
        return {"msg": "Already submitted"}, 400
        
    submission = ExamSubmission(
        exam_id=exam_id,
        student_id=student_id,
        content=data['content'],
        plagiarism_flag=check_plagiarism(data['content'])
    )
    save_to_db(submission)
    return {"msg": "Exam submitted", "submission_id": submission.id}, 201

def grade_exam(school_id, exam_id):
    """Educator grades a student's exam submission"""
    data = request.get_json()

    # Validate input
    student_id = data.get('student_id')
    score = data.get('score')

    if not student_id or score is None:
        return jsonify({"msg": "Student ID and score are required"}), 400

    # Check the educator belongs to the same school
    educator = User.query.get(get_jwt_identity())
    if not educator or educator.school_id != school_id:
        return jsonify({"msg": "Unauthorized"}), 403

    # Find the exam and validate school context
    exam = Exam.query.filter_by(id=exam_id).join(Class).filter(Class.school_id == school_id).first()
    if not exam:
        return jsonify({"msg": "Exam not found"}), 404

    # Find the submission
    submission = ExamSubmission.query.filter_by(exam_id=exam.id, student_id=student_id).first()
    if not submission:
        return jsonify({"msg": "Submission not found"}), 404

    # Grade the exam
    try:
        submission.score = float(score)
        save_to_db(submission)
        return jsonify({"msg": "Exam graded successfully", "submission_id": submission.id}), 200
    except Exception as e:
        return jsonify({"msg": "Failed to grade submission", "error": str(e)}), 500

def get_exam_results(school_id, exam_id):
    submissions = ExamSubmission.query.join(Exam).join(Class).filter(
        Class.school_id == school_id,
        Exam.id == exam_id
    ).all()
    return [{
        "student_id": s.student_id,
        "student_name": s.student.name if s.student else "Unknown",
        "score": s.score,
        "submitted_at": s.submitted_at.isoformat()
    } for s in submissions]