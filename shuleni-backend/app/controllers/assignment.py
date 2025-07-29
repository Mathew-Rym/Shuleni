from flask import request, jsonify
from app.models import Assignment, AssignmentSubmission, Class, User
from app import db
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
import os

# CREATE assignment
def create_assignment(school_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()

    title = data.get('title')
    class_id = data.get('class_id')
    description = data.get('description')
    due_date = data.get('due_date')

    if not title or not class_id:
        return jsonify({"msg": "Title and class_id are required"}), 400

    class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not class_:
        return jsonify({"msg": "Class not found"}), 404

    assignment = Assignment(
        title=title,
        class_id=class_id,
        description=description,
        due_date=datetime.fromisoformat(due_date) if due_date else None,
        created_by=current_user_id
    )
    db.session.add(assignment)
    db.session.commit()

    return jsonify(assignment.to_dict()), 201

# LIST assignments for a class
def list_assignments(class_id, school_id):
    assignments = Assignment.query.join(Class).filter(
        Class.id == class_id,
        Class.school_id == school_id
    ).all()
    return jsonify([a.to_dict() for a in assignments]), 200

# GET a single assignment
def get_assignment(assignment_id, school_id):
    assignment = Assignment.query.join(Class).filter(
        Assignment.id == assignment_id,
        Class.school_id == school_id
    ).first()
    if not assignment:
        return jsonify({"msg": "Assignment not found"}), 404

    return jsonify(assignment.to_dict()), 200

# UPDATE assignment
def update_assignment(assignment_id, school_id):
    data = request.get_json()
    assignment = Assignment.query.join(Class).filter(
        Assignment.id == assignment_id,
        Class.school_id == school_id
    ).first()

    if not assignment:
        return jsonify({"msg": "Assignment not found"}), 404

    assignment.title = data.get('title', assignment.title)
    assignment.description = data.get('description', assignment.description)
    if data.get('due_date'):
        assignment.due_date = datetime.fromisoformat(data['due_date'])

    db.session.commit()
    return jsonify(assignment.to_dict()), 200

# DELETE assignment
def delete_assignment(assignment_id, school_id):
    assignment = Assignment.query.join(Class).filter(
        Assignment.id == assignment_id,
        Class.school_id == school_id
    ).first()

    if not assignment:
        return jsonify({"msg": "Assignment not found"}), 404

    db.session.delete(assignment)
    db.session.commit()
    return jsonify({"msg": "Assignment deleted"}), 200

# SUBMIT assignment
def submit_assignment(assignment_id, school_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != 'student':
        return jsonify({"msg": "Only students can submit assignments"}), 403

    assignment = Assignment.query.join(Class).filter(
        Assignment.id == assignment_id,
        Class.school_id == school_id
    ).first()

    if not assignment:
        return jsonify({"msg": "Assignment not found"}), 404

    file = request.files.get('file')
    if not file:
        return jsonify({"msg": "File is required"}), 400

    filename = f"assignment_{assignment_id}_student_{current_user_id}_{file.filename}"
    file_path = os.path.join('uploads/assignments', filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    file.save(file_path)

    submission = AssignmentSubmission(
        assignment_id=assignment_id,
        student_id=current_user_id,
        file_url=file_path
    )
    db.session.add(submission)
    db.session.commit()

    return jsonify(submission.to_dict()), 201

# GET all submissions for an assignment
def get_submissions(assignment_id, school_id):
    assignment = Assignment.query.join(Class).filter(
        Assignment.id == assignment_id,
        Class.school_id == school_id
    ).first()

    if not assignment:
        return jsonify({"msg": "Assignment not found"}), 404

    submissions = AssignmentSubmission.query.filter_by(assignment_id=assignment_id).all()
    return jsonify([s.to_dict() for s in submissions]), 200

def grade_assignment(school_id, id):
    data = request.get_json()
    score = data.get('score')

    if score is None or not isinstance(score, (int, float)) or score < 0 or score > 100:
        return jsonify({'error': 'Invalid score'}), 400

    submission = AssignmentSubmission.query.get(id)

    if not submission:
        return jsonify({'error': 'Assignment submission not found'}), 404

    student = User.query.get(submission.student_id)
    if student.school_id != school_id:
        return jsonify({'error': 'Forbidden'}), 403

    submission.score = score
    db.session.commit()

    return jsonify({'message': 'Assignment graded successfully', 'score': score}), 200

# GRADE an assignment submission
def grade_submission(assignment_id, submission_id, school_id):
    data = request.get_json()
    score = data.get("score")

    if score is None or not (0 <= score <= 100):
        return jsonify({"msg": "Score must be a number between 0 and 100"}), 400

    submission = AssignmentSubmission.query.join(Assignment).join(Class).filter(
        AssignmentSubmission.id == submission_id,
        AssignmentSubmission.assignment_id == assignment_id,
        Class.school_id == school_id
    ).first()

    if not submission:
        return jsonify({"msg": "Submission not found"}), 404

    submission.score = float(score)
    db.session.commit()

    return jsonify(submission.to_dict()), 200

def grade_assignment_submission(submission_id, school_id):
    data = request.get_json()
    score = data.get("score")

    if score is None:
        return jsonify({"msg": "Score is required"}), 400

    submission = AssignmentSubmission.query.join(Assignment).join(Class).filter(
        AssignmentSubmission.id == submission_id,
        Assignment.id == AssignmentSubmission.assignment_id,
        Class.id == Assignment.class_id,
        Class.school_id == school_id
    ).first()

    if not submission:
        return jsonify({"msg": "Submission not found"}), 404

    submission.score = score
    db.session.commit()

    return jsonify(submission.to_dict()), 200