import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .role_schema import RoleSchema
from api.schemas.location_schema import LocationSchema, LocationShortSchema

class UserSchema(BaseModel):
    authorization_id: str = Field(alias="user_id")
    first_name: Optional[str] 
    last_name: Optional[str]
    display_name: Optional[str]   
    last_login: datetime.datetime    
    email: str    
    role: List[RoleSchema] = []
    location: Optional[LocationSchema]

    class Config():
        orm_mode = True
        allow_population_by_field_name = True
    
    
class UserSchemaRequest(BaseModel):
   
    locationId: Optional[int] = None  

class UserAllSchema(BaseModel):
    id: int
    first_name: Optional[str] 
    last_name: Optional[str]
    display_name: Optional[str]           
    email: str    
    role: List[RoleSchema] = []
    location: Optional[LocationShortSchema]

    class Config():
        orm_mode = True
        allow_population_by_field_name = True