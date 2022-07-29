from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, func, Boolean, Float, LargeBinary
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship



class PdfModel(Base):
    __tablename__ = "pdf_prints"

    id = Column(Integer, primary_key=True, index=True)
    created_at =  Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, unique=False, index=False, nullable=True)

    data = Column(LargeBinary(length=5e5),  unique=False, index=False, nullable=True)
    key = Column(String, unique=False, index=False, nullable=True)
    pdf_type = Column(String, unique=False, index=False, nullable=True)
    
    booking_id = Column(Integer, ForeignKey('booking.id', ondelete="CASCADE"))
    booking = relationship("BookingModel", back_populates="pdf")
    