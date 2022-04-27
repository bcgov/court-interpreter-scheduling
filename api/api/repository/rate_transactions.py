from pytz import timezone
from sqlalchemy.orm.session import Session
from models.rate_model import RateModel
from fastapi import HTTPException, status

from api.repository.user_transactions import get_update_by
from typing import List
from api.schemas.rate_schema import RateSchema

from datetime import datetime, timedelta



def modify_rates(rates_request: List[RateSchema], db: Session, username):
    
    updated_by = get_update_by(db, username)
    
    for request in rates_request:

        rate_request = request.dict()        
           
        if not rate_request['id']:
            del rate_request['id']
            rate_request['updated_by'] = updated_by
            rate_request['previous_value'] = rate_request['value']
            rate_request['value_changed_date'] = datetime.now()
            new_rate = RateModel(**rate_request)
            db.add(new_rate)
        else:
            current_rate_query = db.query(RateModel).filter(RateModel.id==rate_request['id'])
            current_rate = current_rate_query.first()
            if not current_rate:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Rates Table has some issues.")
            
            if current_rate.value_changed_date:
                freeze_period = current_rate.value_changed_date + timedelta(days=30) #rates freezing period is 30 days             

                if datetime.now(tz=freeze_period.tzinfo) > freeze_period:
                    rate_request['previous_value'] = current_rate.value
                    rate_request['value_changed_date'] = datetime.now()
                
            else:
                rate_request['previous_value'] = rate_request['value']
                rate_request['value_changed_date'] = datetime.now()
                    


            del rate_request['name']
            rate_request['updated_by'] = updated_by             
            current_rate_query.update(rate_request)
            db.commit()



    
