from models.interpreter_model import InterpreterModel
from sqlalchemy.orm import Session

from core.geo_coordinate_service import get_latitude_longitude_service

def update_interpreter_geo_coordinates_in_db(db: Session):
    
    interpreters = db.query(InterpreterModel)
    for interpreter in interpreters.all():
        
        latitude, longitude = get_latitude_longitude_service(interpreter.address, "", interpreter.city, interpreter.postal_code, interpreter.province, google_map=False)
        
        interpreter_query = interpreters.filter(InterpreterModel.id==interpreter.id)
        interpreter_query.update({"address_latitude": latitude, "address_longitude": longitude})
        db.commit()


