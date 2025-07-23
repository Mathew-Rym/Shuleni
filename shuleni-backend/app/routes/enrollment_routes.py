from flask import Blueprint
from app.controllers.enrollment import (
    get_enrollments,
    get_student_enrollments,
    bulk_enroll_students,
    remove_enrollment
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

enrollment_bp = Blueprint('enrollments', __name__)

# Class enrollments
enrollment_bp.route('/class/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_enrollments))
)
enrollment_bp.route('/student/<int:student_id>', methods=['GET'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(get_student_enrollments)))
)

# Enrollment management
enrollment_bp.route('/bulk', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(bulk_enroll_students)))
)
enrollment_bp.route('/<int:enrollment_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(remove_enrollment)))
)