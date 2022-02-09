import datetime
from typing import Optional
from pydantic import BaseModel, Field
from typing import List

class RoleSchema(BaseModel):
    
    id: int    
    role_name: str
    
    class Config():
        orm_mode = True


class RoleSchemaRequest(BaseModel):
   
    role_name: str


class UserRoleSchemaRequest(BaseModel):
   
    user_id: int
    roles: List[int]    
    

class RoleRequestAccessSchema(BaseModel):   
    message: str