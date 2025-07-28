from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Subject
from utils.auth import roles_required, school_required

def create_subject():
    data = request.get_json()
    name = data.get("name")
    school_id = data.get("school_id")  # school_id is typically inferred from user in production

    if not name or not school_id:
        return {"msg": "Name and school_id are required"}, 400

    subject = Subject(name=name, school_id=school_id)
    db.session.add(subject)
    db.session.commit()

    return {"msg": "Subject created", "subject": subject.to_dict()}, 201

def list_subjects():
    subjects = Subject.query.all()
    return jsonify([s.to_dict() for s in subjects]), 200

def get_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    return jsonify(subject.to_dict()), 200

def update_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    data = request.get_json()
    name = data.get("name")
    if name:
        subject.name = name
    db.session.commit()
    return {"msg": "Subject updated", "subject": subject.to_dict()}, 200

def delete_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    db.session.delete(subject)
    db.session.commit()
    return {"msg": "Subject deleted"}, 200
