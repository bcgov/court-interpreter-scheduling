
from fastapi import APIRouter, status, HTTPException, Depends, Request
from api.repository.geo_transactions import edit_update_schedule, update_interpreter_geo_coordinates_in_db, update_one_interpreter_geo_coordinates_in_db
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas.interpreter_schema import InterpreterGeoStatusSchema
from api.schemas.geo_schema import GeoUpdateScheduleRequestSchema
from models.geo_status_model import GeoStatusModel
from models.interpreter_model import InterpreterModel
from core.auth import admin_user
from typing import List

from jc_interface.jc_update_courts import update_courts_info_in_db



router = APIRouter(
    prefix="/geo",
    tags=['Geo Coordinates']
)



@router.get('/updating-status', status_code=status.HTTP_200_OK)
def get_Geo_Status(db: Session= Depends(get_db_session), user = Depends(admin_user)):

    updating_status = db.query(GeoStatusModel).all()
    return updating_status



@router.get('/update-locations')
def update_locations(db: Session= Depends(get_db_session), user = Depends(admin_user)):

    update_courts_info_in_db(db)  
    return "Update has been performed."



@router.get('/update-geo-coordinates')
def update_geo_coordinates_of_All_Interpreters(db: Session= Depends(get_db_session), user = Depends(admin_user)):

    update_interpreter_geo_coordinates_in_db(db, force=True)
    return "Update has been performed."




@router.get('/interpreters', status_code=status.HTTP_200_OK, response_model=List[InterpreterGeoStatusSchema])
def get_All_Interpreters(db: Session= Depends(get_db_session), user = Depends(admin_user)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.disabled==False).all()
    return interpreter



@router.put('/update-geo-coordinates/{id}')
def update_geo_coordinates_of_All_Interpreters(id:int, db: Session= Depends(get_db_session), user = Depends(admin_user)):

    update_one_interpreter_geo_coordinates_in_db(id, db, force=False)
    return "Update has been performed."



@router.put('/update-schedule/{id}', status_code=status.HTTP_202_ACCEPTED)
def modify_the_update_schedule(id:int, request: GeoUpdateScheduleRequestSchema, db: Session = Depends(get_db_session), user = Depends(admin_user)):       
    
    return edit_update_schedule(id, request, db)


