from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

class Announcement(db.Model):
    __tablename__ = 'announcements'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    class_ = db.relationship('Class', backref='announcements')
    creator = db.relationship('User', backref='announcements_created')

    def to_dict(self):
        return {"id": self.id, "title": self.title, "message": self.message}
