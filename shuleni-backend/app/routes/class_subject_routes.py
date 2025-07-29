from flask import Blueprint
from app.controllers.classSubject import (
    assign_subject_to_class,
    get_class_subjects,
    remove_subject_from_class
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

class_subject_bp = Blueprint('class_subjects', __name__,url_prefix='/api/class_subjects')

class_subject_bp.route('/<int:class_id>/subjects', methods=['POST'])(
    jwt_required()(roles_required('admin', 'teacher')(school_required(assign_subject_to_class)))
)
class_subject_bp.route('/<int:class_id>/subjects', methods=['GET'])(
    jwt_required()(school_required(get_class_subjects))
)
class_subject_bp.route('/<int:class_id>/subjects/<int:subject_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin', 'teacher')(school_required(remove_subject_from_class)))
)
