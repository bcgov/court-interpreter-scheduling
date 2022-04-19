from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas.booking_schema import BookingRequestSchema, BookingResponseSchema, BookingSearchRequestSchema
from models.booking_model import BookingModel, BookingDatesModel
from core.auth import admin_user, user_in_role
from api.repository.booking_transactions import create_booking_in_db, update_booking_in_db
from api.repository.search_booking_transactions import search_Booking
from models.booking_enums import BookingStatusEnum

router = APIRouter(
    prefix="/booking",
    tags=['Booking']
)



@router.post('/search', status_code=status.HTTP_200_OK, response_model=List[BookingResponseSchema])
def search_Bookings(request: BookingSearchRequestSchema, db: Session= Depends(get_db_session), user = Depends(user_in_role)):

    return search_Booking(request, db)


@router.get('/interpreter/{id}', status_code=status.HTTP_200_OK)
def get_All_Active_Bookings_For_Interpreter(id: int, db: Session= Depends(get_db_session), user = Depends(user_in_role)):
    
    if id>0:
        return db.query(BookingDatesModel).filter(BookingDatesModel.status!=BookingStatusEnum.CANCELLED,BookingDatesModel.interpreter_id==id).all()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Booking date does not exist.")



@router.get('', status_code=status.HTTP_200_OK, response_model=List[BookingResponseSchema])
def get_All_Bookings(locationId: int = 0, db: Session= Depends(get_db_session), user = Depends(user_in_role)):
    
    bookings = db.query(BookingModel).join(BookingDatesModel)

    if locationId>0:
        bookings = bookings.filter(BookingDatesModel.location_id==locationId)
  
    return bookings.all()


@router.post('', status_code=status.HTTP_200_OK)
def create_Booking(request: BookingRequestSchema, db: Session= Depends(get_db_session), user = Depends(user_in_role)):
    
    return create_booking_in_db(request, db, user['username'])


@router.put('/{id}', status_code=status.HTTP_200_OK)
def modify_Booking(id: int, request: BookingRequestSchema, db: Session= Depends(get_db_session), user = Depends(user_in_role)):
    
    return update_booking_in_db(id, request, db, user['username'])


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Booking(id: int, db: Session= Depends(get_db_session), user = Depends(admin_user)):
    
    booking = db.query(BookingModel).filter(BookingModel.id==id)    
    booking.delete(synchronize_session=False)
    db.commit()      
    return 'Booking deleted.'


