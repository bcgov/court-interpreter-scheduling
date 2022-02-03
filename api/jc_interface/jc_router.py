# import json
from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Response, Request
# from fastapi.encoders import jsonable_encoder
from threading import Thread

from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from core.auth import admin_user, user_in_role
from api.schemas import LocationSchema, UserSchema
from models.court_location_model import CourtLocationModel

from jc_interface.jc_update_courts import update_courts_info_in_db

router = APIRouter(
    prefix="/api/v1",
    tags=['JC Interface']
)


@router.get('/location', response_model=List[LocationSchema])
def get_all_locations(db: Session= Depends(get_db_session), user: UserSchema = Depends(user_in_role)):
    
    locations = db.query(CourtLocationModel).all()
    return locations
   
   
@router.get('/update-locations')
def update_locations(db: Session= Depends(get_db_session), user: UserSchema = Depends(admin_user)):
    google_map=False
    update_courts_info_in_db(db, google_map)    
    # Thread(target=update_courts_info_in_db, args=(db,google_map,)).start()
    return "Update has been performed."
