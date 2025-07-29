from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import Session, Class
from app import db
from datetime import datetime

# SCHEDULE a session
def schedule_session(class_id, school_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()

    title = data.get("title")
    link = data.get("link")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    if not title or not link or not start_time:
        return jsonify({"msg": "title, link, and start_time are required"}), 400

    clazz = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not clazz:
        return jsonify({"msg": "Class not found"}), 404

    try:
        start_dt = datetime.fromisoformat(start_time)
        end_dt = datetime.fromisoformat(end_time) if end_time else None
    except ValueError:
        return jsonify({"msg": "Invalid datetime format. Use ISO format."}), 400

    session = Session(
        class_id=class_id,
        title=title,
        link=link,
        start_time=start_dt,
        end_time=end_dt,
        hosted_by=current_user_id
    )

    db.session.add(session)
    db.session.commit()

    return jsonify(session.to_dict()), 201

# GET all sessions for a class (limited to user's school)
def get_class_sessions(class_id, school_id):
    clazz = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not clazz:
        return jsonify({"msg": "Class not found"}), 404

    sessions = Session.query.filter_by(class_id=class_id).order_by(Session.start_time.desc()).all()
    return jsonify([s.to_dict() for s in sessions]), 200

# CANCEL a session (teacher only)
def cancel_session(session_id, school_id):
    session = Session.query.join(Class).filter(
        Session.id == session_id,
        Class.id == Session.class_id,
        Class.school_id == school_id
    ).first()

    if not session:
        return jsonify({"msg": "Session not found"}), 404

    db.session.delete(session)
    db.session.commit()
    return jsonify({"msg": "Session cancelled"}), 200
