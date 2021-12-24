
from typing import Optional
from pydantic import BaseModel, Field


class LanguageSchema(BaseModel):
   
    id: int
    name: str   
    
    class Config():
        orm_mode = True


class InterpreterLanguageSchema(BaseModel):
   
    level: int
    language: str = Field(alias="languageName")
    comment_on_level: Optional[str] = Field("", alias="commentOnLevel")
       
    class Config():
        orm_mode = True
        allow_population_by_field_name = True