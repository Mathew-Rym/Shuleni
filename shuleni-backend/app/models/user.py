from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    school = db.relationship('School', back_populates='users')
    enrollments = db.relationship('Enrollment', back_populates='user',
                                  cascade='all, delete-orphan', passive_deletes=True)
    uploaded_resources = db.relationship('Resource', back_populates='uploader',
                                         cascade='all, delete-orphan', passive_deletes=True)
    attendance_as_student = db.relationship(
        'Attendance', foreign_keys='Attendance.student_id',
        back_populates='student', cascade='all, delete-orphan', passive_deletes=True
    )
    attendance_as_educator = db.relationship(
        'Attendance', foreign_keys='Attendance.educator_id',
        back_populates='educator', cascade='all, delete-orphan', passive_deletes=True
    )
    created_exams = db.relationship('Exam', back_populates='creator',
                                    cascade='all, delete-orphan', passive_deletes=True)
    exam_submissions = db.relationship('ExamSubmission', back_populates='student',
                                       cascade='all, delete-orphan', passive_deletes=True)
    sent_messages = db.relationship('ChatMessage', back_populates='sender',
                                    cascade='all, delete-orphan', passive_deletes=True)
    hosted_sessions = db.relationship('VideoSession', back_populates='host',
                                      cascade='all, delete-orphan', passive_deletes=True)
    club_memberships = db.relationship('ClubMember', back_populates='user',
                                       cascade='all, delete-orphan', passive_deletes=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
