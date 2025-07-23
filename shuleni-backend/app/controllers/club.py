from flask import request
from datetime import datetime
from flask_jwt_extended import get_jwt_identity
from app.models import Club, ClubMember
from app.utils.helpers import save_to_db, delete_from_db

def create_club(school_id):
    data = request.get_json()
    if not data.get('name'):
        return {"msg": "Club name required"}, 400
        
    club = Club(
        school_id=school_id,
        name=data['name'],
        description=data.get('description', '')
    )
    save_to_db(club)
    return {"msg": "Club created", "club_id": club.id}, 201

def list_clubs(school_id):
    clubs = Club.query.filter_by(school_id=school_id).all()
    return [{
        "id": c.id,
        "name": c.name,
        "member_count": len(c.members)
    } for c in clubs]

def get_club_details(school_id, club_id):
    club = Club.query.filter_by(school_id=school_id, id=club_id).first()
    if not club:
        return {"msg": "Club not found"}, 404
    return {
        "id": club.id,
        "name": club.name,
        "description": club.description,
        "created_at": club.created_at.isoformat()
    }

def join_club(school_id, club_id):
    if not Club.query.filter_by(school_id=school_id, id=club_id).first():
        return {"msg": "Club not found"}, 404
        
    user_id = get_jwt_identity()
    if ClubMember.query.filter_by(club_id=club_id, user_id=user_id).first():
        return {"msg": "Already a member"}, 400
        
    save_to_db(ClubMember(club_id=club_id, user_id=user_id))
    return {"msg": "Joined club"}, 201

def leave_club(school_id, club_id):
    membership = ClubMember.query.join(Club).filter(
        Club.school_id == school_id,
        ClubMember.club_id == club_id,
        ClubMember.user_id == get_jwt_identity()
    ).first()
    if not membership:
        return {"msg": "Not a member of this club"}, 404
        
    delete_from_db(membership)
    return {"msg": "Left club"}

def get_club_members(school_id, club_id):
    if not Club.query.filter_by(school_id=school_id, id=club_id).first():
        return {"msg": "Club not found"}, 404
        
    members = ClubMember.query.filter_by(club_id=club_id).all()
    return [{
        "user_id": m.user_id,
        "user_name": m.user.name,
        "joined_at": m.joined_at.isoformat()
    } for m in members]