from flask import Blueprint
from app.controllers.club import (
    create_club,
    join_club,
    leave_club,
    get_club_members,
    list_clubs,
    get_club_details
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

club_bp = Blueprint('clubs', __name__)

club_bp.route('', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(create_club)))
)
club_bp.route('', methods=['GET'])(
    jwt_required()(school_required(list_clubs))
)
club_bp.route('/<int:club_id>', methods=['GET'])(
    jwt_required()(school_required(get_club_details))
)
club_bp.route('/<int:club_id>/join', methods=['POST'])(
    jwt_required()(roles_required('student')(school_required(join_club)))
)
club_bp.route('/<int:club_id>/leave', methods=['POST'])(
    jwt_required()(roles_required('student')(school_required(leave_club)))
)
club_bp.route('/<int:club_id>/members', methods=['GET'])(
    jwt_required()(school_required(get_club_members))
)