
import re
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.interpreter_model import InterpreterModel

from models.booking_model import BookingDatesModel, BookingModel
from api.schemas.booking_schema import BookingSearchRequestSchema
from datetime import datetime


def search_Booking(request: BookingSearchRequestSchema, db: Session):

    bookings = db.query(BookingModel).join(BookingDatesModel)

    bookings = apply_file_number(bookings, request.file)
    bookings = apply_location(bookings, request.locationId)    
    bookings = apply_interpreter(bookings, request.interpreter, db)

    bookings = apply_dates(bookings, request.dates)

    return bookings.all()


def apply_file_number(bookings, file_number):
    if file_number is not None and len(file_number)>0:
        return bookings.where(func.lower(BookingModel.file) == func.lower(file_number.strip()))
    else:
        return bookings


def apply_location(bookings, location_id):
    if location_id and location_id>0:
        return bookings.where(BookingDatesModel.location_id==location_id)
    else:
        return bookings


def apply_interpreter(bookings, name, db):

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

        interpreter_query = db.query(InterpreterModel).where(InterpreterModel.disabled==False)

        interpreters= interpreter_query.filter(            
            func.lower(InterpreterModel.last_name).contains(name) |
            func.lower(InterpreterModel.first_name).contains(name) |
            (func.lower(InterpreterModel.last_name).contains(name_two) & func.lower(InterpreterModel.first_name).contains(name_one)) |
            (func.lower(InterpreterModel.first_name).contains(name_two) & func.lower(InterpreterModel.last_name).contains(name_one))
        ).all()

        interpreters_id_list = [interpreter.id for interpreter in interpreters]

        return bookings.where(BookingModel.interpreter_id.in_(interpreters_id_list))
    else:
        return bookings


def apply_dates(bookings, booking_ranges):
    
    if (not booking_ranges or 
        len(booking_ranges)==0 or
        not booking_ranges[0].startDate or
        not booking_ranges[0].endDate
    ):
        return bookings

    start_date = booking_ranges[0].startDate
    end_date = booking_ranges[0].endDate

    return bookings.where(BookingDatesModel.date >= start_date, BookingDatesModel.date <= end_date)
    
