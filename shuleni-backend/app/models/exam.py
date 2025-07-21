from app import db
from datetime import datetime, timezone   

class Exam(db.Model):
    __tablename__ = 'exams'
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))   

    class_ = db.relationship('Class', back_populates='exams')
    creator = db.relationship('User', back_populates='created_exams')
    submissions = db.relationship('ExamSubmission', back_populates='exam',
                                  cascade='all, delete-orphan', passive_deletes=True)
