from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from app.routes.auth_routes import auth_bp
from app.routes.school_routes import school_bp
from app.routes.class_routes import class_bp
from app.routes.resource_routes import resource_bp
from app.routes.attendance_routes import attendance_bp
from app.routes.exam_routes import exam_bp
from app.routes.chat_routes import chat_bp
from app.routes.club_routes import club_bp
from app.routes.video_routes import video_bp
from app.routes.exam_submission_routes import submission_bp
from app.routes.enrollment_routes import enrollment_bp

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class='app.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)

     
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, supports_credentials=True)   

    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(school_bp, url_prefix='/api/schools')
    app.register_blueprint(class_bp, url_prefix='/api/classes')
    app.register_blueprint(resource_bp, url_prefix='/api/resources')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(exam_bp, url_prefix='/api/exams')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(club_bp, url_prefix='/api/clubs')
    app.register_blueprint(video_bp, url_prefix='/api/videos')
    app.register_blueprint(submission_bp, url_prefix='/api/submissions')
    app.register_blueprint(enrollment_bp, url_prefix='/api/enrollments')

    #error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"message": "Not Found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"message": "Internal Server Error"}, 500

    return app
