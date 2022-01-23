from fastapi import status, HTTPException
from models.user_model import UserModel


def admin_user_required(db, username):

    user = db.query(UserModel).filter( UserModel.username==username).first()    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User is not available.")
            
    if 'cis-admin' not in [role.role_name for role in user.role]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Unauthorized user.")