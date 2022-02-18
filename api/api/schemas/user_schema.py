import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from api.schemas.role_schema import RoleSchema
from api.schemas.location_schema import LocationSchema, LocationShortSchema

#___________________________
class UserBase(BaseModel):
    
    first_name: Optional[str] 
    last_name: Optional[str]
    display_name: Optional[str]
    email: str    
    role: List[RoleSchema] = []    

    class Config():
        orm_mode = True
        allow_population_by_field_name = True
#___________________________


class UserSchema(UserBase):
    authorization_id: str = Field(alias="user_id")       
    last_login: datetime.datetime 
    location: Optional[LocationSchema]
    
    
class UserSchemaRequest(BaseModel):   
    locationId: Optional[int] = None  


class UserAllSchema(UserBase):
    id: int    
    location: Optional[LocationShortSchema]
