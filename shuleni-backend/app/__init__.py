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

    app.register_blueprint(auth_bp)
    app.register_blueprint(school_bp)
    
    return app