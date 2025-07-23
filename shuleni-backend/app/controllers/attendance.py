from datetime import datetime
from flask import request
from flask_jwt_extended import get_jwt_identity
from app.models import Attendance, Enrollment, Class
from app.utils.helpers import save_to_db

def take_attendance(school_id):
    data = request.get_json()
    if not data.get('class_id') or not data.get('date'):
        return {"msg": "Class ID and date required"}, 400
        
    try:
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return {"msg": "Invalid date format. Use YYYY-MM-DD"}, 400
        
    if not Class.query.filter_by(school_id=school_id, id=data['class_id']).first():
        return {"msg": "Class not found"}, 404
        
    results = []
    for record in data.get('records', []):
        if not record.get('student_id'):
            continue
            
        if not Enrollment.query.filter_by(
            class_id=data['class_id'],
            user_id=record['student_id']
        ).first():
            continue
            
        attendance = Attendance.query.filter_by(
            class_id=data['class_id'],
            student_id=record['student_id'],
            date=date
        ).first()
        
        if not attendance:
            attendance = Attendance(
                class_id=data['class_id'],
                student_id=record['student_id'],
                educator_id=get_jwt_identity(),
                date=date,
                status=record.get('status', 'present')
            )
        else:
            attendance.status = record.get('status', attendance.status)
            
        save_to_db(attendance)
        results.append({
            "student_id": record['student_id'],
            "status": attendance.status
        })
    
    return {
        "msg": "Attendance recorded",
        "date": data['date'],
        "records": results
    }, 201

def get_class_attendance(school_id, class_id):
    date = request.args.get('date')
    query = Attendance.query.join(Class).filter(
        Class.school_id == school_id,
        Attendance.class_id == class_id
    )
    
    if date:
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
            query = query.filter(Attendance.date == date_obj)
        except ValueError:
            return {"msg": "Invalid date format"}, 400
            
    return [{
        "id": a.id,
        "student_id": a.student_id,
        "student_name": a.student.name,
        "date": a.date.isoformat(),
        "status": a.status
    } for a in query.all()]

def get_student_attendance(school_id, student_id):
    query = Attendance.query.join(Class).filter(
        Class.school_id == school_id,
        Attendance.student_id == student_id
    )
    return [{
        "id": a.id,
        "class_id": a.class_id,
        "class_name": a.class_.name,
        "date": a.date.isoformat(),
        "status": a.status
    } for a in query.all()]

def update_attendance(school_id, attendance_id):
    attendance = Attendance.query.join(Class).filter(
        Class.school_id == school_id,
        Attendance.id == attendance_id
    ).first()
    if not attendance:
        return {"msg": "Attendance record not found"}, 404
        
    if status := request.json.get('status'):
        attendance.status = status
        save_to_db(attendance)
    return {"msg": "Attendance updated"}