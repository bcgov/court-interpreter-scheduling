from fastapi import status, HTTPException
from models.user_model import UserModel
from sqlalchemy.orm.session import Session



def get_update_by(db: Session, username):

    current_user = db.query(UserModel).filter( UserModel.username==username).first()    
    if not current_user:
        raise HTTPException(status_code=404, detail=f"User is not available.")
        
    return current_user.display_name+"_____"+current_user.username


def check_user_roles(require_roles, username, db: Session):    
    user = db.query(UserModel).filter( UserModel.username==username).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User is not available.")
    
    user_roles=[role.role_name for role in user.role]
    
    for require_role in require_roles:        
        if require_role in user_roles:
            return True
    
    return False
    