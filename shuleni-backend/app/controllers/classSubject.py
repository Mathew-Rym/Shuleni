from flask import request, jsonify
from app.models import db, ClassSubject, Subject, User, Class
from flask_jwt_extended import get_jwt_identity


def assign_subject_to_class(class_id):
    data = request.get_json()
    subject_id = data.get("subject_id")
    educator_id = data.get("educator_id")

    if not subject_id or not educator_id:
        return {"msg": "subject_id and educator_id are required"}, 400

    # Optional: validate existence
    subject = Subject.query.get(subject_id)
    educator = User.query.get(educator_id)
    clazz = Class.query.get(class_id)

    if not subject or not educator or not clazz:
        return {"msg": "Invalid subject, class, or educator"}, 404

    cs = ClassSubject(class_id=class_id, subject_id=subject_id, educator_id=educator_id)
    db.session.add(cs)
    db.session.commit()

    return {"msg": "Subject assigned to class", "class_subject": cs.to_dict()}, 201


def get_class_subjects(class_id):
    class_subjects = ClassSubject.query.filter_by(class_id=class_id).all()
    return jsonify([cs.to_dict() for cs in class_subjects]), 200


def remove_subject_from_class(class_id, subject_id):
    cs = ClassSubject.query.filter_by(class_id=class_id, subject_id=subject_id).first()
    if not cs:
        return {"msg": "Subject not found in this class"}, 404

    db.session.delete(cs)
    db.session.commit()
    return {"msg": "Subject removed from class"}, 200
