
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from core.auth import admin_user, user_in_role

from api.repository.adm_transactions import get_fillable_pdf


router = APIRouter(
    prefix="/adm",
    tags=['ADM322']
)


@router.get('/fillable-pdf', status_code=status.HTTP_200_OK)
def get_ADM322_Fillable_Pdf(user = Depends(user_in_role)):
    return get_fillable_pdf()




