from app import db
from datetime import datetime

class AssignmentSubmission(db.Model):
    __tablename__ = 'assignment_submissions'

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    score = db.Column(db.Float, nullable=True)

    assignment = db.relationship('Assignment', backref='submissions')
    student = db.relationship('User', backref='assignment_submissions')

    def to_dict(self):
        return {
            "id": self.id,
            "assignment_id": self.assignment_id,
            "student_id": self.student_id,
            "file_url": self.file_url,
            "submitted_at": self.submitted_at.isoformat(),
            "score": self.score
        }
