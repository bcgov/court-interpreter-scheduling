from fastapi import APIRouter, status, HTTPException, Depends, Request

from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import InterpreterResponseSchema, InterpreterSearchRequestSchema, InterpreterRequestSchema

from api.repository.search_interpreter_transactions import search_Interpreter
from models.interpreter_model import InterpreterModel
from core.auth import logged_in_user

from api.repository.interpreter_transactions import update_interpreter_geo_coordinates_in_db, create_interpreter_in_db, modify_interpreter_in_db

router = APIRouter(
    prefix="/interpreter",
    tags=['Interpreter']
)


@router.post('/search', status_code=status.HTTP_200_OK, response_model=InterpreterResponseSchema)
def search_Interpreters(request: InterpreterSearchRequestSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    return InterpreterResponseSchema(data = search_Interpreter(request, db), pagination = {"page":1, "limit":1000})
 

@router.get('', status_code=status.HTTP_200_OK, response_model=InterpreterResponseSchema)
def get_All_Interpreters(db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.disabled==False).all()
    return InterpreterResponseSchema(data = interpreter, pagination = {"page":1, "limit":1000})


@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Interpreter_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.id==id).first()
    interpreter.languages
    return interpreter


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Interpreter_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
   
    interpreter = db.query(InterpreterModel).where(InterpreterModel.id==id)
    interpreter.update({"disabled": True})
    db.commit()      
    return 'Interpreter deleted'


@router.put('/update-geo-coordinates')
def update_geo_coordinates_of_All_Interpreters(db: Session= Depends(get_db_session)):

    update_interpreter_geo_coordinates_in_db(db)    
    return "Success"


@router.post('', status_code=status.HTTP_200_OK)
def create_Interpreter(request:InterpreterRequestSchema, db: Session = Depends(get_db_session), user = Depends(logged_in_user)):
    return create_interpreter_in_db(request, db, user['username'])


@router.put('/{id}', status_code=status.HTTP_200_OK)
def modify_Interpreter(id: int, request:InterpreterRequestSchema, db: Session = Depends(get_db_session), user = Depends(logged_in_user)):
    return modify_interpreter_in_db(id, request, db, user['username'])