from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship



class InterpreterLanguageModel(Base):
    __tablename__ = 'interpreter_language'
    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey('language.id', ondelete="CASCADE"))
    interpreter_id = Column(Integer, ForeignKey('interpreter.id', ondelete="CASCADE"))

    level = Column(String, unique=False) 
    language = Column(String, unique=False)
    comment_on_level = Column(String, unique=False)

    # language_relation = relationship("LanguageModel", back_populates="interpreters")
    interpreter_relation = relationship("InterpreterModel", overlaps="language", back_populates="languages")
    

class LanguageModel(Base):
    __tablename__ = "language"

    id = Column(Integer, primary_key=True, index=True)
    name =  Column(String, unique=True, index=True)    
    created_at =   Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    #interpreters = relationship("InterpreterLanguageModel", back_populates="language_relation")
    interpreters = relationship('InterpreterModel',overlaps="interpreter_relation", cascade='all,delete', secondary='interpreter_language', backref='language')
    