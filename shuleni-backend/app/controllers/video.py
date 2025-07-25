#from datetime import datetime
#from flask import request
#from flask_jwt_extended import get_jwt_identity
#from app.models import VideoSession, Class
#from app.utils.helpers import save_to_db

#def create_session(school_id):
    #data = request.get_json()
    #required = ['class_id', 'title', 'link', 'start_time']
    #if not all(field in data for field in required):
     #   return {"msg": "Missing required fields"}, 400
        
    #try:
     #   start_time = datetime.fromisoformat(data['start_time'])
    #except ValueError:
     #   return {"msg": "Invalid datetime format"}, 400
        
    #if not Class.query.filter_by(school_id=school_id, id=data['class_id']).first():
     #   return {"msg": "Class not found"}, 404
        
    #session = VideoSession(
        #class_id=data['class_id'],
       # hosted_by=get_jwt_identity(),
      #  title=data['title'],
     #   link=data['link'],
    #    start_time=start_time
   # )
  #  save_to_db(session)
 #   return {"msg": "Session created", "session_id": session.id}, 201

#def get_class_sessions(school_id, class_id):
    #sessions = VideoSession.query.join(Class).filter(
      #  Class.school_id == school_id,
     #   VideoSession.class_id == class_id
    #).all()
    #return [{
      #  "id": s.id,
     #   "title": s.title,
    #    "start_time": s.start_time.isoformat(),
   #     "end_time": s.end_time.isoformat() if s.end_time else None,
  #      "status": "ended" if s.end_time else "active"
 #   } for s in sessions]

#def get_session_details(school_id, session_id):
    #session = VideoSession.query.join(Class).filter(
     #   Class.school_id == school_id,
    #    VideoSession.id == session_id
    #).first()
    #if not session:
     #   return {"msg": "Session not found"}, 404
        
    #return {
       # "id": session.id,
      #  "title": session.title,
     #   "link": session.link,
    #    "host": session.host.name,
   #     "start_time": session.start_time.isoformat(),
  #      "end_time": session.end_time.isoformat() if session.end_time else None
 #   }

#def end_session(school_id, session_id):
   # session = VideoSession.query.join(Class).filter(
     #   Class.school_id == school_id,
    #    VideoSession.id == session_id,
   #     VideoSession.hosted_by == get_jwt_identity()
  #  ).first()
    #if not session:
   #     return {"msg": "Session not found or not authorized"}, 404
        
  #  session.end_time = datetime.now()
 #   save_to_db(session)
#    return {"msg": "Session ended"}