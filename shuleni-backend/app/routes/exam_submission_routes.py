from flask import Blueprint
from app.controllers.exam_submission import (
    get_submission,
    get_student_submissions,
    get_exam_submissions,
    download_submission_file
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

submission_bp = Blueprint('exam_submissions', __name__)

# Student access
submission_bp.route('/<int:submission_id>', methods=['GET'])(
    jwt_required()(school_required(get_submission))
)
submission_bp.route('/student', methods=['GET'])(
    jwt_required()(roles_required('student')(school_required(get_student_submissions)))
)

# Educator/admin access
submission_bp.route('/exam/<int:exam_id>', methods=['GET'])(
    jwt_required()(roles_required('educator', 'admin')(school_required(get_exam_submissions)))
)
submission_bp.route('/<int:submission_id>/download', methods=['GET'])(
    jwt_required()(roles_required('educator', 'admin')(school_required(download_submission_file)))
)