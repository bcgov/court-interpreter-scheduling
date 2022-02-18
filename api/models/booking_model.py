from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ENUM
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship
from models.booking_enums import BookingPeriodEnum, BookingStatusEnum, BookingRequestedByEnum, BookingInterpretForEnum, BookingMethodOfAppearanceEnum


class BookingModel(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, index=True)
    name =  Column(String, unique=True, index=True)    
    created_at =   Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, unique=False, index=False, nullable=True)

    case_name = Column(String, unique=False, index=False, nullable=True)
    comment = Column(String, unique=False, index=False, nullable=True)
    
    prosecutor = Column(String, unique=False, index=False, nullable=True)
    reason = Column(String, unique=False, index=False, nullable=True)
    registry = Column(String, unique=False, index=False, nullable=True)
    
    room = Column(String, unique=False, index=False, nullable=True)
    file = Column(String, unique=False, index=False, nullable=True)
        
    federal = Column(Boolean, nullable=False, default=False)    
    language_name = Column(String, unique=False, index=False, nullable=True)    
    location_id = Column(Integer, unique=False)

    interpret_for = Column(
        ENUM(BookingInterpretForEnum, name='booking_interpret_for', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingInterpretForEnum.WITNESS.value,
        server_default=BookingInterpretForEnum.WITNESS.value
    )
    
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

    interpreter_id = Column(Integer, ForeignKey('interpreter.id'))
    interpreter = relationship("InterpreterModel", back_populates="booking")

    dates = relationship("BookingDatesModel", back_populates="booking")
     

class BookingDatesModel(Base):
    __tablename__ = 'booking_dates'

    id = Column(Integer, primary_key=True, index=True)
    
    date = Column(DateTime(timezone=True), nullable=False)
    arrivalTime = Column(String, unique=False, index=False, nullable=True)

    period = Column(
        ENUM(BookingPeriodEnum, name='booking_period', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingPeriodEnum.WHOLE_DAY.value,
        server_default=BookingPeriodEnum.WHOLE_DAY.value
    )
    
    interpreter_id =Column(Integer, nullable=True)

    booking_id = Column(Integer, ForeignKey('booking.id', ondelete="CASCADE"))
    booking = relationship("BookingModel", back_populates="dates")
