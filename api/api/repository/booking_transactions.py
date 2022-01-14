from sqlalchemy.orm import Session
from fastapi import HTTPException, APIRouter, status
from api.schemas import BookingRequestSchema, BookingResponsePageSchema
from models.booking_model import BookingModel, BookingDatesModel
from models.user_model import UserModel



def create_booking_in_db(request:BookingRequestSchema, db: Session, username):
        
    booking_request = request.dict()
    booking_request = add_update_by(booking_request, db, username)

    booking_dates = booking_request['dates']
    del booking_request['dates']

    new_booking = BookingModel(**booking_request)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    add_dates(booking_dates, db, new_booking.id, new_booking.interpreter_id)
    
    return new_booking.id
    



def add_update_by(booking_request, db: Session, username):

    current_user = db.query(UserModel).filter( UserModel.username==username).first()    
    if not current_user:
        raise HTTPException(status_code=404, detail=f"User is not available.")
        
    updated_by = current_user.display_name+"_____"+current_user.username
    booking_request['updated_by'] = updated_by
    return booking_request



def add_dates(booking_dates, db: Session, booking_id, interpreter_id):

    for booking_date in booking_dates:

        new_booking_date = BookingDatesModel(
            date = booking_date['date'],
            period = booking_date['period'],
            arrivalTime = booking_date['arrivalTime'],            
            interpreter_id = interpreter_id,
            booking_id = booking_id
        )
        db.add(new_booking_date)
    
    db.commit()