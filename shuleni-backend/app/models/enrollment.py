from app import db
from datetime import datetime
from sqlalchemy.schema import UniqueConstraint

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    __table_args__ = (UniqueConstraint('class_id', 'user_id', name='unique_enrollment'),)

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

    class_ = db.relationship('Class', back_populates='enrollments')
    user = db.relationship('User', back_populates='enrollments')
