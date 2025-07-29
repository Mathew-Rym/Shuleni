import os
from flask import current_app, request, send_file
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from app.models import User, Resource, Class
from app.utils.helpers import save_to_db, delete_from_db

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'jpg', 'png'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_resource():
    """Upload a class resource (file)"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    class_id = request.form.get('class_id')
    title = request.form.get('title')
    description = request.form.get('description')
    file = request.files.get('file')

    if not class_id or not title or not file:
        return {"msg": "class_id, title, and file are required"}, 400

    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        return {"msg": "Upload folder not configured"}, 500

    class_ = Class.query.get(class_id)
    if not class_ or class_.school_id != user.school_id:
        return {"msg": "Class not found or access denied"}, 404

    if not allowed_file(file.filename):
        return {"msg": "Invalid file type"}, 400

    filename = secure_filename(file.filename)
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
    unique_filename = f"{timestamp}_{filename}"
    file_path = os.path.join(upload_folder, unique_filename)

    try:
        file.save(file_path)
    except Exception as e:
        return {"msg": f"Failed to save file: {str(e)}"}, 500

    resource = Resource(
        class_id=class_id,
        uploaded_by=user.id,
        title=title,
        description=description,
        file_url=file_path
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

def download_resource(resource_id):
    """Download a resource file"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    resource = Resource.query.get(resource_id)
    if not resource:
        return {"msg": "Resource not found"}, 404

    class_ = Class.query.get(resource.class_id)
    if not class_ or class_.school_id != user.school_id:
        return {"msg": "Access denied"}, 403

    try:
        return send_file(resource.file_url, as_attachment=True)
    except Exception as e:
        return {"msg": f"Failed to download file: {str(e)}"}, 500
