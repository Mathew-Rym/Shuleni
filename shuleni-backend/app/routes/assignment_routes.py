from flask import Blueprint
from app.controllers.assignment import (
    create_assignment,
    list_assignments,
    get_assignment,
    update_assignment,
    delete_assignment,
    submit_assignment,
    get_submissions,
    grade_submission
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

assignment_bp = Blueprint('assignments', __name__)

assignment_bp.route('/', methods=['POST'])(
    jwt_required()(roles_required('educator')(school_required(create_assignment)))
)
assignment_bp.route('/class/<int:class_id>', methods=['GET'])(
    jwt_required()(school_required(list_assignments))
)
assignment_bp.route('/<int:assignment_id>', methods=['GET'])(
    jwt_required()(school_required(get_assignment))
)
assignment_bp.route('/<int:assignment_id>', methods=['PUT'])(
    jwt_required()(roles_required('educator')(school_required(update_assignment)))
)
assignment_bp.route('/<int:assignment_id>', methods=['DELETE'])(
    jwt_required()(roles_required('educator')(school_required(delete_assignment)))
)
assignment_bp.route('/<int:assignment_id>/submit', methods=['POST'])(
    jwt_required()(roles_required('student')(school_required(submit_assignment)))
)
assignment_bp.route('/<int:assignment_id>/submissions', methods=['GET'])(
    jwt_required()(roles_required('educator')(school_required(get_submissions)))
)
assignment_bp.route('/<int:assignment_id>/submissions/<int:submission_id>/grade', methods=['PATCH'])(
    jwt_required()(roles_required('educator')(school_required(grade_submission)))
)
