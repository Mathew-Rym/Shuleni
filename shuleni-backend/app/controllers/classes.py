from flask import request
from app.models import User
from app.models import Class
from app.models import Enrollment
from app.utils.helpers import save_to_db, delete_from_db

def create_class(school_id):
    data = request.get_json()
    if not data.get('name') or not data.get('year_level'):
        return {"msg": "Class name and year level required"}, 400
        
    class_ = Class(
        school_id=school_id,
        name=data['name'],
        year_level=data['year_level']
    )
    save_to_db(class_)
    return {"msg": "Class created", "class_id": class_.id}, 201

def list_classes(school_id):
    classes = Class.query.filter_by(school_id=school_id).all()
    return [{
        "id": c.id,
        "name": c.name,
        "year_level": c.year_level,
        "student_count": len(c.enrollments)
    } for c in classes]

def get_class(school_id, class_id):
    class_ = Class.query.filter_by(school_id=school_id, id=class_id).first()
    if not class_:
        return {"msg": "Class not found"}, 404
    return {
        "id": class_.id,
        "name": class_.name,
        "year_level": class_.year_level,
        "students": [{
            "id": e.user.id,
            "name": e.user.name
        } for e in class_.enrollments]
    }

def update_class(school_id, class_id):
    class_ = Class.query.filter_by(school_id=school_id, id=class_id).first()
    if not class_:
        return {"msg": "Class not found"}, 404
        
    data = request.get_json()
    if name := data.get('name'):
        class_.name = name
    if year_level := data.get('year_level'):
        class_.year_level = year_level
    save_to_db(class_)
    return {"msg": "Class updated"}

def delete_class(school_id, class_id):
    class_ = Class.query.filter_by(school_id=school_id, id=class_id).first()
    if not class_:
        return {"msg": "Class not found"}, 404
    delete_from_db(class_)
    return {"msg": "Class deleted"}

def enroll_student(school_id, class_id):
    student_id = request.json.get('student_id')
    if not student_id:
        return {"msg": "Student ID required"}, 400
        
    if not User.query.filter_by(school_id=school_id, id=student_id, role='student').first():
        return {"msg": "Student not found"}, 404
        
    if Enrollment.query.filter_by(class_id=class_id, user_id=student_id).first():
        return {"msg": "Student already enrolled"}, 400
        
    save_to_db(Enrollment(class_id=class_id, user_id=student_id))
    return {"msg": "Student enrolled"}, 201