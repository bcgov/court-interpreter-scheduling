from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from typing import List

class RateSchema(BaseModel):
    
    id: Optional[int]    
    name: Optional[str]
    value: Optional[float]
    previous_value: Optional[float] = Field(None, alias="previousValue")
    value_changed_date: Optional[datetime] = Field(None, alias="valueChangedDate")
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True


class RateResponseSchema(RateSchema):
    pass
    # previous_value: Optional[float] = Field(None, alias="previousValue")
    # value_changed_date: Optional[datetime] = Field(None, alias="valueChangedDate")
    