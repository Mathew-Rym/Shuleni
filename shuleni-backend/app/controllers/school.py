from flask import request
from werkzeug.security import generate_password_hash

from app.models import User
from app.utils.helpers import save_to_db, delete_from_db
from app.utils.validation import validate_user_creation

def create_user(school_id):
    data = request.get_json()
    role = data.get('role', 'student')
    
    if errors := validate_user_creation(data, role):
        return {"errors": errors}, 400
        
    if User.query.filter_by(school_id=school_id, email=data['email']).first():
        return {"msg": "Email already registered in this school"}, 400
        
    user = User(
        school_id=school_id,
        name=data['name'],
        email=data['email'],
        role=role,
        password_hash=generate_password_hash(data.get('password', 'defaultpassword'))
    )
    save_to_db(user)
    return {"msg": f"{role.capitalize()} created", "user_id": user.id}, 201

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