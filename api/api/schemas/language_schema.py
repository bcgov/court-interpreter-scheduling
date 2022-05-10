
from typing import Optional
from pydantic import BaseModel, Field


class LanguageSchemaRequest(BaseModel):
    id: Optional[int] = None
    name: str   


class LanguageSchema(BaseModel):
   
    id: int
    name: str   
    
    class Config():
        orm_mode = True


class InterpreterLanguageSchema(BaseModel):
    
    language_id: int = Field(alias="languageId")
    level: int
    language: str = Field(alias="languageName")
    comment_on_level: Optional[str] = Field("", alias="commentOnLevel")
       
    class Config():
        orm_mode = True
        allow_population_by_field_name = True