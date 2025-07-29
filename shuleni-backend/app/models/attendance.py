from app import db
from sqlalchemy.schema import UniqueConstraint

class Attendance(db.Model):
    __tablename__ = 'attendance'
    __table_args__ = (UniqueConstraint('class_id', 'student_id', 'date', name='unique_attendance'),)

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)

    classes = db.relationship('Class', back_populates='attendance_records')
    student = db.relationship('User', back_populates='attendance_as_student',
                              foreign_keys=[student_id])
    teacher = db.relationship('User', back_populates='attendance_as_teacher',
                               foreign_keys=[teacher_id])
