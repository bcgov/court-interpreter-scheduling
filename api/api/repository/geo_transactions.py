from fastapi import status, HTTPException
from api.schemas.geo_schema import GeoUpdateScheduleRequestSchema
from models.user_model import UserModel
from models.geo_status_model import GeoStatusModel
from sqlalchemy.orm.session import Session

from datetime import datetime
from datetime import timedelta
from datetime import timezone
import json


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
