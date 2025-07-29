from app import db
from datetime import datetime, timezone 

class Class(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    year_level = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 

    school = db.relationship('School', back_populates='classes')
    enrollments = db.relationship('Enrollment', back_populates='classes',
                                  cascade='all, delete-orphan', passive_deletes=True)
    resources = db.relationship('Resource', back_populates='classes',
                                cascade='all, delete-orphan', passive_deletes=True)
    attendance_records = db.relationship('Attendance', back_populates='classes',
                                         cascade='all, delete-orphan', passive_deletes=True)
    exams = db.relationship('Exam', back_populates='classes',
                            cascade='all, delete-orphan', passive_deletes=True)
    chats = db.relationship('ChatMessage', back_populates='classes',
                            cascade='all, delete-orphan', passive_deletes=True)
    sessions = db.relationship('Session', back_populates='class_session',
                               cascade='all, delete-orphan', passive_deletes=True)