from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import Event, Class
from app import db
from datetime import datetime

# CREATE event
def create_event(school_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()

    class_id = data.get("class_id")
    title = data.get("title")
    description = data.get("description")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    if not class_id or not title or not start_time:
        return jsonify({"msg": "class_id, title, and start_time are required"}), 400

    clazz = Class.query.filter_by(id=class_id, school_id=school_id).first()
    if not clazz:
        return jsonify({"msg": "Class not found"}), 404

    try:
        start_dt = datetime.fromisoformat(start_time)
        end_dt = datetime.fromisoformat(end_time) if end_time else None
    except ValueError:
        return jsonify({"msg": "Invalid datetime format. Use ISO format."}), 400

    event = Event(
        class_id=class_id,
        title=title,
        description=description,
        start_time=start_dt,
        end_time=end_dt,
        created_by=current_user_id
    )

    db.session.add(event)
    db.session.commit()

    return jsonify(event.to_dict()), 201

# LIST events for the authenticated user's school
def list_events(school_id):
    events = Event.query.join(Class).filter(Class.school_id == school_id).order_by(Event.start_time.desc()).all()
    return jsonify([e.to_dict() for e in events]), 200

# UPDATE event
def update_event(event_id, school_id):
    data = request.get_json()
    event = Event.query.join(Class).filter(
        Event.id == event_id,
        Class.id == Event.class_id,
        Class.school_id == school_id
    ).first()

    if not event:
        return jsonify({"msg": "Event not found"}), 404

    if "title" in data:
        event.title = data["title"]
    if "description" in data:
        event.description = data["description"]
    if "start_time" in data:
        try:
            event.start_time = datetime.fromisoformat(data["start_time"])
        except ValueError:
            return jsonify({"msg": "Invalid start_time format"}), 400
    if "end_time" in data:
        try:
            event.end_time = datetime.fromisoformat(data["end_time"])
        except ValueError:
            return jsonify({"msg": "Invalid end_time format"}), 400

    db.session.commit()
    return jsonify(event.to_dict()), 200

# DELETE event
def delete_event(event_id, school_id):
    event = Event.query.join(Class).filter(
        Event.id == event_id,
        Class.id == Event.class_id,
        Class.school_id == school_id
    ).first()

    if not event:
        return jsonify({"msg": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"msg": "Event deleted"}), 200
