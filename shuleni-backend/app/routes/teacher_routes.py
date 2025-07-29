from flask import Blueprint
from app.controllers.user_management import (
    list_users_by_role,
    create_user_with_role,
    update_teacher_classes,
    delete_teacher_from_class
)
from flask_jwt_extended import jwt_required
from app.utils.auth import roles_required, school_required

teacher_bp = Blueprint("teachers", __name__, url_prefix="/api/teachers")

teacher_bp.route("/", methods=["GET"])(
    jwt_required()(school_required(list_users_by_role))
)
teacher_bp.route("/", methods=["POST"])(
    jwt_required()(roles_required("admin")(school_required(create_user_with_role)))
)
teacher_bp.route("/<int:user_id>/classes", methods=["PUT"])(
    jwt_required()(roles_required("admin")(school_required(update_teacher_classes)))
)
teacher_bp.route("/<int:user_id>/classes/<int:class_id>", methods=["DELETE"])(
    jwt_required()(roles_required("admin")(school_required(delete_teacher_from_class)))
)