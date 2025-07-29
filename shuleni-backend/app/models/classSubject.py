from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

class ClassSubject(db.Model):
    __tablename__ = 'class_subjects'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    teacher = db.relationship('User', backref='class_subjects')
    classes = db.relationship('Class', backref='class_subjects')

    def to_dict(self):
        return {"id": self.id, "class_id": self.class_id, "subject_id": self.subject_id, "teacher_id": self.teacher_id}
