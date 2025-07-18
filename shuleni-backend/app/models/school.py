from app import db
from datetime import datetime

class School(db.Model):
    __tablename__ = 'schools'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    owner_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    users = db.relationship(
        'User', back_populates='school',
        cascade='all, delete-orphan', passive_deletes=True
    )
    classes = db.relationship(
        'Class', back_populates='school',
        cascade='all, delete-orphan', passive_deletes=True
    )
    clubs = db.relationship(
        'Club', back_populates='school',
        cascade='all, delete-orphan', passive_deletes=True
    )
