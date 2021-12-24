from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import InterpreterSchema
from typing import List

from models.interpreter_model import InterpreterModel

router = APIRouter(
    prefix="/interpreter",
    tags=['Interpreter']
)


@router.get('', status_code=status.HTTP_200_OK, response_model=List[InterpreterSchema])
def get_Interpreter_By_Id(db: Session= Depends(get_db_session)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.disabled==False).all()
    # interpreter.languages
    return interpreter


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
