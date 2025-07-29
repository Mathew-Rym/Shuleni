from flask import request, jsonify
from app.models import ClassSubject, Subject, Class, User
from app import db

# ASSIGN subject to a class with teacher
def assign_subject_to_class(school_id, class_id):
    data = request.get_json()
    subject_id = data.get('subject_id')
    teacher_id = data.get('teacher_id')

    if not subject_id or not teacher_id:
        return jsonify({"error": "subject_id and teacher_id are required"}), 400

    # Check subject, teacher, and class belong to school
    subject = Subject.query.filter_by(id=subject_id, school_id=school_id).first()
    class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
    teacher = User.query.filter_by(id=teacher_id, school_id=school_id, role='teacher').first()

    if not all([subject, class_, teacher]):
        return jsonify({"error": "Invalid class, subject, or teacher"}), 404

    # Prevent duplicate
    existing = ClassSubject.query.filter_by(class_id=class_id, subject_id=subject_id).first()
    if existing:
        return jsonify({"error": "Subject already assigned to class"}), 409

    cs = ClassSubject(class_id=class_id, subject_id=subject_id, teacher_id=teacher_id)
    db.session.add(cs)
    db.session.commit()
    return jsonify(cs.to_dict()), 201

# LIST subjects for a class
def get_class_subjects(school_id, class_id):
    class_ = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not class_:
        return jsonify({"error": "Class not found"}), 404

    class_subjects = ClassSubject.query.filter_by(class_id=class_id).all()
    return jsonify([cs.to_dict() for cs in class_subjects]), 200

# REMOVE subject from a class
def remove_subject_from_class(school_id, class_id, subject_id):
    cs = (
        ClassSubject.query
        .join(Class)
        .filter(
            ClassSubject.class_id == class_id,
            ClassSubject.subject_id == subject_id,
            Class.school_id == school_id
        )
        .first()
    )

    if not cs:
        return jsonify({"error": "Subject not assigned to this class or not found"}), 404

    db.session.delete(cs)
    db.session.commit()
    return jsonify({"message": "Subject removed from class"}), 200
