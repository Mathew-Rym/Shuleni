from flask import request, jsonify
from app.models import Subject, db
from flask_jwt_extended import get_jwt_identity
from app.models.user import User

# CREATE subject
def create_subject(school_id):
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"error": "Subject name is required"}), 400

    subject = Subject(name=name, school_id=school_id)
    db.session.add(subject)
    db.session.commit()
    return jsonify(subject.to_dict()), 201

# LIST all subjects for the current school
def list_subjects(school_id):
    subjects = Subject.query.filter_by(school_id=school_id).all()
    return jsonify([s.to_dict() for s in subjects]), 200

# GET one subject by id
def get_subject(school_id, subject_id):
    subject = Subject.query.filter_by(id=subject_id, school_id=school_id).first()
    if not subject:
        return jsonify({"error": "Subject not found"}), 404
    return jsonify(subject.to_dict()), 200

# UPDATE subject
def update_subject(school_id, subject_id):
    subject = Subject.query.filter_by(id=subject_id, school_id=school_id).first()
    if not subject:
        return jsonify({"error": "Subject not found"}), 404

    data = request.get_json()
    name = data.get('name')
    if name:
        subject.name = name
        db.session.commit()
    return jsonify(subject.to_dict()), 200

# DELETE subject
def delete_subject(school_id, subject_id):
    subject = Subject.query.filter_by(id=subject_id, school_id=school_id).first()
    if not subject:
        return jsonify({"error": "Subject not found"}), 404

    db.session.delete(subject)
    db.session.commit()
    return jsonify({"message": "Subject deleted"}), 200
