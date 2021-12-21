from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import UserSchema
from models.language_model import LanguageModel


router = APIRouter(
    prefix="/language",
    tags=['Language']
)


@router.get('', status_code=status.HTTP_200_OK)
def get_All_Languages(db: Session= Depends(get_db_session)):

    language = db.query(LanguageModel).all()    
    return language


@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Language_By_Id(id: int, db: Session= Depends(get_db_session)):
   
    language = db.query(LanguageModel).filter(LanguageModel.id==id).first()
    language.interpreters   
    return language


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Language_By_Id(id: int, db: Session= Depends(get_db_session)):
   
    language = db.query(LanguageModel).where(LanguageModel.id==id)
    language.delete(synchronize_session=False)
    db.commit()      
    return 'Language deleted'



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
