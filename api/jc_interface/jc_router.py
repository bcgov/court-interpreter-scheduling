import json
from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Response, Request
from fastapi.encoders import jsonable_encoder

from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from jc_interface.jc_calls import JcInterfaceCalls
from core.auth import logged_in_user
from api.schemas import LocationSchema, UserSchema


router = APIRouter(
    prefix="/api/v1",
    tags=['JC Interface']
)


@router.get('/location', response_model=List[LocationSchema])
async def oidc_login_callback(user: UserSchema = Depends(logged_in_user)):
    jc_calls = JcInterfaceCalls()    
    locations = jc_calls.get_court_locations()
    print(locations)
    return locations
   