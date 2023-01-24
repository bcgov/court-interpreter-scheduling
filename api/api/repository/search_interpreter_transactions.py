
import re
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.court_location_model import CourtDistanceModel
from models.interpreter_model import InterpreterModel
from models.language_model import InterpreterLanguageModel
from models.booking_model import BookingDatesModel, BookingModel
from api.schemas.interpreter_search_schema import InterpreterSearchRequestSchema
from datetime import datetime

from api.repository.user_transactions import check_user_roles

from models.booking_enums import BookingStatusEnum, BookingPeriodEnum

def search_Interpreter(request: InterpreterSearchRequestSchema, db: Session, username):

    if not check_user_roles(['cis-admin','super-admin'],username,db):
        request.active = True

    interpreter = db.query(InterpreterModel).join(InterpreterLanguageModel).where(InterpreterModel.disabled==False)

    interpreter = apply_language(interpreter, request.languageId)
    interpreter = apply_level(interpreter, request.level)
    interpreter = apply_name(interpreter, request.name)
    interpreter = apply_city(interpreter, request.city)
    interpreter = apply_active(interpreter, request.active)
    interpreter = apply_crc_date(interpreter, request.criminalRecordCheck)
    interpreter = apply_keyword(interpreter, request.keywords)
    interpreter = apply_distance(interpreter, request.distanceLimit, request.location)

    all_interpreters = add_court_info(interpreter.all(), request.location, db)

    return all_interpreters


def apply_city(interpreter, city):
    if city is not None and len(city)>0:
        return interpreter.where(func.lower(InterpreterModel.city) == func.lower(city.strip()))
    else:
        return interpreter


def apply_active(interpreter, active):
    if active is not None:
        return interpreter.where(InterpreterModel.contract_valid == active)
    else:
        return interpreter


def apply_crc_date(interpreter, crc_date):
    
    if (not crc_date or                
        not crc_date.startDate or
        not crc_date.endDate
    ):
        return interpreter
    
    start_date = crc_date.startDate
    end_date = crc_date.endDate
    return interpreter.where(InterpreterModel.crc_check_date >= start_date, InterpreterModel.crc_check_date <= end_date)
    

def apply_keyword(interpreter, keywords):
    if keywords is not None and len(keywords)>0:
        all_keywords = keywords.lower().split(",")
        for keyword in all_keywords:
            keyword = keyword.strip()
            interpreter = interpreter.filter(            
                func.lower(InterpreterModel.last_name).contains(keyword) |
                func.lower(InterpreterModel.first_name).contains(keyword) |
                func.lower(InterpreterModel.address).contains(keyword) |
                func.lower(InterpreterModel.city).contains(keyword) |
                func.lower(InterpreterModel.home_phone).contains(keyword) |
                func.lower(InterpreterModel.business_phone).contains(keyword) |
                func.lower(InterpreterModel.cell_phone).contains(keyword) |
                func.lower(InterpreterModel.email).contains(keyword)
            )
        return interpreter
    else:
        return interpreter


def apply_name(interpreter, name):
    if name is not None and len(name)>0:
        name = name.lower().strip()
        names = re.split(" |,",name)
        name_one = names[0].strip()
        name_two = ""
        if len(names)==2:
            name_two = names[1].strip()
        elif len(names)==3:
            if len(names[1]) != 0:
                name_two = names[1].strip()
            else:
                name_two = names[2].strip()

        return interpreter.filter(            
            func.lower(InterpreterModel.last_name).contains(name) |
            func.lower(InterpreterModel.first_name).contains(name) |
            (func.lower(InterpreterModel.last_name).contains(name_two) & func.lower(InterpreterModel.first_name).contains(name_one)) |
            (func.lower(InterpreterModel.first_name).contains(name_two) & func.lower(InterpreterModel.last_name).contains(name_one))
        )
    else:
        return interpreter


def apply_language(interpreter, language_id):

    if language_id is not None:       
        return interpreter.filter(InterpreterLanguageModel.language_id==language_id)
    else:
        return interpreter


def apply_level(interpreter, levels):

    if levels is not None and len(levels)>0:
        levels_int = list()
        for level in levels:
            if level in ["1","2","3","4"]:                
                levels_int.append(int(level))

        if len(levels_int)>0:
            return interpreter.filter(InterpreterLanguageModel.level.in_(levels_int))
        else:
            return interpreter
    else:
        return interpreter


def apply_distance(interpreter, distanceLimit, location):

    if (distanceLimit == True 
        and location is not None 
        and location.id is not None
    ):        
        DISTANCE_LIMIT=32000   # 32km limit
        return (interpreter
            .join(CourtDistanceModel)
            .filter(CourtDistanceModel.court_id==location.id)
            .filter(CourtDistanceModel.distance.__le__(DISTANCE_LIMIT))
        )
    else:
        return interpreter


def apply_dates(interpreters, booking_dates, db):
    
    if not booking_dates or len(booking_dates)==0:
        return interpreters

    interpreters_list = [inter.id for inter in interpreters]
    booked_dates = db.query(BookingDatesModel).join(BookingModel).filter(BookingDatesModel.status!=BookingStatusEnum.CANCELLED, BookingDatesModel.interpreter_id.in_(interpreters_list)).all()

    whole_day_asked_dates = list()
    morning_asked_dates = list()
    afternoon_asked_dates = list()

    for booking_date in booking_dates:        
        date = booking_date.date.strftime("%Y-%m-%d")
        if booking_date.period == BookingPeriodEnum.MORNING.value:            
            morning_asked_dates.append(date)
        elif booking_date.period == BookingPeriodEnum.AFTERNOON.value:
            afternoon_asked_dates.append(date)            
        else:            
            whole_day_asked_dates .append(date)

    morning=BookingPeriodEnum.MORNING.value
    afternoon=BookingPeriodEnum.AFTERNOON.value
    allday=BookingPeriodEnum.WHOLE_DAY.value
    busy_interpreters = list()
    
    for booked_date in booked_dates:
        
        interpreter_id = booked_date.interpreter_id
        if interpreter_id in busy_interpreters:
            continue

        busy_date = booked_date.date.strftime("%Y-%m-%d")

        if busy_date in whole_day_asked_dates:
            busy_interpreters.append(interpreter_id)
        elif busy_date in morning_asked_dates and (booked_date.period==morning or booked_date.period==allday):
            busy_interpreters.append(interpreter_id)
        elif busy_date in afternoon_asked_dates and (booked_date.period==afternoon or booked_date.period==allday):
            busy_interpreters.append(interpreter_id)
    
    return [interpreter for interpreter in interpreters if interpreter.id not in busy_interpreters]


def add_court_info(interpreters, location, db):

    if location is not None and location.id is not None:
        for interpreter in interpreters:
            court = db.query(CourtDistanceModel).filter(
                    CourtDistanceModel.court_id==location.id,
                    CourtDistanceModel.interpreter_id==interpreter.id
                ).first()
            if court is not None:
                interpreter.court_distance=court.distance
                interpreter.court=court
    return interpreters