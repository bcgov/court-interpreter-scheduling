from starlette import status
from models.interpreter_model import InterpreterModel
from models.user_model import UserModel
from models.language_model import LanguageModel, InterpreterLanguageModel
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from api.schemas.interpreter_schema import InterpreterCreateModifyRequestSchema
from models.geo_status_model import GeoStatusModel

from core.geo_coordinate_service import get_latitude_longitude_service


def update_one_interpreter_geo_coordinates_in_db(id:int, db: Session, google_map: bool):

    geo_service = get_geo_service_name(google_map)

    interpreter_query = db.query(InterpreterModel).filter(InterpreterModel.id==id)
    interpreter = interpreter_query.first()
    latitude, longitude = get_latitude_longitude_service(interpreter.address, "", interpreter.city, interpreter.postal_code, interpreter.province, google_map=google_map)
    interpreter_query.update({"address_latitude": latitude, "address_longitude": longitude, "geo_service":geo_service})
    db.commit()


def update_interpreter_geo_coordinates_in_db(db: Session, google_map: bool):

    geo_service = get_geo_service_name(google_map)

    geo_status = db.query(GeoStatusModel).where(GeoStatusModel.name=='interpreters')

    interpreters_query = db.query(InterpreterModel)
    try:
        interpreters = interpreters_query.all()
    except:
        interpreters = interpreters_query.all()

    total_interpreters=(len(interpreters))
    count=0
    
    for interpreter in interpreters:                
        latitude, longitude = get_latitude_longitude_service(interpreter.address, "", interpreter.city, interpreter.postal_code, interpreter.province, google_map=google_map)
        
        interpreter_query = interpreters_query.filter(InterpreterModel.id==interpreter.id)
        interpreter_query.update({"address_latitude": latitude, "address_longitude": longitude, "geo_service":geo_service})
        count = count+1
        progress = int(100*count/total_interpreters)+1
        if progress>99: progress=99
        print("Interpreter Update Progress => "+str(progress)+" %")
        geo_status.update({"progress":progress})

        db.commit()
        
        
    
    geo_status.update({"progress":100, "updated_at":datetime.now(), 'update_service': geo_service})          
    db.commit()


def get_geo_service_name(google_map):
    if google_map:
        return "Google Map"
    else:
        return "Nominatim"


def create_interpreter_in_db(request:InterpreterCreateModifyRequestSchema, db: Session, username):

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


def modify_interpreter_in_db(id: int, request:InterpreterCreateModifyRequestSchema, db: Session, username):

    interpreter_request = request.dict()
    check_required_fields(interpreter_request, db)

    interpreter_languages = interpreter_request['languages']
    del interpreter_request['languages']

    interpreter_request['province'] = province_abvr(interpreter_request['province'])

    interpreter_request = add_update_by(interpreter_request, db, username)
          
    interpreter_query = db.query(InterpreterModel).filter(InterpreterModel.id==id)
    interpreter = interpreter_query.first()    
    if not interpreter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Interpreter does not exist.")

    interpreter_request = apply_address_changes(interpreter, interpreter_request)

    interpreter_query.update(interpreter_request)    
    db.commit()

    add_language(interpreter_languages, db, id)

    return interpreter.id


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
    interpreter_request['geo_service'] = get_geo_service_name(google_map=False)
    return interpreter_request


def add_language(interpreter_languages, db: Session, interpreter_id):
    
    new_interpreter_languages=list()

    for interpreter_language in interpreter_languages:
        interpreter_language_name = interpreter_language['language'].lower()
        new_interpreter_languages.append(interpreter_language_name)
        language = db.query(LanguageModel).filter(func.lower(LanguageModel.name)==interpreter_language_name).first()
        
        inter_lang_relation = db.query(InterpreterLanguageModel).filter(InterpreterLanguageModel.language_id==language.id, InterpreterLanguageModel.interpreter_id==interpreter_id).first()
        
        if not inter_lang_relation:
            # print(language.id," -> ",interpreter_id," no relation")
            new_inter_lang = InterpreterLanguageModel(
                language_id =language.id,
                language = language.name,
                interpreter_id = interpreter_id,
                level = interpreter_language['level'],
                comment_on_level = interpreter_language['comment_on_level']
            )
            db.add(new_inter_lang)

    # print(new_interpreter_languages)

    previous_interpreter_languages = db.query(InterpreterLanguageModel).filter(InterpreterLanguageModel.interpreter_id==interpreter_id).all()
    for previous_interpreter_language in previous_interpreter_languages:
        # print(previous_interpreter_language.language)
        if(previous_interpreter_language.language).lower() not in new_interpreter_languages :
            inter_lang_relation_query = db.query(InterpreterLanguageModel).filter(InterpreterLanguageModel.id==previous_interpreter_language.id)
            inter_lang_relation_query.delete(synchronize_session=False)
    
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


def apply_address_changes(old_interpreter, interpreter_request): 

    old_address = old_interpreter.address
    if old_address is None: old_address=""

    new_address = interpreter_request['address']
    if new_address is None: new_address=""

    old_city = old_interpreter.city
    if old_city is None: old_city=""

    new_city = interpreter_request['city']
    if new_city is None: new_city=""
   
    old_province = old_interpreter.province
    if old_province is None: old_province=""

    new_province = interpreter_request['province']
    if new_province is None: new_province=""

    old_postal_code = old_interpreter.postal_code
    if old_postal_code is None: old_postal_code=""

    new_postal_code = interpreter_request['postal_code']
    if new_postal_code is None: new_postal_code=""

    if (old_address.lower().strip() != new_address.lower().strip() or
        old_city.lower().strip() != new_city.lower().strip() or
        old_province.lower().strip() != new_province.lower().strip() or
        old_postal_code.lower().strip() != new_postal_code.lower().strip()
    ):
        interpreter_request = add_geo_coordinates(interpreter_request)
    
    return  interpreter_request