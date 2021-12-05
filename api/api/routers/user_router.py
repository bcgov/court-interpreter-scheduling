from fastapi import APIRouter, status, HTTPException, Depends
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import UserSchema

from models.user_model import UserModel
from core.auth import logged_in_user

router = APIRouter(
    prefix="/user-info",
    tags=['User']
)
   

@router.get('/', status_code=status.HTTP_200_OK, response_model=UserSchema )
def getUser(db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    username = user['username']
    user = db.query(UserModel).filter( UserModel.username==username).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with the id 1 is not available.")
      
    return user



# @router.post('/', status_code=status.HTTP_200_OK )
# def createUser(request:UserSchema, db: Session = Depends(get_db_session)):
#     new_user = UserModel(
#         first_name= request.first_name, 
#         last_name= request.last_name,
#         gu_id = 1        
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user
