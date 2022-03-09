
from models.geo_status_model import GeoStatusModel
from sqlalchemy.orm.session import Session

from datetime import datetime

from core.repeat_task import repeat_every
from core.multi_database_middleware import DBSession

from jc_interface.jc_update_courts import update_courts_info_in_db
from api.repository.interpreter_transactions import update_interpreter_geo_coordinates_in_db



async def check_geo_update_schedule(db: Session):
    
    for id in [1,2]:
        days_diff, minutes_diff, updating_name, progress= get_time_diff(id,db)

        if days_diff<0:
            # print("Update_Late")
            update_geo(updating_name, progress, db)

        if days_diff==0 and minutes_diff<60:
            # print("___RUN_the_Second_Watcher___")
            if id ==1:    
                await check_id_1_update_schedule_task()
            elif id ==2 :
                await check_id_2_update_schedule_task()
            



def check_geo_update_schedule_every_5mins(id, db: Session):
    days_diff, minutes_diff, updating_name, progress= get_time_diff(id, db)
    if days_diff<0:       
        # print("Update_OnTime_ID_"+str(id))
        update_geo(updating_name, progress, db)
 


@repeat_every(seconds=300, max_repetitions=13) # second= 60*5=300 => every 5mins
def check_id_1_update_schedule_task() -> None:
    # print("________SECOND__LOOP_____ID_1_____________________________")
    id = 1
    with DBSession() as db:
        check_geo_update_schedule_every_5mins(id, db)


@repeat_every(seconds=300, max_repetitions=13) # second= 60*5=300 => every 5mins
def check_id_2_update_schedule_task() -> None:
    # print("________SECOND__LOOP_____ID_2_____________________________")
    id = 2
    with DBSession() as db:
        check_geo_update_schedule_every_5mins(id, db)



def get_time_diff(id, db:Session):

    geo_status = db.query(GeoStatusModel).where(GeoStatusModel.id==id)
    next_update = geo_status.first().next_update_at
    updating_name = geo_status.first().name
    progress = geo_status.first().progress

    if next_update:
        current_time = datetime.now(next_update.tzinfo)
        time_diff = next_update-current_time
        days_diff = time_diff.days
        minutes_diff = time_diff.seconds / 60
    else:
        current_time = datetime.now()
        days_diff = 1000
        minutes_diff = 1000
    
    # print("_______________________")
    # print("Update For "+str(updating_name))
    # print("")
    # print("Next Update at: "+str(next_update))    
    # print("Current Time:   "+str(current_time))
    # print("Days diff: "+str(days_diff))
    # print("Minutes diff: "+str(minutes_diff))
        
    return days_diff, minutes_diff, updating_name, progress




def update_geo(updating_name, progress, db):
    
    if progress==100:
        # print("__________________________Updating____________________________>>>______"+str(updating_name))
        
        google_map=True
        
        if updating_name=='interpreters':
            update_interpreter_geo_coordinates_in_db(db, google_map)
        elif updating_name=='locations':
            update_courts_info_in_db(db, google_map)  
        
    