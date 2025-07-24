from flask import send_file, current_app
import os
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from app.models import ExamSubmission, Exam, Class
from app.utils.helpers import check_plagiarism

def get_submission(school_id, submission_id):
    submission = ExamSubmission.query.join(Exam).join(Class).filter(
        Class.school_id == school_id,
        ExamSubmission.id == submission_id,
        ExamSubmission.student_id == get_jwt_identity()  # Only owner can view
    ).first()
    
    if not submission:
        return {"msg": "Submission not found"}, 404
        
    return {
        "id": submission.id,
        "exam_id": submission.exam_id,
        "submitted_at": submission.submitted_at.isoformat(),
        "score": submission.score,
        "plagiarism_flag": submission.plagiarism_flag,
        "feedback": submission.feedback
    }

def get_student_submissions(school_id):
    student_id = get_jwt_identity()
    submissions = ExamSubmission.query.join(Exam).join(Class).filter(
        Class.school_id == school_id,
        ExamSubmission.student_id == student_id
    ).all()
    
    return [{
        "id": s.id,
        "exam_id": s.exam_id,
        "exam_title": s.exam.title,
        "submitted_at": s.submitted_at.isoformat(),
        "score": s.score
    } for s in submissions]

def get_exam_submissions(school_id, exam_id):
    submissions = ExamSubmission.query.join(Exam).join(Class).filter(
        Class.school_id == school_id,
        ExamSubmission.exam_id == exam_id
    ).all()
    
    return [{
        "id": s.id,
        "student_id": s.student_id,
        "student_name": s.student.name,
        "submitted_at": s.submitted_at.isoformat(),
        "score": s.score,
        "plagiarism_flag": s.plagiarism_flag
    } for s in submissions]

def download_submission_file(school_id, submission_id):
    submission = ExamSubmission.query.join(Exam).join(Class).filter(
        Class.school_id == school_id,
        ExamSubmission.id == submission_id
    ).first()
    
    if not submission:
        return {"msg": "Submission not found"}, 404
        
    file_path = os.path.join(
        current_app.config['SUBMISSION_FOLDER'],
        submission.file_path
    )
    
    if not os.path.exists(file_path):
        return {"msg": "File not found"}, 404
        
    return send_file(
        file_path,
        as_attachment=True,
        download_name=f"submission_{submission.id}.pdf"
    )