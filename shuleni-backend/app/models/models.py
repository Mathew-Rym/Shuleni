# from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime

# db = SQLAlchemy()

# class School(db.Model):
#     __tablename__ = 'schools'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)
#     owner_name = db.Column(db.String(255))
#     email = db.Column(db.String(255), unique=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     users = db.relationship('User', backref='school', cascade="all, delete-orphan")
#     classes = db.relationship('Class', backref='school', cascade="all, delete-orphan")


# class User(db.Model):
#     __tablename__ = 'users'

#     id = db.Column(db.Integer, primary_key=True)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
#     name = db.Column(db.String(255), nullable=False)
#     email = db.Column(db.String(255), unique=True, nullable=False)
#     role = db.Column(db.String(50), nullable=False)  # student, educator, admin
#     password_hash = db.Column(db.Text, nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     enrollments = db.relationship('Enrollment', backref='user', cascade="all, delete-orphan")
#     uploaded_resources = db.relationship('Resource', backref='uploader')
#     attendance_records = db.relationship('Attendance', foreign_keys='Attendance.student_id', backref='student')
#     attendance_signed = db.relationship('Attendance', foreign_keys='Attendance.educator_id', backref='educator')
#     created_exams = db.relationship('Exam', backref='creator')
#     exam_submissions = db.relationship('ExamSubmission', backref='student')
#     sent_messages = db.relationship('Chat', backref='sender')
#     hosted_sessions = db.relationship('VideoSession', backref='host')
#     club_memberships = db.relationship('ClubMember', backref='user')


# class Class(db.Model):
#     __tablename__ = 'classes'

#     id = db.Column(db.Integer, primary_key=True)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
#     name = db.Column(db.String(100), nullable=False)
#     grade_level = db.Column(db.String(50))
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     enrollments = db.relationship('Enrollment', backref='class_', cascade="all, delete-orphan")
#     resources = db.relationship('Resource', backref='class_')
#     attendance_records = db.relationship('Attendance', backref='class_')
#     exams = db.relationship('Exam', backref='class_')
#     chats = db.relationship('Chat', backref='class_')
#     video_sessions = db.relationship('VideoSession', backref='class_')


# class Enrollment(db.Model):
#     __tablename__ = 'enrollments'

#     id = db.Column(db.Integer, primary_key=True)
#     class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

#     __table_args__ = (
#         db.UniqueConstraint('class_id', 'user_id', name='unique_enrollment'),
#     )


# class Resource(db.Model):
#     __tablename__ = 'resources'

#     id = db.Column(db.Integer, primary_key=True)
#     class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
#     uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
#     title = db.Column(db.String(255))
#     description = db.Column(db.Text)
#     file_url = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)


# class Attendance(db.Model):
#     __tablename__ = 'attendance'

#     id = db.Column(db.Integer, primary_key=True)
#     class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
#     student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     educator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
#     date = db.Column(db.Date, nullable=False)
#     status = db.Column(db.String(20))  # present, absent, late

#     __table_args__ = (
#         db.UniqueConstraint('class_id', 'student_id', 'date', name='unique_attendance'),
#     )


# class Exam(db.Model):
#     __tablename__ = 'exams'

#     id = db.Column(db.Integer, primary_key=True)
#     class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
#     title = db.Column(db.String(255))
#     start_time = db.Column(db.DateTime)
#     end_time = db.Column(db.DateTime)
#     duration_minutes = db.Column(db.Integer)
#     created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

#     submissions = db.relationship('ExamSubmission', backref='exam', cascade="all, delete-orphan")


# class ExamSubmission(db.Model):
#     __tablename__ = 'exam_submissions'

#     id = db.Column(db.Integer, primary_key=True)
#     exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
#     student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     submitted_at = db.Column(db.DateTime)
#     score = db.Column(db.Numeric(5, 2))
#     plagiarism_flag = db.Column(db.Boolean, default=False)

#     __table_args__ = (
#         db.UniqueConstraint('exam_id', 'student_id', name='unique_exam_submission'),
#     )


# class Chat(db.Model):
#     __tablename__ = 'chats'

#     id = db.Column(db.Integer, primary_key=True)
#     class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
#     sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     message = db.Column(db.Text, nullable=False)
#     sent_at = db.Column(db.DateTime, default=datetime.utcnow)


# class VideoSession(db.Model):
#     __tablename__ = 'video_sessions'

#     id = db.Column(db.Integer, primary_key=True)
#     class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
#     title = db.Column(db.String(255))
#     hosted_by = db.Column(db.Integer, db.ForeignKey('users.id'))
#     link = db.Column(db.Text)
#     start_time = db.Column(db.DateTime)
#     end_time = db.Column(db.DateTime)


# class Club(db.Model):
#     __tablename__ = 'clubs'

#     id = db.Column(db.Integer, primary_key=True)
#     school_id = db.Column(db.Integer, db.ForeignKey('schools.id'))
#     name = db.Column(db.String(100))
#     description = db.Column(db.Text)

#     members = db.relationship('ClubMember', backref='club', cascade="all, delete-orphan")


# class ClubMember(db.Model):
#     __tablename__ = 'club_members'

#     id = db.Column(db.Integer, primary_key=True)
#     club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     joined_at = db.Column(db.DateTime, default=datetime.utcnow)

#     __table_args__ = (
#         db.UniqueConstraint('club_id', 'user_id', name='unique_club_membership'),
#     )
