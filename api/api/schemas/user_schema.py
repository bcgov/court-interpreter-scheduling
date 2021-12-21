import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .role_schema import RoleSchema

class UserSchema(BaseModel):
    authorization_id: str = Field(alias="user_id")
    first_name: str 
    last_name: str
    display_name: str   
    last_login: datetime.datetime    
    email: str    
    role: List[RoleSchema] = []

    class Config():
        orm_mode = True
        allow_population_by_field_name = True
    
    
    