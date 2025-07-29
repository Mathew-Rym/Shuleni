from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

class Assignment(db.Model):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    classes = db.relationship('Class', backref='assignments')
    creator = db.relationship('User', backref='assignments_created')

    def to_dict(self):
        return {"id": self.id, "class_id": self.class_id, "title": self.title, "due_date": self.due_date.isoformat() if self.due_date else None}
