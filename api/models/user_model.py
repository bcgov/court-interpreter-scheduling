from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

class UserModel(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True) 
    last_login =   Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    username =     Column(String, unique=False, index=True,  nullable=False)
    first_name =   Column(String, unique=False, index=False, nullable=True)
    last_name =    Column(String, unique=False, index=False, nullable=True)
    email =        Column(String, unique=False, index=False, nullable=True)
    is_staff =     Column(Boolean,unique=False, index=False, nullable=False, default=False)     
    date_joined =  Column(DateTime(timezone=True), server_default=func.now(), nullable=False)    
    authorization_id =   Column(String, unique=False, index=False, nullable=True)
    display_name = Column(String, unique=False, index=False, nullable=True)
    user_role = Column(String, unique=False, index=True,  nullable=True)

    oidcuser = relationship("OidcUserModel", back_populates="user")