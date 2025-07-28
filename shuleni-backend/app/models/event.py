from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    clazz = db.relationship('Class', backref='events')
    creator = db.relationship('User', backref='events_created')

    def to_dict(self):
        return {"id": self.id, "title": self.title, "start_time": self.start_time.isoformat()}
