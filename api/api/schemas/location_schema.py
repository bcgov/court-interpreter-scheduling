from pydantic import BaseModel, Field

class LocationSchema(BaseModel):    
    longDesc: str  = Field(alias="name")
    shortDesc: str = Field(alias="id")
    code: str = Field(alias="locationCode")
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True

    
    