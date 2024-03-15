
import json
from sqlalchemy.orm import Session
from models.booking_model import BookingModel, BookingDatesModel
from models.user_model import UserModel
from models.interpreter_model import InterpreterModel
from models.booking_enums import BookingStatusEnum
from datetime import datetime
from zoneinfo import ZoneInfo


def check_same_dates_in_multiple_booking_same_location(db:Session):

    booking_date_query = db.query(BookingDatesModel).join(BookingModel).filter(
        BookingDatesModel.status==BookingStatusEnum.BOOKED).all()
    
    audited_list = list()
    audited_list_ids = list()
    date_list = dict()
    date_id_list = dict()

    for date in booking_date_query:
        timezone = date.booking.location.timezone
        date_with_tz = date.date.astimezone(ZoneInfo(timezone))
        iso_date = date_with_tz.strftime('%Y-%m-%d')+'-'+str(date.interpreter_id)+'-'+str(date.booking.location_id)

        booking_id = date.booking.id

        if iso_date in date_list:           
            if booking_id not in date_list[iso_date]:
                date_list[iso_date].append(booking_id)                
                date_id_list[iso_date].append(date.id)
                if iso_date not in audited_list:
                    audited_list.append(iso_date)
        else:
            date_list[iso_date] = [booking_id]
            date_id_list[iso_date] = [date.id]
        
        # print(iso_date)
    
    for iso_date in audited_list:
        audited_list_ids = audited_list_ids + date_id_list[iso_date]
        
    # print(json.dumps(date_list, indent=2))
    # print(json.dumps(date_id_list, indent=2))
    # print(audited_list)
    # print(audited_list_ids)

    audited_booking_date_query = db.query(BookingDatesModel).join(BookingModel).filter(
        BookingDatesModel.id.in_(audited_list_ids),
        BookingDatesModel.status==BookingStatusEnum.BOOKED).all()
    
    return audited_booking_date_query


def check_same_dates_in_multiple_booking_diff_location(db:Session):

    booking_date_query = db.query(BookingDatesModel).join(BookingModel).filter(
        BookingDatesModel.status==BookingStatusEnum.BOOKED).all()
    
    audited_list = list()
    audited_list_ids = list()
    date_list = dict()
    date_id_list = dict()

    for date in booking_date_query:
        timezone = date.booking.location.timezone
        date_with_tz = date.date.astimezone(ZoneInfo(timezone))
        iso_date = date_with_tz.strftime('%Y-%m-%d')+'-'+str(date.interpreter_id)

        booking_id = date.booking.id

        if iso_date in date_list:           
            if booking_id not in date_list[iso_date]:
                date_list[iso_date].append(booking_id)                
                date_id_list[iso_date].append(date.id)
                if iso_date not in audited_list:
                    audited_list.append(iso_date)
        else:
            date_list[iso_date] = [booking_id]
            date_id_list[iso_date] = [date.id]
        
        # print(iso_date)
    
    for iso_date in audited_list:
        audited_list_ids = audited_list_ids + date_id_list[iso_date]
        
    # print(json.dumps(date_list, indent=2))
    # print(json.dumps(date_id_list, indent=2))
    # print(audited_list)
    # print(audited_list_ids)

    audited_booking_date_query = db.query(BookingDatesModel).join(BookingModel).filter(
        BookingDatesModel.id.in_(audited_list_ids),
        BookingDatesModel.status==BookingStatusEnum.BOOKED).all()
    
    return audited_booking_date_query


def multiple_session_booking_overpaid(db:Session):

    booking_query = db.query(BookingModel).join(BookingDatesModel).filter(
        BookingModel.adm_audit_flag==True).all()
    
    for booking in booking_query:
        adm_detail = json.loads(booking.adm_detail)
        if ('calculations' in adm_detail and
            'dailyInterpretingHours' in adm_detail['calculations'] and 
            adm_detail['calculations']['dailyInterpretingHours'] is not None
        ):
            booking.adm_detail=json.dumps(adm_detail['calculations']['dailyInterpretingHours'])
            # print(adm_detail['calculations']['dailyInterpretingHours'])
            # print(booking.dates)

    return booking_query

   