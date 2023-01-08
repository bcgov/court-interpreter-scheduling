from sqlalchemy import Column, Integer, String, DateTime, func, Float, ForeignKey
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship
    

class CourtLocationModel(Base):
    __tablename__ = "court_location"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=False)    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)      
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    short_description = Column(String, unique=False, index=False, nullable=True)
    location_code = Column(String, unique=False, index=False, nullable=True)
    city = Column(String, unique=False, index=False, nullable=True)
    address_line1 = Column(String, unique=False, index=False, nullable=True)
    address_line2 = Column(String, unique=False, index=False, nullable=True)
    postal_code = Column(String, unique=False, index=False, nullable=True)
    province = Column(String, unique=False, index=False, nullable=True)
    latitude = Column(Float, unique=False, index=False, nullable=True)
    longitude = Column(Float, unique=False, index=False, nullable=True)
    geo_service = Column(String, unique=False, index=False, nullable=True)
        
    user = relationship ("UserModel", back_populates="location")



class CourtDistanceModel(Base):
    __tablename__ = 'court_distance'

    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, ForeignKey('court_location.id', ondelete="CASCADE"))
    interpreter_id = Column(Integer, ForeignKey('interpreter.id', ondelete="CASCADE"))

    court_code = Column(String, unique=False)

    court_address = Column(String, unique=False)
    interpreter_address = Column(String, unique=False)
    
    
    distance = Column(Integer, unique=False) 
    duration = Column(Integer, unique=False)
    court_latitude = Column(Float, unique=False)
    court_longitude = Column(Float, unique=False)
    interpreter_latitude = Column(Float, unique=False)
    interpreter_longitude = Column(Float, unique=False)
    

    # court_relation = relationship("CourtLocationModel", back_populates="interpreters")
    interpreter_relation = relationship("InterpreterModel", overlaps="court_location", back_populates="courts")
    

class CourtDistanceBackupModel(Base):
    __tablename__ = 'court_distance_backup'

    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, unique=False)
    interpreter_id = Column(Integer, unique=False)

    court_code = Column(String, unique=False)

    court_address = Column(String, unique=False)
    interpreter_address = Column(String, unique=False)
    
    
    distance = Column(Integer, unique=False) 
    duration = Column(Integer, unique=False)
    court_latitude = Column(Float, unique=False)
    court_longitude = Column(Float, unique=False)
    interpreter_latitude = Column(Float, unique=False)
    interpreter_longitude = Column(Float, unique=False)