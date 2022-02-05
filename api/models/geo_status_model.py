
from sqlalchemy import Column, Integer, String, DateTime, func
from core.multi_database_middleware import DeclarativeBase as Base



class GeoStatusModel(Base):
    __tablename__ = "geo_status"
    
    id = Column(Integer, primary_key=True, index=True)    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)            
    next_update_at = Column(DateTime(timezone=True), nullable=True)
    update_schedule = Column(String, unique=False, index=False, nullable=True)
    
    name = Column(String, unique=False, index=False, nullable=True)
    description = Column(String, unique=False, index=False, nullable=True)
    update_service = Column(String, unique=False, index=False, nullable=True)           
    progress = Column(Integer, unique=False, index=False, nullable=True)