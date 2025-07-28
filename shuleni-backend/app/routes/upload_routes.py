from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.utils.auth import school_required

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload/avatar', methods=['POST'])
@jwt_required()
@school_required
def upload_avatar():
    pass
