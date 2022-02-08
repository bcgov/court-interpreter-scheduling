from sqlalchemy.orm import Session
from fastapi import HTTPException, APIRouter, status
from api.schemas import BookingRequestSchema
from models.booking_model import BookingModel, BookingDatesModel
from models.user_model import UserModel
from models.booking_enums import BookingStatusEnum, BookingPeriodEnum


def create_booking_in_db(request:BookingRequestSchema, db: Session, username):
        
    booking_request = request.dict()
    booking_request = add_update_by(booking_request, db, username)
    
    if (('interpreter_id' not in booking_request) or not booking_request['interpreter_id']):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"'interpreter_id' is required.")
    
    booking_dates = booking_request['dates']
    del booking_request['dates']

    new_booking = BookingModel(**booking_request)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    add_dates(booking_dates, db, new_booking.id, new_booking.interpreter_id)
    
    return new_booking.id



def update_booking_in_db(id: int, request:BookingRequestSchema, db: Session, username):
    booking_request = request.dict()
    booking_request = add_update_by(booking_request, db, username)

    if 'interpreter_id' in booking_request:
        del booking_request['interpreter_id']

    booking_dates = booking_request['dates']
    del booking_request['dates']

    booking_query = db.query(BookingModel).filter(BookingModel.id==id)
    booking = booking_query.first()    
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Booking does not exist.")

    check_conflict_dates(db, booking, booking_request, booking_dates)

    booking_query.update(booking_request)    
    db.commit()
    # print(booking)
    # print(booking.interpreter_id)

    add_dates(booking_dates, db, id, booking.interpreter_id)

    return booking.id


def check_conflict_dates(db:Session , booking, booking_request, booking_dates):
       
    other_bookinag_date_query = db.query(BookingDatesModel).join(BookingModel).filter(
        BookingModel.status!=BookingStatusEnum.CANCELLED, 
        BookingDatesModel.interpreter_id==booking.interpreter_id,
        BookingDatesModel.booking_id!=booking.id).all()
    current_interpreter_scheduel_date = [date.date for date in other_bookinag_date_query]
    current_interpreter_scheduel_period = [date.period for date in other_bookinag_date_query]
    
    for booking_date in booking_dates:
        
        if booking_date['date'] in current_interpreter_scheduel_date:
            inx = current_interpreter_scheduel_date.index(booking_date['date'])
            current_scheduel_period = current_interpreter_scheduel_period[inx]  
            if ( 
                booking_date['period'] == current_scheduel_period or
                booking_date['period'] == BookingPeriodEnum.WHOLE_DAY or
                current_scheduel_period== BookingPeriodEnum.WHOLE_DAY                
            ):               
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Booking date '{booking_date['date'].strftime('%b %d %Y')}' conflicts with the current interpreter schedule.")


def add_update_by(booking_request, db: Session, username):

    current_user = db.query(UserModel).filter( UserModel.username==username).first()    
    if not current_user:
        raise HTTPException(status_code=404, detail=f"User is not available.")
        
    updated_by = current_user.display_name+"_____"+current_user.username
    booking_request['updated_by'] = updated_by
    return booking_request



def add_dates(booking_dates, db: Session, booking_id, interpreter_id):

    existing_booking_dates = db.query(BookingDatesModel).filter(BookingDatesModel.booking_id==booking_id).all()
    
    if len(existing_booking_dates)>0:
        for existing_date in existing_booking_dates:

            req_booking_date =[booking_date for booking_date in booking_dates if (('id' in booking_date) and (booking_date['id']==existing_date.id))]
            db_booking_date = db.query(BookingDatesModel).filter(BookingDatesModel.id==existing_date.id)
            
            # print(req_booking_date)
            if len(req_booking_date)>0:
                #modify
                db_booking_date.update(req_booking_date[0])
                req_booking_date[0]['processed']=True
            else:
                #delete
                db_booking_date.delete(synchronize_session=False)
        db.commit()    

    # print(booking_dates)

    for booking_date in booking_dates:

        if ('processed' in booking_date) and (booking_date['processed']==True ) :
            continue

        new_booking_date = BookingDatesModel(
            date = booking_date['date'],
            period = booking_date['period'],
            arrivalTime = booking_date['arrivalTime'],            
            interpreter_id = interpreter_id,
            booking_id = booking_id
        )
        db.add(new_booking_date)
    
    db.commit()