# app/routes/school_routes.py
from flask import Blueprint, request, jsonify
from app.models.school import School
from app.models.user import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

school_bp = Blueprint('school_bp', __name__, url_prefix='/schools')

# Create a new school
@school_bp.route('', methods=['POST'])
@jwt_required()
def create_school():
    data = request.get_json()
    name = data.get('name')
    owner_name = data.get('owner_name')
    email = data.get('email')

    if not name or not email:
        return jsonify({"error": "Missing required fields"}), 400

    existing_school = School.query.filter_by(email=email).first()
    if existing_school:
        return jsonify({"error": "School already exists"}), 400

    new_school = School(name=name, owner_name=owner_name, email=email)
    db.session.add(new_school)
    db.session.commit()

    return jsonify({"message": "School created", "school": {
        "id": new_school.id,
        "name": new_school.name,
        "owner_name": new_school.owner_name,
        "email": new_school.email
    }}), 201

# Get all schools
@school_bp.route('', methods=['GET'])
@jwt_required()
def get_schools():
    schools = School.query.all()
    return jsonify([{
        "id": s.id,
        "name": s.name,
        "owner_name": s.owner_name,
        "email": s.email
    } for s in schools]), 200

# Get single school by ID
@school_bp.route('/<int:school_id>', methods=['GET'])
@jwt_required()
def get_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({"error": "School not found"}), 404
    return jsonify({
        "id": school.id,
        "name": school.name,
        "owner_name": school.owner_name,
        "email": school.email
    }), 200

# Update a school
@school_bp.route('/<int:school_id>', methods=['PATCH'])
@jwt_required()
def update_school(school_id):
    data = request.get_json()
    school = School.query.get(school_id)
    if not school:
        return jsonify({"error": "School not found"}), 404

    school.name = data.get("name", school.name)
    school.owner_name = data.get("owner_name", school.owner_name)
    school.email = data.get("email", school.email)

    db.session.commit()

    return jsonify({"message": "School updated"}), 200

# Delete a school
@school_bp.route('/<int:school_id>', methods=['DELETE'])
@jwt_required()
def delete_school(school_id):
    school = School.query.get(school_id)
    if not school:
        return jsonify({"error": "School not found"}), 404

    db.session.delete(school)
    db.session.commit()
    return jsonify({"message": "School deleted"}), 200

# List users in a school
@school_bp.route('/<int:school_id>/users', methods=['GET'])
@jwt_required()
def get_school_users(school_id):
    users = User.query.filter_by(school_id=school_id).all()
    return jsonify([{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role
    } for u in users]), 200
