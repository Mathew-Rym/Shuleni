from app import db
from datetime import datetime, timezone

class ChatMessage(db.Model):
    __tablename__ = 'chats'
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))   

    class_ = db.relationship('Class', back_populates='chats')
    sender = db.relationship('User', back_populates='sent_messages')
