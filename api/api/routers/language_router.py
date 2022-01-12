from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session

from api.schemas import LanguageSchema, LanguageSchemaRequest
from models.language_model import LanguageModel
from core.auth import logged_in_user
from api.repository.language_transactions import create_language_in_db

router = APIRouter(
    prefix="/language",
    tags=['Language']
)


@router.get('/names', status_code=status.HTTP_200_OK)
def get_All_Language_Names(db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    languages = db.query(LanguageModel).all()    
    names = ([language.name for language in languages])
    return names


@router.get('', status_code=status.HTTP_200_OK, response_model=List[LanguageSchema])
def get_All_Languages(db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    language = db.query(LanguageModel).all()    
    return language


@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Language_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
   
    language = db.query(LanguageModel).filter(LanguageModel.id==id).first()
    language.interpreters   
    return language


@router.post('', status_code=status.HTTP_200_OK )
def create_Language(request: LanguageSchemaRequest, db: Session = Depends(get_db_session) , user = Depends(logged_in_user)):
    return create_language_in_db(request, db)
    




# @router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
# def delete_Language_By_Id(id: int, db: Session= Depends(get_db_session)):
   
#     language = db.query(LanguageModel).where(LanguageModel.id==id)
#     language.delete(synchronize_session=False)
#     db.commit()      
#     return 'Language deleted'

