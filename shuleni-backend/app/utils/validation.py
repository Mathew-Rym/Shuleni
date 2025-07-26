from flask import request, jsonify
import re

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
