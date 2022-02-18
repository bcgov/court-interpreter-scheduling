from fastapi import status, HTTPException
from models.user_model import UserModel
from sqlalchemy.orm.session import Session



def get_update_by(db: Session, username):

    current_user = db.query(UserModel).filter( UserModel.username==username).first()    
    if not current_user:
        raise HTTPException(status_code=404, detail=f"User is not available.")
        
    return current_user.display_name+"_____"+current_user.username