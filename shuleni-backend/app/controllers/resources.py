import os
from flask import current_app, request
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from app.models import Resource, Class
from app.utils.helpers import save_to_db, delete_from_db

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'jpg', 'png'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_resource(school_id):
    if 'file' not in request.files:
        return {"msg": "No file uploaded"}, 400
        
    file = request.files['file']
    if file.filename == '':
        return {"msg": "No selected file"}, 400
        
    if not allowed_file(file.filename):
        return {"msg": "File type not allowed"}, 400
        
    class_id = request.form.get('class_id')
    if not class_id or not Class.query.filter_by(school_id=school_id, id=class_id).first():
        return {"msg": "Invalid class"}, 400
        
    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)
    
    resource = Resource(
        class_id=class_id,
        uploaded_by=get_jwt_identity(),
        title=request.form.get('title', filename),
        description=request.form.get('description', ''),
        file_url=unique_filename
    )
    save_to_db(resource)
    return {"msg": "Resource uploaded", "resource_id": resource.id}, 201

def get_class_resources(school_id, class_id):
    if not Class.query.filter_by(school_id=school_id, id=class_id).first():
        return {"msg": "Class not found"}, 404
        
    resources = Resource.query.filter_by(class_id=class_id).all()
    return [{
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "file_url": r.file_url,
        "uploaded_at": r.created_at.isoformat()
    } for r in resources]

def get_resource(school_id, resource_id):
    resource = Resource.query.join(Class).filter(
        Class.school_id == school_id,
        Resource.id == resource_id
    ).first()
    if not resource:
        return {"msg": "Resource not found"}, 404
    return {
        "id": resource.id,
        "title": resource.title,
        "description": resource.description,
        "file_url": resource.file_url,
        "class_id": resource.class_id
    }

def update_resource(school_id, resource_id):
    resource = Resource.query.join(Class).filter(
        Class.school_id == school_id,
        Resource.id == resource_id
    ).first()
    if not resource:
        return {"msg": "Resource not found"}, 404
        
    if title := request.form.get('title'):
        resource.title = title
    if description := request.form.get('description'):
        resource.description = description
    save_to_db(resource)
    return {"msg": "Resource updated"}

def delete_resource(school_id, resource_id):
    resource = Resource.query.join(Class).filter(
        Class.school_id == school_id,
        Resource.id == resource_id
    ).first()
    if not resource:
        return {"msg": "Resource not found"}, 404
        
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], resource.file_url)
    if os.path.exists(filepath):
        os.remove(filepath)
    delete_from_db(resource)
    return {"msg": "Resource deleted"}