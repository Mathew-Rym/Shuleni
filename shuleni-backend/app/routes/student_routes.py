from flask import Blueprint
from app.controllers.user_management import (
    list_users_by_role,
    create_user_with_role,
    update_user_by_id,
    delete_user_by_id,
    get_student_grades,
    update_student_attendance
)
from flask_jwt_extended import jwt_required
from app.utils.auth import roles_required, school_required

student_bp = Blueprint("students", __name__, url_prefix="/api/students")

student_bp.route("/", methods=["GET"])(
    jwt_required()(school_required(list_users_by_role))
)
student_bp.route("/", methods=["POST"])(
    jwt_required()(school_required(create_user_with_role))
)
student_bp.route("/<int:user_id>", methods=["PUT"])(
    jwt_required()(roles_required("admin", "teacher")(school_required(update_user_by_id)))
)
student_bp.route("/<int:user_id>", methods=["DELETE"])(
    jwt_required()(roles_required("admin")(school_required(delete_user_by_id)))
)
student_bp.route("/<int:user_id>/grades", methods=["GET"])(
    jwt_required()(school_required(get_student_grades))
)
student_bp.route("/<int:user_id>/attendance", methods=["PUT"])(
    jwt_required()(roles_required("admin", "teacher")(school_required(update_student_attendance)))
)