from flask import request

from app.models import Enrollment, Class, User
from app.utils.helpers import save_to_db, delete_from_db

def get_enrollments(school_id, class_id):
    enrollments = Enrollment.query.join(Class).filter(
        Class.school_id == school_id,
        Enrollment.class_id == class_id
    ).all()
    
    return [{
        "id": e.id,
        "student_id": e.user_id,
        "student_name": e.user.name,
        "enrolled_at": e.enrolled_at.isoformat()
    } for e in enrollments]

def get_student_enrollments(school_id, student_id):
    enrollments = Enrollment.query.join(Class).filter(
        Class.school_id == school_id,
        Enrollment.user_id == student_id
    ).all()
    
    return [{
        "id": e.id,
        "class_id": e.class_id,
        "class_name": e.class_.name,
        "year_level": e.class_.year_level,
        "enrolled_at": e.enrolled_at.isoformat()
    } for e in enrollments]

def bulk_enroll_students(school_id):
    data = request.get_json()
    if not data.get('class_id') or not data.get('student_ids'):
        return {"msg": "Class ID and student IDs required"}, 400
        
    class_id = data['class_id']
    if not Class.query.filter_by(school_id=school_id, id=class_id).first():
        return {"msg": "Class not found"}, 404
        
    results = []
    for student_id in data['student_ids']:
        if not User.query.filter_by(school_id=school_id, id=student_id, role='student').first():
            results.append({"student_id": student_id, "status": "not found"})
            continue
            
        if Enrollment.query.filter_by(class_id=class_id, user_id=student_id).first():
            results.append({"student_id": student_id, "status": "already enrolled"})
            continue
            
        enrollment = Enrollment(class_id=class_id, user_id=student_id)
        save_to_db(enrollment)
        results.append({"student_id": student_id, "status": "enrolled", "enrollment_id": enrollment.id})
    
    return {"results": results}, 201

def remove_enrollment(school_id, enrollment_id):
    enrollment = Enrollment.query.join(Class).filter(
        Class.school_id == school_id,
        Enrollment.id == enrollment_id
    ).first()
    
    if not enrollment:
        return {"msg": "Enrollment not found"}, 404
        
    delete_from_db(enrollment)
    return {"msg": "Enrollment removed"}
