from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User
from app import db

def update_admin_profile():
    user_id = get_jwt_identity()
    admin = User.query.filter_by(id=user_id, role='admin').first_or_404()
    data = request.get_json()

    admin.name = data.get('name', admin.name)
    admin.email = data.get('email', admin.email)

    new_password = data.get('password')
    if new_password:
        admin.set_password(new_password)

    db.session.commit()
    return jsonify(admin.to_dict()), 200
