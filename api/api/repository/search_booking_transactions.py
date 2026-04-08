
import re
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import case, func
from .user_transactions import check_user_roles
from models.interpreter_model import InterpreterModel
from models.booking_model import BookingCasesModel, BookingDatesModel, BookingModel
from api.schemas.booking_schema import BookingSearchRequestSchema
from datetime import datetime, timedelta


def search_booking(request: BookingSearchRequestSchema, db: Session, username):

    bookings = db.query(BookingModel).join(BookingDatesModel)

    bookings = apply_file_number(bookings, request.file)
    
    bookings = apply_location(bookings, request.locationIds, db, username)    
    
    bookings = apply_interpreter(bookings, request.interpreter, db)

    bookings = apply_dates(bookings, request.dates)

    return bookings.all()


def apply_file_number(bookings, file_number):
    if file_number is not None and len(file_number) > 0:
        return bookings.join(BookingCasesModel).where(
            _file_number_sql_expr(BookingCasesModel.file, file_number)
        )
    return bookings


def _file_number_sql_expr(file_col, file_number):
    """Returns a SQLAlchemy boolean expression that matches file_number against a stored file string."""

    # Step 1: Strip the location prefix if present
    # Some files are stored as "<location_id>: <file_number>", e.g. "3531:  112583-1K".
    # We only want the part after the colon, trimmed of leading spaces.
    # Files without a colon (e.g. "12-1234-c") are passed through unchanged.
    
    colon_pos = func.strpos(file_col, ':')
    normalized = case(
        (file_col.like('%:%'), func.ltrim(func.substr(file_col, colon_pos + 1))),
        else_=file_col,
    )

    # Step 2: Match file_number at the start of the first significant (≥5-digit) run.
    # The pattern skips any leading non-digit characters and any short (1–4 digit)
    
    min_file_digits = 5
    extra_needed = max(0, min_file_digits - len(file_number))
    prefix_skip = r'^[^0-9]*(?:[0-9]{1,4}[^0-9]+)*'
    if extra_needed > 0:
        pattern = f'{prefix_skip}{re.escape(file_number)}[0-9]{{{extra_needed},}}'
    else:
        pattern = f'{prefix_skip}{re.escape(file_number)}'
    return normalized.regexp_match(pattern)



def apply_location(bookings, location_ids, db, username):
    """
    Filter bookings by location(s).
    
    Args:
        bookings: Query object
        location_ids: List of location IDs, or None to show all (super-admin only)
        db: Database session
        username: Username for role checking
    
    Returns:
        Filtered bookings query
    """
    if location_ids and len(location_ids) > 0:
        # Filter by the provided location ID(s)
        return bookings.where(BookingModel.location_id.in_(location_ids))
    elif location_ids is None:
        # Super-admin can see all locations
        return bookings
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Search Location must be defined.")


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
        start = datetime.now()+ timedelta(days=-180) # only records from 6 months ago
        return bookings.where(BookingDatesModel.date >= start)

    start_date = booking_ranges[0].startDate
    end_date = booking_ranges[0].endDate

    return bookings.where(BookingDatesModel.date >= start_date, BookingDatesModel.date <= end_date)
    
