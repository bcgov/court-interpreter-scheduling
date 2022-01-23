from sqlalchemy import Column, Integer, String, DateTime, func, Float, Boolean
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship

class InterpreterModel(Base):
    __tablename__ = "interpreter"

    id = Column(Integer, primary_key=True, index=True)
    created_at =   Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by =  Column(String, unique=False, index=False, nullable=True)
  
    last_name = Column(String, unique=False, index=False, nullable=True)
    first_name = Column(String, unique=False, index=False, nullable=True)
    address = Column(String, unique=False, index=False, nullable=True)
    city = Column(String, unique=False, index=False, nullable=True)
    province = Column(String, unique=False, index=False, nullable=True)
    postal_code = Column(String, unique=False, index=False, nullable=True)
    home_phone = Column(String, unique=False, index=False, nullable=True)
    business_phone = Column(String, unique=False, index=False, nullable=True)
    cell_phone= Column(String, unique=False, index=False, nullable=True)
    email = Column(String, unique=False, index=False, nullable=True)
    supplier_no = Column(String, unique=False, index=False, nullable=True)
    gst_no = Column(String, unique=False, index=False, nullable=True)
    comments = Column(String, unique=False, index=False, nullable=True)
    crc_check_date = Column(DateTime(timezone=True), unique=False, nullable=True)
    crc_comment = Column(String, unique=False, index=False, nullable=True)
    contract_valid = Column(Boolean, nullable=False, default=False)
    contract_comment = Column(String, unique=False, index=False, nullable=True)

    completed_training = Column(Boolean, nullable=False, default=False)
    fax= Column(String, unique=False, index=False, nullable=True)

    site_code = Column(String, unique=False, index=False, nullable=True)

    admin_comment = Column(String, unique=False, index=False, nullable=True)
    address_longitude = Column(Float, unique=False, index=False, nullable=True) 
    address_latitude = Column(Float, unique=False, index=False, nullable=True)
    geo_service = Column(String, unique=False, index=False, nullable=True)

    disabled = Column(Boolean, nullable=False, default=False)

    # languages = relationship('LanguageModel', cascade = 'all,delete', secondary='interpreter_language', backref='interpreter')
    languages = relationship("InterpreterLanguageModel",overlaps="interpreters, language", back_populates="interpreter_relation")

    booking = relationship ("BookingModel", back_populates="interpreter")
       