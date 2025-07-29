from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.upload import upload_avatar

upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')

upload_bp.route('/avatar', methods=['POST'])(
    jwt_required()(upload_avatar)
)