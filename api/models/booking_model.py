from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Boolean, Float
from sqlalchemy.dialects.postgresql import ENUM
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship
from models.booking_enums import BookingStatusEnum, BookingRequestedByEnum, BookingInterpretForEnum, BookingMethodOfAppearanceEnum
from models.pdf_model import PdfModel

class BookingModel(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, index=True)

    created_at =   Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, unique=False, index=False, nullable=True)

    scheduling_clerk = Column(String, unique=False, index=False, nullable=True)
    clerk_phone = Column(String, unique=False, index=False, nullable=True)

    records_approved = Column(Boolean, nullable=True, default=False)
    approver_name = Column(String, unique=False, index=False, nullable=True)
    interpreter_signed = Column(Boolean, nullable=True, default=False)    
    interpreter_signdate = Column(String, unique=False, index=False, nullable=True)
    qr_signed = Column(Boolean, nullable=True, default=False)    
    qr_signdate = Column(String, unique=False, index=False, nullable=True)
    fees_gst = Column(Float, unique=False, index=False, nullable=True)
    fees_total = Column(Float, unique=False, index=False, nullable=True)
    expense_gst = Column(Float, unique=False, index=False, nullable=True)
    expense_total = Column(Float, unique=False, index=False, nullable=True)
    invoice_total = Column(Float, unique=False, index=False, nullable=True)
    invoice_date = Column(String, unique=False, index=False, nullable=True)
    invoice_number = Column(String, unique=False, index=False, nullable=True)
    adm_detail = Column(String, unique=False, index=False, nullable=True)
    adm_updated_by = Column(String, unique=False, index=False, nullable=True)

    form_sender = Column(String, unique=False, index=False, nullable=True)
    form_sender_email = Column(String, unique=False, index=False, nullable=True)
    form_recipient_email = Column(String, unique=False, index=False, nullable=True)
    form_sent_date = Column(DateTime(timezone=True), nullable=True)

    invoice_sender = Column(String, unique=False, index=False, nullable=True)
    invoice_sender_email = Column(String, unique=False, index=False, nullable=True)
    invoice_recipient_email = Column(String, unique=False, index=False, nullable=True)
    invoice_sent_date = Column(DateTime(timezone=True), nullable=True)

    interpreter_id = Column(Integer, ForeignKey('interpreter.id'))
    interpreter = relationship("InterpreterModel", back_populates="booking")

    dates = relationship("BookingDatesModel", back_populates="booking")

    pdf = relationship("PdfModel", back_populates="booking")

    location_id = Column(Integer, ForeignKey('court_location.id'))
    location_name = Column(String, unique=False, index=False, nullable=True)
    location = relationship("CourtLocationModel", back_populates="booking")

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
    
    comment = Column(String, unique=False, index=False, nullable=True)    
    
    method_of_appearance = Column(
        ENUM(BookingMethodOfAppearanceEnum, name='booking_method_of_appearance', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingMethodOfAppearanceEnum.IN_PERSON.value,
        server_default=BookingMethodOfAppearanceEnum.IN_PERSON.value
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

    cases = relationship("BookingCasesModel", back_populates="booking_date")


class BookingCasesModel(Base):
    __tablename__ = 'booking_cases'

    id = Column(Integer, primary_key=True, index=True)
    
    file = Column(String, unique=False, index=False, nullable=True)
    case_name = Column(String, unique=False, index=False, nullable=True)    
    room = Column(String, unique=False, index=False, nullable=True)

    case_type = Column(String, unique=False, index=False, nullable=True)
    court_level = Column(String, unique=False, index=False, nullable=True)
    court_class = Column(String, unique=False, index=False, nullable=True) 
    court_class_other = Column(String, unique=False, index=False, nullable=True)

    reason = Column(String, unique=False, index=False, nullable=True)
    reason_other = Column(String, unique=False, index=False, nullable=True)
    

    interpret_for = Column(String, unique=False, index=False, nullable=True)
    
    remote_registry = Column(String, unique=False, index=False, nullable=True)
    remote_location_id = Column(Integer, unique=False)

    van_registry = Column(String, unique=False, index=False, nullable=True)
    van_location_id = Column(Integer, unique=False)
                
    federal = Column(Boolean, nullable=False, default=False)    
    prosecutor = Column(String, unique=False, index=False, nullable=True)    
    bilingual = Column(Boolean, default=False, index=False, nullable=True)
    interpretation_mode = Column(String, unique=False, index=False, nullable=True)
       
    
    method_of_appearance = Column(
        ENUM(BookingMethodOfAppearanceEnum, name='booking_method_of_appearance', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingMethodOfAppearanceEnum.IN_PERSON.value,
        server_default=BookingMethodOfAppearanceEnum.IN_PERSON.value
    )

    requested_by = Column(
        ENUM(BookingRequestedByEnum, create_type=False, name='booking_requested_by', values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=BookingRequestedByEnum.COURT.value,
        server_default=BookingRequestedByEnum.COURT.value
    )

    interpreter_language_id = Column(Integer, ForeignKey('interpreter_language.id', ondelete="CASCADE"))
    language = relationship("InterpreterLanguageModel")

    booking_date_id = Column(Integer, ForeignKey('booking_dates.id', ondelete="CASCADE")) 
    booking_date = relationship("BookingDatesModel", back_populates="cases")
