from sqlalchemy import Column, Integer, String, DateTime, func, Float
from core.multi_database_middleware import DeclarativeBase as Base

    

class CourtLocationModel(Base):
    __tablename__ = "court_location"

    id = Column(Integer, primary_key=True, index=True)
    name =  Column(String, unique=True, index=True)    
    created_at =   Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    short_description = Column(String, unique=False, index=False, nullable=True)
    location_code = Column(String, unique=False, index=False, nullable=True)
    city = Column(String, unique=False, index=False, nullable=True)
    address_line1 = Column(String, unique=False, index=False, nullable=True)
    address_line2 = Column(String, unique=False, index=False, nullable=True)
    postal_code = Column(String, unique=False, index=False, nullable=True)
    province = Column(String, unique=False, index=False, nullable=True)
    latitude = Column(Float, unique=False, index=False, nullable=True)
    longitude = Column(Float, unique=False, index=False, nullable=True)
