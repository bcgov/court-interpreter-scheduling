
from fastapi import APIRouter, status, HTTPException, Depends, Request
from api.repository.geo_transactions import edit_update_schedule
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas.interpreter_schema import InterpreterGeoStatusSchema
from api.schemas.geo_schema import GeoUpdateScheduleRequestSchema
from models.geo_status_model import GeoStatusModel
from models.interpreter_model import InterpreterModel
from core.auth import super_admin
from typing import List
from api.repository.interpreter_transactions import update_interpreter_geo_coordinates_in_db, update_one_interpreter_geo_coordinates_in_db
from jc_interface.jc_update_courts import update_courts_info_in_db



router = APIRouter(
    prefix="/geo",
    tags=['Geo Coordinates']
)



@router.get('/updating-status', status_code=status.HTTP_200_OK)
def get_Geo_Status(db: Session= Depends(get_db_session), user = Depends(super_admin)):

    updating_status = db.query(GeoStatusModel).all()
    return updating_status



@router.get('/update-locations')
def update_locations(google_map: bool=False, db: Session= Depends(get_db_session), user = Depends(super_admin)):

    update_courts_info_in_db(db, google_map)  
    return "Update has been performed."



@router.get('/update-geo-coordinates')
def update_geo_coordinates_of_All_Interpreters(google_map: bool=False, db: Session= Depends(get_db_session), user = Depends(super_admin)):

    update_interpreter_geo_coordinates_in_db(db, google_map)
    return "Update has been performed."




@router.get('/interpreters', status_code=status.HTTP_200_OK, response_model=List[InterpreterGeoStatusSchema])
def get_All_Interpreters(db: Session= Depends(get_db_session), user = Depends(super_admin)):

    interpreter = db.query(InterpreterModel).filter(InterpreterModel.disabled==False).all()
    return interpreter



@router.put('/update-geo-coordinates/{id}')
def update_geo_coordinates_of_All_Interpreters(id:int, google_map: bool=False, db: Session= Depends(get_db_session), user = Depends(super_admin)):

    update_one_interpreter_geo_coordinates_in_db(id, db, google_map)
    return "Update has been performed."



@router.put('/update-schedule/{id}', status_code=status.HTTP_202_ACCEPTED)
def modify_the_update_schedule(id:int, request: GeoUpdateScheduleRequestSchema, db: Session = Depends(get_db_session), user = Depends(super_admin)):       
    
    return edit_update_schedule(id, request, db)


