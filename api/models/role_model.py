from uuid import uuid4
from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID



class UserRoleModel(Base):
    __tablename__ = 'user_role'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('user.id', ondelete="CASCADE"))
    role_id = Column(Integer, ForeignKey('role.id', ondelete="CASCADE"))
   
    # language_relation = relationship("LanguageModel", back_populates="interpreters")
    # interpreter_relation = relationship("InterpreterModel", overlaps="language", back_populates="languages")
    


class RoleModel(Base):
    __tablename__ = "role"
    
    id = Column(Integer, primary_key=True, index=True)    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    role_name = Column(String, unique=True, index=True, nullable=False)

    user = relationship("UserModel", secondary='user_role', back_populates="role")
