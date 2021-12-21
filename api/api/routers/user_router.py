from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import UserSchema

from models.user_model import UserModel
from core.auth import logged_in_user, logged_in_user_without_raising_error
from core.utils import getLogoutUrl

router = APIRouter(
    prefix="/user-info",
    tags=['User']
)


@router.get('/', status_code=status.HTTP_200_OK , response_model=UserSchema)
def get_logged_in_User(db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    username = user['username']
    user = db.query(UserModel).filter( UserModel.username==username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail=f"User with the id 1 is not available.")
     
    return user


@router.get('/logout-route', status_code=status.HTTP_200_OK)
def get_logout_route(request: Request, user = Depends(logged_in_user_without_raising_error)):    
    
    if user['username'] is not None:
        return {"logout_url":getLogoutUrl(request)}
    else:
        return {"logout_url":None}


@router.get('/user-with-role/{id}', status_code=status.HTTP_200_OK)
def get_User_by_id(id:int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    user = db.query(UserModel).filter( UserModel.id==id).first()    
    user.role  
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
