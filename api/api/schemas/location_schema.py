from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LocationSchema(BaseModel):    

    id: int    
    name: str
    location_code: str = Field(alias="locationCode")
    address_line1: Optional[str] = Field(alias="addressLine1")
    address_line2: Optional[str] = Field("", alias="addressLine2")
    city: str
    postal_code: Optional[str] = Field(alias="postalCode")
    created_at: datetime = Field(alias="createdAt")  
    updated_at: datetime = Field(alias="updatedAt")
    short_description: str = Field(alias="shortDescription")        
    latitude: float
    longitude: float
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True
