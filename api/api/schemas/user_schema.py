import datetime
from typing import Optional
from pydantic import BaseModel, Field

class UserSchema(BaseModel):
    authorization_id: str = Field(alias="user_id")
    first_name: str 
    last_name: str
    display_name: str   
    last_login: datetime.datetime    
    email: str    
    universal_id: Optional[str] = None
    idir_userid: Optional[str] = None
    class Config():
        orm_mode = True
        allow_population_by_field_name = True
    
    
    