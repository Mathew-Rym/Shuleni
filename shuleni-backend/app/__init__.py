from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from importlib import import_module

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class='app.config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

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

    app.register_blueprint(auth_bp)
    app.register_blueprint(school_bp)
    app.register_blueprint(class_bp)
    app.register_blueprint(resource_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(exam_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(club_bp)
    app.register_blueprint(video_bp)
    app.register_blueprint(submission_bp)
    app.register_blueprint(enrollment_bp)

    return app