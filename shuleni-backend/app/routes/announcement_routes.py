from flask import Blueprint
from app.controllers.announcement import (
    post_announcement,
    get_class_announcements,
    delete_announcement
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

announcement_bp = Blueprint('announcements', __name__, url_prefix='/api/classes')

announcement_bp.route('/<int:class_id>/announcements', methods=['POST'])(
    jwt_required()(roles_required('teacher')(school_required(post_announcement)))
)
announcement_bp.route('/<int:class_id>/announcements', methods=['GET'])(
    jwt_required()(school_required(get_class_announcements))
)
announcement_bp.route('/announcements/<int:announcement_id>', methods=['DELETE'])(
    jwt_required()(roles_required('teacher')(school_required(delete_announcement)))
)
