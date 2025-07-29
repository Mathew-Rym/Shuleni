import cloudinary.uploader
import os
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app import db

def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({"error": "No avatar file in request"}), 400

    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        result = cloudinary.uploader.upload(file, folder="avatars")
        avatar_url = result.get("secure_url")

        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        user.avatar_url = avatar_url
        db.session.commit()

        return jsonify({"avatar_url": avatar_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
