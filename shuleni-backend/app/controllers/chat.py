from flask import request
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from app.models import User, ChatMessage, Enrollment, Class
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

    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))

    pagination = ChatMessage.query.filter_by(class_id=class_id)\
        .order_by(ChatMessage.sent_at)\
        .paginate(page=page, per_page=per_page, error_out=False)

    messages = pagination.items

    return {
        "messages": [{
            "id": m.id,
            "sender_id": m.sender_id,
            "sender_name": m.sender.name,
            "message": m.message,
            "sent_at": m.sent_at.strftime("%Y-%m-%d %H:%M:%S")
        } for m in messages],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages
    }

def delete_message(school_id, message_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    message = ChatMessage.query.join(Class).filter(
        Class.school_id == school_id,
        ChatMessage.id == message_id
    ).first()

    if not message:
        return {"msg": "Message not found"}, 404

    if message.sender_id != current_user_id and user.role not in ['admin', 'educator']:
        return {"msg": "Unauthorized to delete this message"}, 403

    delete_from_db(message)
    return {"msg": "Message deleted"}