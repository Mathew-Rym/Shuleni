from flask import Blueprint
from app.controllers.event import (
    create_event,
    list_events,
    update_event,
    delete_event
)
from app.utils.auth import roles_required, school_required
from flask_jwt_extended import jwt_required

event_bp = Blueprint('events', __name__)

event_bp.route('/', methods=['POST'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(create_event)))
)
event_bp.route('/', methods=['GET'])(
    jwt_required()(school_required(list_events))
)
event_bp.route('/<int:event_id>', methods=['PUT'])(
    jwt_required()(roles_required('admin', 'educator')(school_required(update_event)))
)
event_bp.route('/<int:event_id>', methods=['DELETE'])(
    jwt_required()(roles_required('admin')(school_required(delete_event)))
)
