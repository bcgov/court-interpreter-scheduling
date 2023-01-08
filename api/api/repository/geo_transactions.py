from fastapi import status, HTTPException
from api.schemas.geo_schema import GeoUpdateScheduleRequestSchema
from models.user_model import UserModel
from models.geo_status_model import GeoStatusModel
from models.interpreter_model import InterpreterModel
from models.court_location_model import CourtDistanceModel, CourtLocationModel, CourtDistanceBackupModel
from sqlalchemy import exc
from sqlalchemy.orm.session import Session

from core.geo_coordinate_service import get_clean_address, call_geo_service

from datetime import datetime
from datetime import timedelta
from datetime import timezone
import json
import logging
logger = logging.getLogger(__name__)



def edit_update_schedule(id:int, request: GeoUpdateScheduleRequestSchema, db: Session):
    
    geo_status = db.query(GeoStatusModel).where(GeoStatusModel.id==id)    
    if not geo_status.first():
        raise HTTPException(status_code=404, detail=f"User is not available.")

    next_update = None
    
    if request.update_schedule:
        next_update = get_next_update_date(request.update_schedule)
  
    geo_status.update({"update_schedule":request.update_schedule, "next_update_at": next_update})
    db.commit()
    return "Updated the schedule"
   
    
def get_next_update_date(update_schedule, ref_date = None): 

    schedule = json.loads(update_schedule)
    months = int(schedule["months"])
    days = int(schedule["days"])
    hour = int(schedule["hour"])
    minute = int(schedule["minute"])
    tz = int(schedule["tz"])

    if ref_date is None: 
        ref_date = datetime.fromisoformat(schedule["reftime"])
    else:
        ref_date = ref_date.astimezone(tz=timezone(timedelta(hours=tz)))


    if months==0:        
        new_date = ref_date + timedelta(days=days)        
        return (datetime(new_date.year, new_date.month, new_date.day, hour,minute,0,0,timezone(timedelta(hours=tz))))
    else:      
        year = ref_date.year
        month = ref_date.month+months        
        if month >12:
            month = month -12
            year = year +1
        return (datetime(year, month, days, hour,minute,0,0,timezone(timedelta(hours=tz))))



def update_one_interpreter_geo_coordinates_in_db(id:int, db: Session):
       
    interpreter_query = db.query(InterpreterModel).filter(InterpreterModel.id==id)
    interpreter = interpreter_query.first()
    if interpreter is None:
        return

    
    
    interpreter_address = get_clean_address(
        interpreter.address,
        "",
        interpreter.city,
        interpreter.postal_code,
        interpreter.province
    )

    
    court_locations = db.query(CourtLocationModel).all()

    for court in court_locations:

        court_distance_query = db.query(CourtDistanceModel).filter(
            CourtDistanceModel.court_id==court.id, 
            CourtDistanceModel.interpreter_id==interpreter.id)

        court_distance = court_distance_query.first()

        #TODO change to GOOGLE
        if court_distance is not None and court.geo_service == "GOOGLE" and interpreter.geo_service == "GOOGLE":
            # print('court '+str(court.id))
            continue
        logger.info(f"Updating court {court.id} >  interpreter {interpreter.id}")

        court_address = get_clean_address(
            court.address_line1, 
            court.address_line2, 
            court.city, 
            court.postal_code, 
            court.province)

        court_distance_backup_query = db.query(CourtDistanceBackupModel).filter(
            CourtDistanceBackupModel.court_address==court_address, 
            CourtDistanceBackupModel.interpreter_address==interpreter_address) 

        court_distance_backup = court_distance_backup_query.first()

        if court_distance_backup is not None:
            geo = court_distance_backup.__dict__            
            # print("++")
            # print(geo)
            # print(geo.__dict__)
            print("Found geo in Backup")
        else:
            geo = call_geo_service(court_address, interpreter_address)

                
        if court_distance is None:            
            adding_location_distance = CourtDistanceModel(
                court_id = court.id,
                interpreter_id = interpreter.id,
                court_code = court.location_code,
                court_address = court_address,
                interpreter_address = interpreter_address,
                distance = geo["distance"],
                duration = geo["duration"],
                court_latitude = geo["court_latitude"],
                court_longitude = geo["court_longitude"],
                interpreter_latitude = geo["interpreter_latitude"],
                interpreter_longitude = geo["interpreter_longitude"]                
            )
            db.add(adding_location_distance)                
            try:
                db.commit()
            except exc.SQLAlchemyError as e:                                        
                error_msg = str(e.__dict__['orig'])
                logger.error(error_msg)
                logger.error(f"Could not add court distance c({court.id}) and i({interpreter.id}) to db!")

        else:           
            court_distance_query.update({ 
                "court_code": court.location_code,
                "court_address": court_address,
                "interpreter_address": interpreter_address,
                "distance": geo["distance"],
                "duration": geo["duration"],
                "court_latitude": geo["court_latitude"],
                "court_longitude": geo["court_longitude"],
                "interpreter_latitude": geo["interpreter_latitude"],
                "interpreter_longitude": geo["interpreter_longitude"]                
            })

    interpreter_query.update({"geo_service":"GOOGLE"}) #TODO change to "GOOGLE"
    db.commit()       


def update_interpreter_geo_coordinates_in_db(db: Session):
    
    geo_status = db.query(GeoStatusModel).where(GeoStatusModel.name=='interpreters')

    interpreters_query = db.query(InterpreterModel)
    #Bug In SQLALCHEMY.
    try:
        interpreters = interpreters_query.all()
    except:
        interpreters = interpreters_query.all()

    total_interpreters=(len(interpreters))
    count=0

    for interpreter in interpreters:
        # print(interpreter.id)
        update_one_interpreter_geo_coordinates_in_db(interpreter.id, db)
        count = count+1

        progress = int(100*count/total_interpreters)+1
        if progress>99: progress=99
        logger.info("Interpreter Update Progress => "+str(progress)+" %")
        geo_status.update({"progress":progress})

        db.commit()

    apply_courts_geo_updates(db)
        
    next_update = None
    update_schedule = geo_status.first().update_schedule
    if update_schedule:
        next_update = get_next_update_date(update_schedule, datetime.now())    
    
    geo_status.update({
        "progress": 100, 
        "updated_at": datetime.now(), 
        "update_service": "GOOGLE",
        "next_update_at": next_update
    })          
    db.commit()


def apply_courts_geo_updates(db: Session):

    court_locations = db.query(CourtLocationModel).all()
    
    for court in court_locations:
        court_query = db.query(CourtLocationModel).filter(CourtLocationModel.id==court.id)
        
        court_address = get_clean_address(
            court.address_line1, 
            court.address_line2, 
            court.city, 
            court.postal_code, 
            court.province) 

        court_distance_query = db.query(CourtDistanceModel).filter(CourtDistanceModel.court_id==court.id)        
        num_of_court_distances = len(court_distance_query.all())
        
        court_distance_query_address_change= court_distance_query.filter(CourtDistanceModel.court_address!=court_address)
        num_of_court_address_changes = len(court_distance_query_address_change.all())
        # print("_____________")
        # print(num_of_court_address_changes)                
    
        #TODO change to GOOGLE
        if court.geo_service!="GOOGLE" and num_of_court_distances>0 and num_of_court_address_changes==0:            
            court_query.update({ "geo_service": "GOOGLE"})
            db.commit()