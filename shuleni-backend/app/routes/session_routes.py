from flask import Blueprint
from app.controllers.session import (
    schedule_session,
    get_class_sessions,
    cancel_session
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

session_bp = Blueprint('sessions', __name__)

session_bp.route('/<int:class_id>', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(schedule_session)))
)
session_bp.route('/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_class_sessions))
)
session_bp.route('/<int:session_id>', methods=['DELETE'])(
    jwt_required()(roles_required('educator')(school_required(cancel_session)))
)
