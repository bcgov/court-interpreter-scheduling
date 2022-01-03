from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import InterpreterResponseSchema, InterpreterRequestSchema
from typing import List
from api.repository import search_transactions
from models.interpreter_model import InterpreterModel

from api.repository.interpreter_transactions import update_interpreter_geo_coordinates_in_db

router = APIRouter(
    prefix="/interpreter",
    tags=['Interpreter']
)


@router.post('/search', status_code=status.HTTP_200_OK, response_model=InterpreterResponseSchema)
def search_Interpreter(request: InterpreterRequestSchema, db: Session= Depends(get_db_session)):

    return InterpreterResponseSchema(data = search_transactions.search_Interpreter(request, db), pagination = {"page":1, "limit":1000})
 

@router.get('', status_code=status.HTTP_200_OK, response_model=InterpreterResponseSchema)
def get_All_Interpreters(db: Session= Depends(get_db_session)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.disabled==False).all()
    return InterpreterResponseSchema(data = interpreter, pagination = {"page":1, "limit":1000})


@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Interpreter_By_Id(id: int, db: Session= Depends(get_db_session)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.id==id).first()
    interpreter.languages
    return interpreter


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Interpreter_By_Id(id: int, db: Session= Depends(get_db_session)):
   
    interpreter = db.query(InterpreterModel).where(InterpreterModel.id==id)
    interpreter.update({"disabled": True})
    db.commit()      
    return 'Interpreter deleted'


@router.put('/update-geo-coordinates')
def update_geo_coordinates_of_All_Interpreters(db: Session= Depends(get_db_session)):

    update_interpreter_geo_coordinates_in_db(db)    
    return "Success"


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
