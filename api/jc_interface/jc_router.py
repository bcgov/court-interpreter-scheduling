from http.client import HTTPException
from typing import List, Optional
from api.schemas.file_search_schema import FileSearchResponseSchema, FileSearchRequestSchema, AppearanceDetailRequestSchema, AppearanceDetailResponseSchema
from jc_interface.jc_calls import JcInterfaceCalls
from fastapi import APIRouter, Depends
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from core.auth import user_in_role
from api.schemas.user_schema import LocationSchema, UserSchema
from models.court_location_model import CourtLocationModel


import logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=['JC Interface']
)


@router.get('/location', response_model=List[LocationSchema])
def get_all_locations(db: Session= Depends(get_db_session), user: UserSchema = Depends(user_in_role)):
    
    locations = db.query(CourtLocationModel).all()
    return locations

def get_jc_interface():
    return JcInterfaceCalls()

@router.post('/files/search', response_model=FileSearchResponseSchema)
def get_criminal_files(
    request: FileSearchRequestSchema,
    jc_interface: JcInterfaceCalls = Depends(get_jc_interface)
):
    try:
        query_params = request.query.dict() if request.query else {}
        return jc_interface.get_file_search(is_criminal=request.is_criminal, query_params=query_params)
    except HTTPException as e:
        raise e
@router.post('/files/appearance', response_model=AppearanceDetailResponseSchema)
def get_file_appearances(
    request: AppearanceDetailRequestSchema,
    jc_interface: JcInterfaceCalls = Depends(get_jc_interface)
):
    try:
        query_params = request.query.dict() if request.query else {}
        return jc_interface.get_file_appearances(is_criminal=request.is_criminal, file_id=request.file_id, query_params=query_params)
    except HTTPException as e:
        raise e
