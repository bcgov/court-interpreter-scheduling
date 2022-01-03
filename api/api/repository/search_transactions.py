
import re
from fastapi import HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.sql.expression import true
from models.interpreter_model import InterpreterModel
from models.language_model import InterpreterLanguageModel
from api.schemas import InterpreterRequestSchema
from datetime import datetime
from math import sin, cos, sqrt, atan2, radians


def search_Interpreter(request: InterpreterRequestSchema, db: Session):

    interpreter = db.query(InterpreterModel).join(InterpreterLanguageModel).where(InterpreterModel.disabled==False)

    interpreter = apply_language(interpreter, request.language)
    interpreter = apply_level(interpreter, request.level)
    interpreter = apply_name(interpreter, request.name)
    interpreter = apply_city(interpreter, request.city)
    interpreter = apply_active(interpreter, request.active)
    interpreter = apply_crc_date(interpreter, request.criminalRecordCheck)
    interpreter = apply_keyword(interpreter, request.keywords)

    # distance function
    interpreters = apply_distance(interpreter.all(), request.distanceLimit, request.location)

    return interpreters


def apply_city(interpreter, city):
    if city is not None and len(city)>0:
        return interpreter.where(func.lower(InterpreterModel.city) == func.lower(city.strip()))
    else:
        return interpreter

def apply_active(interpreter, active):
    if active == True:
        return interpreter.where(InterpreterModel.contract_valid == True)
    else:
        return interpreter

def apply_crc_date(interpreter, crc_date):
        
    if crc_date is not None and isinstance(crc_date, datetime):
        return interpreter.where(InterpreterModel.crc_check_date >= crc_date)
    else:
        return interpreter

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

def apply_language(interpreter, language):

    if language is not None and len(language)>0:
        language = language.lower().strip()         
        return interpreter.filter(func.lower(InterpreterLanguageModel.language)==language)
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