import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/shuleni_db')
    ENV = os.getenv('FLASK_ENV', 'production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    UPLOAD_FOLDER = 'uploads'
    SUBMISSION_FOLDER = 'uploads/submissions'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size

class TestingConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    TESTING = True
    WTF_CSRF_ENABLED = False
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
