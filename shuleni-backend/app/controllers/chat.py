from flask import request
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from app.models import ChatMessage, Enrollment, Class
from app.utils.helpers import save_to_db, delete_from_db

def send_message(school_id, class_id):
    message = request.json.get('message')
    if not message:
        return {"msg": "Message content required"}, 400
        
    if not Class.query.filter_by(school_id=school_id, id=class_id).first():
        return {"msg": "Class not found"}, 404
        
    sender_id = get_jwt_identity()
    # Verify sender is in class
    if not Enrollment.query.filter_by(class_id=class_id, user_id=sender_id).first():
        return {"msg": "Not in this class"}, 403
        
    chat_message = ChatMessage(
        class_id=class_id,
        sender_id=sender_id,
        message=message
    )
    save_to_db(chat_message)
    return {"msg": "Message sent", "message_id": chat_message.id}, 201

def get_class_messages(school_id, class_id):
    if not Class.query.filter_by(school_id=school_id, id=class_id).first():
        return {"msg": "Class not found"}, 404
        
    messages = ChatMessage.query.filter_by(class_id=class_id).order_by(ChatMessage.sent_at).all()
    return [{
        "id": m.id,
        "sender_id": m.sender_id,
        "sender_name": m.sender.name,
        "message": m.message,
        "sent_at": m.sent_at.isoformat()
    } for m in messages]

def delete_message(school_id, message_id):
    message = ChatMessage.query.join(Class).filter(
        Class.school_id == school_id,
        ChatMessage.id == message_id
    ).first()
    if not message:
        return {"msg": "Message not found"}, 404
        
    delete_from_db(message)
    return {"msg": "Message deleted"}