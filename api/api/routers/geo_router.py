
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import UserRoleSchemaRequest
from models.geo_status_model import GeoStatusModel
from core.auth import admin_user
from typing import List




router = APIRouter(
    prefix="/geo",
    tags=['Geo Coordinates']
)


@router.get('/updating-status', status_code=status.HTTP_200_OK)
def get_Geo_Status(db: Session= Depends(get_db_session), user = Depends(admin_user)):

    updating_status = db.query(GeoStatusModel).all()
    return updating_status



# @router.put('/update-schedule', status_code=status.HTTP_202_ACCEPTED)
# def assign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(admin_user)):
       
#     return "Role assigned."


