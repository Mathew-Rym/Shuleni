from flask import Blueprint
from app.controllers.video import (
    create_session,
    get_class_sessions,
    end_session,
    get_session_details
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

video_bp = Blueprint('video', __name__)

video_bp.route('/', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(create_session)))
)
video_bp.route('/class/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_class_sessions))
)
video_bp.route('/<int:session_id>', methods=['GET'])(
    jwt_required()(school_required(get_session_details))
)
video_bp.route('/<int:session_id>/end', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(end_session)))
)