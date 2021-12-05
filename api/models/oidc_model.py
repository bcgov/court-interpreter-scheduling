from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship

class OidcUserModel(Base):
    __tablename__ = "oidcuser"

    id = Column(Integer, primary_key=True, index=True)
    sub =  Column(String, unique=True, index=True)    
    userinfo = Column(JSON)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship ("UserModel", back_populates="oidcuser")