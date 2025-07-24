from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from app import db
from app.models import User, School
from app.utils.helpers import save_to_db
from app.utils.validation import validate_school_creation

def register_school():
    """Handle school registration"""
    data = request.get_json()
    
    errors = validate_school_creation(data)
    if errors:
        return {"errors": errors}, 400
        
    if School.query.filter_by(email=data['email']).first():
        return {"msg": "Email already registered"}, 400
        
    school = School(
        name=data['name'],
        owner_name=data['owner_name'],
        email=data['email']
    )
    save_to_db(school)
    
    admin = User(
        school_id=school.id,
        name=data['owner_name'],
        email=data['email'],
        role='admin',
        password_hash=generate_password_hash(data['password'])
    )
    save_to_db(admin)
    
    access_token = create_access_token(identity=admin.id)
    refresh_token = create_refresh_token(identity=admin.id)
    
    return {
        "msg": "School and admin account created",
        "school_id": school.id,
        "access_token": access_token,
        "refresh_token": refresh_token
    }, 201

def login():
    """Handle user login"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"msg": "Email and password required"}, 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return {"msg": "Invalid credentials"}, 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": user.role,
        "school_id": user.school_id
    }, 200

def refresh_token():
    """Handle token refresh"""
    from flask_jwt_extended import get_jwt_identity
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return {"access_token": new_token}