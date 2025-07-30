from flask import request
from werkzeug.security import generate_password_hash
from app.models.user import User
from app import db
from app.utils.helpers import save_to_db, delete_from_db
from app.utils.validation import validate_user_creation

def create_user(school_id):
    """Create a new user for a given school"""
    data = request.get_json()

    errors = validate_user_creation(data)
    if errors:
        return {"errors": errors}, 400

    role = data.get("role", "student").lower()

    if User.query.filter_by(email=data["email"], school_id=school_id).first():
        return {"msg": "Email already registered in this school"}, 400

    user = User(
        school_id=school_id,
        name=data["name"],
        email=data["email"],
        role=role,
        password_hash=generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()

    print(f"✅ User created: {user.email} | Role: {user.role} | School ID: {school_id}")

    return {
        "msg": "User created successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }, 201

def delete_user(school_id, user_id):
    user = User.query.filter_by(school_id=school_id, id=user_id).first()
    if not user:
        return {"msg": "User not found"}, 404
    if user.role == 'admin':
        return {"msg": "Cannot delete admin user"}, 403
    delete_from_db(user)
    return {"msg": "User deleted"}

def list_users(school_id):
    users = User.query.filter_by(school_id=school_id)
    if role := request.args.get('role'):
        users = users.filter_by(role=role)
    return [{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role,
        "created_at": u.created_at.isoformat()
    } for u in users.all()]

def get_school_info(school_id):
    from app.models import School
    school = School.query.get(school_id)
    return {
        "id": school.id,
        "name": school.name,
        "owner_name": school.owner_name,
        "created_at": school.created_at.isoformat()
    }

def __repr__(self):
    return f"<School {self.name} ({self.email})>"
