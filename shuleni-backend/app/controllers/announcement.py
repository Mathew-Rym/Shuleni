from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import Announcement, Class, User
from app import db
from datetime import datetime

# POST announcement to a class
def post_announcement(class_id, school_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()

    title = data.get("title")
    message = data.get("message")

    if not title or not message:
        return jsonify({"msg": "Title and message are required"}), 400

    clazz = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not clazz:
        return jsonify({"msg": "Class not found"}), 404

    announcement = Announcement(
        class_id=class_id,
        title=title,
        message=message,
        created_by=current_user_id,
        created_at=datetime.utcnow()
    )

    db.session.add(announcement)
    db.session.commit()

    return jsonify(announcement.to_dict()), 201

# GET all announcements for a class
def get_class_announcements(class_id, school_id):
    clazz = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not clazz:
        return jsonify({"msg": "Class not found"}), 404

    announcements = Announcement.query.filter_by(class_id=class_id).order_by(Announcement.created_at.desc()).all()
    return jsonify([a.to_dict() for a in announcements]), 200

# DELETE announcement
def delete_announcement(announcement_id, school_id):
    announcement = Announcement.query.join(Class).filter(
        Announcement.id == announcement_id,
        Class.id == Announcement.class_id,
        Class.school_id == school_id
    ).first()

    if not announcement:
        return jsonify({"msg": "Announcement not found"}), 404

    db.session.delete(announcement)
    db.session.commit()

    return jsonify({"msg": "Announcement deleted"}), 200
