from app import db
from datetime import datetime, timezone   
from sqlalchemy.schema import UniqueConstraint

class ExamSubmission(db.Model):
    __tablename__ = 'exam_submissions'
    __table_args__ = (UniqueConstraint('exam_id', 'student_id', name='unique_exam_submission'),)

    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    submitted_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))   
    score = db.Column(db.Numeric(5, 2))
    graded_at = db.Column(db.DateTime)
    plagiarism_flag = db.Column(db.Boolean, default=False)

    exam = db.relationship('Exam', back_populates='submissions')
    student = db.relationship('User', back_populates='exam_submissions')
