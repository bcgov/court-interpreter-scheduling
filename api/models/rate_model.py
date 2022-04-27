from sqlalchemy import Column, Integer, String, DateTime, func, Float
from core.multi_database_middleware import DeclarativeBase as Base
    

class RateModel(Base):
    __tablename__ = "rate"

    id = Column(Integer, primary_key=True, index=True)
 
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by =  Column(String, unique=False, index=False, nullable=True)

    name = Column(String, unique=False, index=False, nullable=True)
    value = Column(Float, unique=False, index=False, nullable=True)

    previous_value = Column(Float, unique=False, index=False, nullable=True)
    value_changed_date = Column(DateTime(timezone=True), nullable=True)

    
