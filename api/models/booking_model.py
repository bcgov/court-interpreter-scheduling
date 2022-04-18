from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ENUM
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship
from models.booking_enums import BookingPeriodEnum, BookingStatusEnum, BookingRequestedByEnum, BookingInterpretForEnum, BookingMethodOfAppearanceEnum


class BookingModel(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, index=True)

    created_at =   Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, unique=False, index=False, nullable=True)

    scheduling_clerk = Column(String, unique=False, index=False, nullable=True)
    clerk_phone = Column(String, unique=False, index=False, nullable=True)

    interpreter_id = Column(Integer, ForeignKey('interpreter.id'))
    interpreter = relationship("InterpreterModel", back_populates="booking")

    dates = relationship("BookingDatesModel", back_populates="booking")
     

class BookingDatesModel(Base):
    __tablename__ = 'booking_dates'

    id = Column(Integer, primary_key=True, index=True)
    
    date = Column(DateTime(timezone=True), nullable=False)
    start_time = Column(String, unique=False, index=False, nullable=True)
    finish_time = Column(String, unique=False, index=False, nullable=True)
    
    actual_start_time = Column(String, unique=False, index=False, nullable=True)
    actual_finish_time = Column(String, unique=False, index=False, nullable=True)
    approvers_initials = Column(String, unique=False, index=False, nullable=True)

    cancellation_reason = Column(String, unique=False, index=False, nullable=True)
    cancellation_comment = Column(String, unique=False, index=False, nullable=True)
    cancellation_date = Column(DateTime(timezone=True), nullable=True)
    cancellation_time = Column(String, unique=False, index=False, nullable=True)
    cancellation_fee = Column(String, unique=False, index=False, nullable=True)

    case_name = Column(String, unique=False, index=False, nullable=True)
    comment = Column(String, unique=False, index=False, nullable=True)
    
    prosecutor = Column(String, unique=False, index=False, nullable=True)
    reason = Column(String, unique=False, index=False, nullable=True)
    registry = Column(String, unique=False, index=False, nullable=True)
    
    room = Column(String, unique=False, index=False, nullable=True)
    file = Column(String, unique=False, index=False, nullable=True)
        
    federal = Column(Boolean, nullable=False, default=False)    
    languages = Column(String, unique=False, index=False, nullable=True)

    court_class = Column(String, unique=False, index=False, nullable=True)     

    location_id = Column(Integer, unique=False)
    
    method_of_appearance = Column(
        ENUM(BookingMethodOfAppearanceEnum, name='booking_method_of_appearance', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingMethodOfAppearanceEnum.IN_PERSON.value,
        server_default=BookingMethodOfAppearanceEnum.IN_PERSON.value
    )

    requested_by = Column(
        ENUM(BookingRequestedByEnum, name='booking_requested_by', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingRequestedByEnum.COURT.value,
        server_default=BookingRequestedByEnum.COURT.value
    )

    status = Column(
        ENUM(BookingStatusEnum, name='booking_status', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingStatusEnum.PENDING.value,
        server_default=BookingStatusEnum.PENDING.value
    )
    
    interpreter_id =Column(Integer, nullable=True)

    booking_id = Column(Integer, ForeignKey('booking.id', ondelete="CASCADE"))
    booking = relationship("BookingModel", back_populates="dates")
