from app import db
from datetime import datetime

class Class(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    grade_level = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    school = db.relationship('School', back_populates='classes')
    enrollments = db.relationship('Enrollment', back_populates='class_',
                                  cascade='all, delete-orphan', passive_deletes=True)
    resources = db.relationship('Resource', back_populates='class_',
                                cascade='all, delete-orphan', passive_deletes=True)
    attendance_records = db.relationship('Attendance', back_populates='class_',
                                         cascade='all, delete-orphan', passive_deletes=True)
    exams = db.relationship('Exam', back_populates='class_',
                            cascade='all, delete-orphan', passive_deletes=True)
    chats = db.relationship('ChatMessage', back_populates='class_',
                            cascade='all, delete-orphan', passive_deletes=True)
    video_sessions = db.relationship('VideoSession', back_populates='class_',
                                     cascade='all, delete-orphan', passive_deletes=True)
