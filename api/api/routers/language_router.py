from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from sqlalchemy import exc
from api.schemas import LanguageSchema, LanguageSchemaRequest
from models.language_model import LanguageModel


router = APIRouter(
    prefix="/language",
    tags=['Language']
)


@router.get('/names', status_code=status.HTTP_200_OK)
def get_All_Language_Names(db: Session= Depends(get_db_session)):

    languages = db.query(LanguageModel).all()    
    names = ([language.name for language in languages])
    return names


@router.get('', status_code=status.HTTP_200_OK, response_model=List[LanguageSchema])
def get_All_Languages(db: Session= Depends(get_db_session)):

    language = db.query(LanguageModel).all()    
    return language


@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Language_By_Id(id: int, db: Session= Depends(get_db_session)):
   
    language = db.query(LanguageModel).filter(LanguageModel.id==id).first()
    language.interpreters   
    return language


@router.post('', status_code=status.HTTP_200_OK )
def create_Language(request: LanguageSchemaRequest, db: Session = Depends(get_db_session)):
    
    try:
        new_language = LanguageModel(         
            name=request.name        
        )
        db.add(new_language)
        db.commit()
        db.refresh(new_language)
        return new_language
    except exc.SQLAlchemyError as e: 
        error_msg = str(e.__dict__['orig'])
        stat = status.HTTP_400_BAD_REQUEST
        if "duplicate" in error_msg or "already exists" in error_msg:
            stat = status.HTTP_409_CONFLICT
        err = error_msg.split("DETAIL")
        if len(err)>1:
           error_msg =  err[1]
        raise HTTPException(status_code=stat, detail=error_msg)




# @router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
# def delete_Language_By_Id(id: int, db: Session= Depends(get_db_session)):
   
#     language = db.query(LanguageModel).where(LanguageModel.id==id)
#     language.delete(synchronize_session=False)
#     db.commit()      
#     return 'Language deleted'



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
