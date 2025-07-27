from flask import Blueprint
from app.controllers.attendance import (
    take_attendance,
    get_class_attendance,
    get_student_attendance,
    update_attendance
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

attendance_bp = Blueprint('attendance', __name__)

attendance_bp.route('/', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(take_attendance)))
)
attendance_bp.route('/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(get_class_attendance))
)
attendance_bp.route('/student/<int:student_id>', methods=['GET'])(
    jwt_required()(school_required(get_student_attendance))
)
attendance_bp.route('/<int:attendance_id>', methods=['PUT'])(
    jwt_required()(roles_required('educator')(school_required(update_attendance)))
)
