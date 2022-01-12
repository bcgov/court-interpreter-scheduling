from starlette import status
from models.interpreter_model import InterpreterModel
from models.user_model import UserModel
from models.language_model import LanguageModel, InterpreterLanguageModel

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from api.schemas import InterpreterRequestSchema

from core.geo_coordinate_service import get_latitude_longitude_service



def update_interpreter_geo_coordinates_in_db(db: Session):
    
    interpreters = db.query(InterpreterModel)
    for interpreter in interpreters.all():
        
        latitude, longitude = get_latitude_longitude_service(interpreter.address, "", interpreter.city, interpreter.postal_code, interpreter.province, google_map=False)
        
        interpreter_query = interpreters.filter(InterpreterModel.id==interpreter.id)
        interpreter_query.update({"address_latitude": latitude, "address_longitude": longitude})
        db.commit()


def create_interpreter_in_db(request:InterpreterRequestSchema, db: Session, username):

    interpreter_request = request.dict()
    check_required_fields(interpreter_request, db)

    interpreter_languages = interpreter_request['languages']
    del interpreter_request['languages']

    duplicate_recoerd_check(interpreter_request, db)

    interpreter_request['province'] = province_abvr(interpreter_request['province'])

    interpreter_request = add_update_by(interpreter_request, db, username)
    interpreter_request = add_geo_coordinates(interpreter_request)
    #create a record
    new_interpreter = InterpreterModel(**interpreter_request)   
    db.add(new_interpreter)
    db.commit()
    db.refresh(new_interpreter)

    add_language(interpreter_languages, db, new_interpreter.id)
    
    return new_interpreter.id


def add_update_by(interpreter_request, db: Session, username):

    current_user = db.query(UserModel).filter( UserModel.username==username).first()    
    if not current_user:
        raise HTTPException(status_code=404, detail=f"User is not available.")
        
    updated_by = current_user.display_name+"_____"+current_user.username
    interpreter_request['updated_by'] = updated_by
    return interpreter_request


def add_geo_coordinates(interpreter_request):    
    latitude, longitude = get_latitude_longitude_service(
        interpreter_request['address'], 
        "", 
        interpreter_request['city'], 
        interpreter_request['postal_code'], 
        interpreter_request['province'], 
        google_map=False
    )
    interpreter_request['address_latitude'] = latitude
    interpreter_request['address_longitude'] = longitude
    return interpreter_request


def add_language(interpreter_languages, db: Session, interpreter_id):
    for interpreter_language in interpreter_languages:
        language = db.query(LanguageModel).filter(func.lower(LanguageModel.name)==func.lower(interpreter_language['language'])).first()
        new_inter_lang = InterpreterLanguageModel(
            language_id =language.id,
            language = language.name,
            interpreter_id = interpreter_id,
            level = interpreter_language['level'],
            comment_on_level = interpreter_language['comment_on_level']
        )
        db.add(new_inter_lang)
    db.commit()


def province_abvr(province):
   
    states={
        'british columbia':'BC', 
        'ontario':'ON', 
        'quebec':'QC', 
        'alberta':'AB', 
        'saskatchewan':'SK', 
        'manitoba':'MB',
        'newfoundland and labrador':'NL',
        'newfoundland':'NL',
        'labrador':'NL',
        'prince edward island':'PE',
        'nova scotia':'NS',
        'new brunswick':'NB',
        'yukon':'YT',
        'northwest territories':'NT',
        'nunavut':'NU',
        'washington':'WA',
    }

    if len(province)==2 and province.upper() in list(states.values()):
        return province.upper()

    province = province.lower().strip()
    if province in states:
        return states[province]
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Province name '{province}' is not valid.")


def duplicate_recoerd_check(interpreter_request, db: Session):
    #1
    email = interpreter_request['email']
    gst = interpreter_request['gst_no']        
    if email is None or len(email)==0: email = "_______"
    if gst is None or len(gst)==0: gst = "00000 00000"  
    email = email.strip().lower()
    gst = gst.strip().lower()
    interpreter = db.query(InterpreterModel).filter(or_(
        func.lower(InterpreterModel.email)==email,
        func.lower(InterpreterModel.gst_no)==gst,        
    )).first()
    if interpreter:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Interpreter already exist.")
    
    #2
    first = interpreter_request['first_name']
    last = interpreter_request['last_name']
    city = interpreter_request['city']
    if first is not None: first = first.strip().lower()
    if last is not None: last = last.strip().lower()
    if city is not None: city = city.strip().lower()
    interpreter = db.query(InterpreterModel).filter(
        func.lower(InterpreterModel.first_name)==first,
        func.lower(InterpreterModel.last_name)==last,
        func.lower(InterpreterModel.city)==city
    ).first()
    if interpreter:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Interpreter already exist.")


def check_required_fields(interpreter_request, db: Session):

    # Language is required.
    db_languages = db.query(LanguageModel).all()
    language_names = ([(language.name).lower() for language in db_languages])

    for language in interpreter_request['languages']:
        if language['language'].lower() not in language_names:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Language '{language['language']}' does not exist.")
        
    