
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas.rate_schema import RateSchema, RateResponseSchema
from models.rate_model import RateModel
from core.auth import admin_user, user_in_role
from typing import List

from api.repository.rate_transactions import modify_rates


router = APIRouter(
    prefix="/rate",
    tags=['Rate']
)


@router.get('', status_code=status.HTTP_200_OK, response_model=List[RateResponseSchema])
def get_All_Rates(db: Session= Depends(get_db_session), user = Depends(user_in_role)):

    role = db.query(RateModel).all()
    return role


@router.put('', status_code=status.HTTP_202_ACCEPTED)
def edit_Rates(request: List[RateSchema], db: Session= Depends(get_db_session), user = Depends(admin_user)):
    
    modify_rates(request, db, user['username'])    
    return "Rate changes applied."


