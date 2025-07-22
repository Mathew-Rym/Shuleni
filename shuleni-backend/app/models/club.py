from app import db

class Club(db.Model):
    __tablename__ = 'clubs'
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    school = db.relationship('School', back_populates='clubs')
    members = db.relationship('ClubMember', back_populates='club',
                              cascade='all, delete-orphan', passive_deletes=True)
