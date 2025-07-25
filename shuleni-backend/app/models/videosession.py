#from app import db
#from datetime import datetime

#class VideoSession(db.Model):
    #__tablename__ = 'video_sessions'
    #id = db.Column(db.Integer, primary_key=True)
    #class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    #hosted_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    #title = db.Column(db.String(255), nullable=False)
    #link = db.Column(db.Text, nullable=False)
    #start_time = db.Column(db.DateTime, nullable=False)
    #end_time = db.Column(db.DateTime)

    #class_ = db.relationship('Class', back_populates='video_sessions')
    #host = db.relationship('User', back_populates='hosted_sessions')

