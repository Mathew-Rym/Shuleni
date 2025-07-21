from app import db
from sqlalchemy.schema import UniqueConstraint
from datetime import datetime, timezone   

class ClubMember(db.Model):
    __tablename__ = 'club_members'
    __table_args__ = (UniqueConstraint('club_id', 'user_id', name='unique_club_membership'),)

    id = db.Column(db.Integer, primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    joined_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 

    club = db.relationship('Club', back_populates='members')
    user = db.relationship('User', back_populates='club_memberships')
