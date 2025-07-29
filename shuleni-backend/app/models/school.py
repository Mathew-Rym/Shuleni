from app import db
from datetime import datetime, timezone   

class School(db.Model):
    __tablename__ = 'schools'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    owner_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))   

    users = db.relationship(
        'User', back_populates='school',
        cascade='all, delete-orphan', passive_deletes=True
    )
    classes = db.relationship(
        'Class', back_populates='school',
        cascade='all, delete-orphan', passive_deletes=True
    )
    #clubs = db.relationship(
    #    'Club', back_populates='school',
    #    cascade='all, delete-orphan', passive_deletes=True
    #)
