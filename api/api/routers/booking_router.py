from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import BookingRequestSchema, BookingResponsePageSchema, BookingSearchRequestSchema
from models.booking_model import BookingModel
from core.auth import logged_in_user
from api.repository.booking_transactions import create_booking_in_db, update_booking_in_db
from api.repository.search_booking_transactions import search_Booking

router = APIRouter(
    prefix="/booking",
    tags=['Booking']
)

@router.post('/search', status_code=status.HTTP_200_OK, response_model=BookingResponsePageSchema)
def search_Interpreters(request: BookingSearchRequestSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    return BookingResponsePageSchema(data = search_Booking(request, db), pagination = {"page":1, "limit":1000})


@router.get('', status_code=status.HTTP_200_OK, response_model=BookingResponsePageSchema)
def get_All_Bookings(locationId: int = 0, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    bookings = db.query(BookingModel)

    if locationId>0:
        bookings = bookings.filter(BookingModel.location_id==locationId)
  
    return BookingResponsePageSchema(data = bookings.all(), pagination = {"page":1, "limit":1000})


@router.post('', status_code=status.HTTP_200_OK)
def create_Booking(request: BookingRequestSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    return create_booking_in_db(request, db, user['username'])


@router.put('/{id}', status_code=status.HTTP_200_OK)
def modify_Booking(id: int, request: BookingRequestSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    return update_booking_in_db(id, request, db, user['username'])


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Booking(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    booking = db.query(BookingModel).filter(BookingModel.id==id)    
    booking.delete(synchronize_session=False)
    db.commit()      
    return 'Booking deleted.'

