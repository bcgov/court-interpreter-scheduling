from typing import List

from fastapi import APIRouter, status, HTTPException, Depends, Request
from api.schemas.booking_schema import AuditBookingDateSchema, AuditMultipleSessionBooking
from api.repository.booking_audit import check_same_dates_in_multiple_booking_same_location, check_same_dates_in_multiple_booking_diff_location, multiple_session_booking_overpaid
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from core.auth import admin_user




router = APIRouter(
    prefix="/audit",
    tags=['Audit']
)


@router.get('/same-date-booking', status_code=status.HTTP_200_OK, response_model=List[AuditBookingDateSchema])
def get_Same_Date_Multiple_Booking( db: Session= Depends(get_db_session) , user = Depends(admin_user)):
    return check_same_dates_in_multiple_booking_same_location(db)

@router.get('/same-date-booking-diff-locations', status_code=status.HTTP_200_OK, response_model=List[AuditBookingDateSchema])
def get_Same_Date_Multiple_Booking( db: Session= Depends(get_db_session) , user = Depends(admin_user)):
    return check_same_dates_in_multiple_booking_diff_location(db)

@router.get('/multiple-session-booking-overpaid', status_code=status.HTTP_200_OK , response_model=List[AuditMultipleSessionBooking])
def  get_multiple_session_booking_overpaid( db: Session= Depends(get_db_session), user = Depends(admin_user)):
    return multiple_session_booking_overpaid(db)