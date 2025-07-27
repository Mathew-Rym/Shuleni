from flask import Blueprint
from app.controllers.classes import (
    create_class,
    get_class,
    list_classes,
    update_class,
    delete_class,
    enroll_student
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

class_bp = Blueprint('classes', __name__)

class_bp.route('/', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(create_class)))
)
class_bp.route('/', methods=['GET'])(
    jwt_required()(school_required(list_classes))
)
class_bp.route('/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_class))
)
class_bp.route('/<int:class_id>', methods=['PUT'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(update_class)))
)
class_bp.route('/<int:class_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin')(school_required(delete_class)))
)
class_bp.route('/<int:class_id>/enroll', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(enroll_student)))
)
