from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

# -----------------------
# Subject Model
# -----------------------
class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    school = db.relationship('School', backref='subjects')
    class_subjects = db.relationship('ClassSubject', backref='subject', cascade='all, delete-orphan')

    def to_dict(self):
        return {"id": self.id, "name": self.name, "school_id": self.school_id}
