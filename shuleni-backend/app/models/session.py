from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    title = db.Column(db.String(120))
    link = db.Column(db.String(255))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    hosted_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    class_session = db.relationship('Class', back_populates='sessions')
    host = db.relationship('User', back_populates='sessions')

    def to_dict(self):
        return {"id": self.id, "title": self.title, "link": self.link}
