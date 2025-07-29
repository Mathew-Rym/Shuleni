from flask import Blueprint
from app.controllers.admin import update_admin_profile
from flask_jwt_extended import jwt_required
from app.utils.auth import roles_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

admin_bp.route('/profile', methods=['PUT'])(
    jwt_required()(roles_required('admin'))(update_admin_profile)
)