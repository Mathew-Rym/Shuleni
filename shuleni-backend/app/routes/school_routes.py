from flask import Blueprint
from app.controllers.school import (
    create_user,
    delete_user,
    list_users,
    get_school_info
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

school_bp = Blueprint('schools', __name__)

school_bp.route('/users', methods=['POST'])(
    jwt_required()(roles_required('admin')(school_required(create_user)))
)
school_bp.route('/users/<int:user_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin')(school_required(delete_user)))
)
school_bp.route('/users', methods=['GET'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(list_users)))
)
school_bp.route('/info', methods=['GET'])(
    jwt_required()(school_required(get_school_info))
)