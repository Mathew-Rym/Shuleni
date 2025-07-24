from flask import Blueprint
from app.controllers.resources import (
    upload_resource,
    get_class_resources,
    get_resource,
    update_resource,
    delete_resource
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

resource_bp = Blueprint('resources', __name__)

resource_bp.route('', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(upload_resource)))
)
resource_bp.route('/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_class_resources))
)
resource_bp.route('/<int:resource_id>', methods=['GET'])(
    jwt_required()(school_required(get_resource))
)
resource_bp.route('/<int:resource_id>', methods=['PUT'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(update_resource)))
)
resource_bp.route('/<int:resource_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(delete_resource)))
)