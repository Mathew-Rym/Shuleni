from flask import Blueprint
from app.controllers.chat import (
    send_message,
    get_class_messages,
    delete_message
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

chat_bp = Blueprint('chats', __name__)

chat_bp.route('/<int:class_id>', methods=['POST'])(
    jwt_required()(school_required(send_message))
)
chat_bp.route('/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_class_messages))
)
chat_bp.route('/<int:message_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(delete_message)))
)