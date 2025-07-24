from datetime import datetime, timedelta
from app import db

def save_to_db(instance):
    db.session.add(instance)
    db.session.commit()
    return instance

def delete_from_db(instance):
    db.session.delete(instance)
    db.session.commit()

def check_plagiarism(content):
    # Basic plagiarism check - would integrate with a proper service in production
    # This is just a placeholder implementation
    suspicious_keywords = ['copy', 'paste', 'from internet', 'cheat']
    return any(keyword in content.lower() for keyword in suspicious_keywords)