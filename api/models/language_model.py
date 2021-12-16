from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from core.multi_database_middleware import DeclarativeBase as Base
from sqlalchemy.orm import relationship



class InterpreterLanguage(Base):
    __tablename__ = 'interpreter_language'
    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey('language.id'))
    interpreter_id = Column(Integer, ForeignKey('interpreter.id'))



class LanguageModel(Base):
    __tablename__ = "language"

    id = Column(Integer, primary_key=True, index=True)
    name =  Column(String, unique=True, index=True)    
    created_at =   Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)      
    updated_at =  Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    interpreters = relationship('InterpreterModel', secondary='interpreter_language', backref='language')
    