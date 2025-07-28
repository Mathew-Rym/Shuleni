from flask import Blueprint
from app.controllers.subject import (
    create_subject,
    list_subjects,
    get_subject,
    update_subject,
    delete_subject
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

subject_bp = Blueprint('subjects', __name__)

subject_bp.route('/', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(create_subject)))
)
subject_bp.route('/', methods=['GET'])(
    jwt_required()(school_required(list_subjects))
)
subject_bp.route('/<int:subject_id>', methods=['GET'])(
    jwt_required()(school_required(get_subject))
)
subject_bp.route('/<int:subject_id>', methods=['PUT'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(update_subject)))
)
subject_bp.route('/<int:subject_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin')(school_required(delete_subject)))
)
