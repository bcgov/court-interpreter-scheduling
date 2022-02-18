# import json
from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Response, Request
# from fastapi.encoders import jsonable_encoder
# from threading import Thread

from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from core.auth import user_in_role
from api.schemas.user_schema import LocationSchema, UserSchema
from models.court_location_model import CourtLocationModel



router = APIRouter(
    prefix="/api/v1",
    tags=['JC Interface']
)


@router.get('/location', response_model=List[LocationSchema])
def get_all_locations(db: Session= Depends(get_db_session), user: UserSchema = Depends(user_in_role)):
    
    locations = db.query(CourtLocationModel).all()
    return locations
   
   

