from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app import models

    # Uncomment the following when the respective routes are ready
    # from app.routes.auth_routes import auth_bp
    # from app.routes.school_routes import school_bp
    # from app.routes.attendance_routes import attendance_bp
    # from app.routes.resource_routes import resource_bp
    # from app.routes.exam_routes import exam_bp
    # from app.routes.chat_routes import chat_bp
    # from app.routes.class_routes import class_bp
    # from app.routes.enrollment_routes import enrollment_bp
    # from app.routes.exam_submission_routes import submission_bp

    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # app.register_blueprint(school_bp, url_prefix='/api/schools')
    # app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    # app.register_blueprint(resource_bp, url_prefix='/api/resources')
    # app.register_blueprint(exam_bp, url_prefix='/api/exams')
    # app.register_blueprint(chat_bp, url_prefix='/api/chats')
    # app.register_blueprint(class_bp, url_prefix='/api/classes')
    # app.register_blueprint(enrollment_bp, url_prefix='/api/enrollments')
    # app.register_blueprint(submission_bp, url_prefix='/api/submissions')

    return app
