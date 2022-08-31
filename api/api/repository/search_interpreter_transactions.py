
import re
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.interpreter_model import InterpreterModel
from models.language_model import InterpreterLanguageModel
from models.booking_model import BookingDatesModel, BookingModel
from api.schemas.interpreter_search_schema import InterpreterSearchRequestSchema
from datetime import datetime
from math import sin, cos, sqrt, atan2, radians
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

    all_interpreters = interpreter.all()
    # all_interpreters = apply_dates(all_interpreters, request.dates, db)


    # distance function
    interpreters = apply_distance(all_interpreters, request.distanceLimit, request.location)

    return interpreters


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

def apply_distance(interpreters, distanceLimit, location):

    if (distanceLimit == True 
        and location is not None 
        and location.latitude is not None
        and location.longitude is not None
    ):
        interpreter_in_range = list()
        for interpreter in interpreters:
            if is_interpreter_with_in_range(interpreter.address_latitude, interpreter.address_longitude, location.latitude, location.longitude, 32)==True:
                interpreter_in_range.append(interpreter)

        return interpreter_in_range
    else:
        return interpreters



def is_interpreter_with_in_range(latitude1, longitude1, latitude2, longitude2, range):
    R = 6373.0
    lat1 = radians(latitude1)
    lon1 = radians(longitude1)

    lat2 = radians(latitude2)
    lon2 = radians(longitude2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance < range


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