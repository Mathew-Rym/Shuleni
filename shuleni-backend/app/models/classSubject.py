from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

class ClassSubject(db.Model):
    __tablename__ = 'class_subjects'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    educator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    educator = db.relationship('User', backref='class_subjects')
    class_ = db.relationship('Class', backref='class_subjects')

    def to_dict(self):
        return {"id": self.id, "class_id": self.class_id, "subject_id": self.subject_id, "educator_id": self.educator_id}
