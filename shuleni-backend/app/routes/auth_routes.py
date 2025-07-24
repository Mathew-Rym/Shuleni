from flask import Blueprint
from app.controllers.auth import (
    register_school,
    login,
    refresh_token
)
from flask_jwt_extended import jwt_required

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Public routes
auth_bp.route('/register/school', methods=['POST'])(register_school)
auth_bp.route('/login', methods=['POST'])(login)

# Protected routes
auth_bp.route('/refresh', methods=['POST'])(jwt_required(refresh=True)(refresh_token))