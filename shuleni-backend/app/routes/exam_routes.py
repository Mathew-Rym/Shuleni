from flask import Blueprint
from app.controllers.exam import (
    create_exam,
    get_exam,
    list_class_exams,
    submit_exam,
    grade_exam,
    get_exam_results
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

 
exam_bp = Blueprint('exams', __name__, url_prefix='/exams')

exam_bp.route('', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(create_exam)))
)
exam_bp.route('/<int:exam_id>', methods=['GET'])(
    jwt_required()(school_required(get_exam))
)
exam_bp.route('/class/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(list_class_exams))
)
exam_bp.route('/<int:exam_id>/submit', methods=['POST'])(
    jwt_required()(roles_required('student')(school_required(submit_exam)))
)
exam_bp.route('/<int:exam_id>/grade', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(grade_exam)))
)
exam_bp.route('/<int:exam_id>/results', methods=['GET'])(
    jwt_required()(roles_required('educator')(school_required(get_exam_results)))
)
