
import re
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
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
        # Normalize search term: strip separators (spaces, dashes, colons) so that
        # "F123", "F 123", and "F-123" all match a stored value like "F-123456"
        normalized_search = re.sub(r'[\s\-:]', '', file_number.strip()).lower()
        if not normalized_search:
            return bookings
        # Normalize the stored column the same way via chained SQL REPLACE calls
        normalized_col = func.replace(
            func.replace(
                func.replace(
                    func.lower(BookingCasesModel.file),
                    '-', ''
                ),
                ':', ''
            ),
            ' ', ''
        )
        return bookings.join(BookingCasesModel).where(normalized_col.contains(normalized_search))
    else:
        return bookings


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
    
