from flask import request, jsonify
from app.models import User, Class, Attendance
from app import db
from flask_jwt_extended import get_jwt_identity
from app.utils.auth import get_current_user
from datetime import datetime, timedelta, timezone

# Generic list users by role
def list_users_by_role(role):
    current_user = get_current_user()
    users = User.query.filter_by(school_id=current_user.school_id, role=role).all()
    return jsonify([user.to_dict() for user in users]), 200

# Generic create user with a role
def create_user_with_role(role):
    current_user = get_current_user()
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        school_id=current_user.school_id,
        name=name,
        email=email,
        role=role,
        password_hash=User.generate_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

# Update user if matching role
def update_user_by_id(user_id, role):
    current_user = get_current_user()
    user = User.query.filter_by(id=user_id, school_id=current_user.school_id, role=role).first()
    if not user:
        return jsonify({"error": f"{role.capitalize()} not found"}), 404

    data = request.get_json()
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    db.session.commit()
    return jsonify(user.to_dict()), 200

# Delete user if matching role
def delete_user_by_id(user_id, role):
    current_user = get_current_user()
    user = User.query.filter_by(id=user_id, school_id=current_user.school_id, role=role).first()
    if not user:
        return jsonify({"error": f"{role.capitalize()} not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return '', 204

# Extra (stub for grades/attendance)
def get_student_grades(user_id):
    return jsonify({"grades": []}), 200

def update_student_attendance(user_id):
    data = request.get_json()
    class_id = data.get("class_id")
    status = data.get("status")

    if not class_id or not status:
        return jsonify({"error": "class_id and status are required."}), 400

    attendance = Attendance(
        class_id=class_id,
        student_id=user_id,
        teacher_id=user_id,
        date=datetime.now(timezone.utc).date(),
        status=status
    )
    db.session.add(attendance)
    db.session.commit()
    return jsonify({"status": "Attendance updated"}), 200

def update_teacher_classes(user_id):
    user = User.query.filter_by(id=user_id, role="teacher").first_or_404()
    data = request.get_json()
    class_id= data.get("class_id", [])

    if not isinstance(class_id, list):
        return jsonify({"error": "class_ids must be a list"}), 400

    user.classes.clear()
    for class_id in class_id:
        cls = Class.query.filter_by(id=class_id, school_id=user.school_id).first()
        if cls:
            user.classes.append(cls)

    db.session.commit()
    return jsonify(user.to_dict()), 200

def delete_teacher_from_class(user_id, class_id):
    user = User.query.filter_by(id=user_id, role="teacher").first_or_404()
    cls = Class.query.filter_by(id=class_id, school_id=user.school_id).first_or_404()
    if cls in user.classes:
        user.classes.remove(cls)
        db.session.commit()
    return '', 204