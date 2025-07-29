from flask import request, jsonify
import re
from datetime import datetime

def validate_school_creation(data):
    errors = {}
    
    if not data.get('name') or len(data['name']) < 3:
        errors['name'] = 'School name must be at least 3 characters'
        
    if not data.get('owner_name') or len(data['owner_name']) < 2:
        errors['owner_name'] = 'Owner name must be at least 2 characters'
        
    if not data.get('email') or not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        errors['email'] = 'Valid email is required'
        
    if not data.get('password') or len(data['password']) < 8:
        errors['password'] = 'Password must be at least 8 characters'
        
    return errors if errors else None

def validate_user_creation(data, role):
    errors = {}
    
    if not data.get('name') or len(data['name']) < 2:
        errors['name'] = 'Name must be at least 2 characters'
        
    if not data.get('email') or not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        errors['email'] = 'Valid email is required'
        
    if role == 'student' and not data.get('class_id'):
        errors['class_id'] = 'Class ID is required for students'
        
    return errors if errors else None

def validate_assignment_creation(data):
    errors = {}

    if not data.get('class_id') or not isinstance(data['class_id'], int):
        errors['class_id'] = 'Class ID must be provided and be an integer'

    if not data.get('title') or len(data['title']) < 3:
        errors['title'] = 'Title must be at least 3 characters long'

    if data.get('description') and not isinstance(data['description'], str):
        errors['description'] = 'Description must be a string'

    if data.get('due_date'):
        try:
            datetime.fromisoformat(data['due_date'])
        except ValueError:
            errors['due_date'] = 'Due date must be a valid ISO 8601 datetime string'

    return errors if errors else None

def validate_assignment_update(data):
    errors = {}

    if 'class_id' in data and not isinstance(data['class_id'], int):
        errors['class_id'] = 'Class ID must be an integer'

    if 'title' in data and len(data['title']) < 3:
        errors['title'] = 'Title must be at least 3 characters long'

    if 'description' in data and not isinstance(data['description'], str):
        errors['description'] = 'Description must be a string'

    if 'due_date' in data:
        try:
            datetime.fromisoformat(data['due_date'])
        except ValueError:
            errors['due_date'] = 'Due date must be a valid ISO 8601 datetime string'

    return errors if errors else None
