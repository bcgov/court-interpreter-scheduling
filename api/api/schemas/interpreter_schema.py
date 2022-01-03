from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from api.schemas.language_schema import InterpreterLanguageSchema
from api.schemas.location_schema import LocationSchema

class InterpreterSchema(BaseModel):
    
    id: int    
    last_name: str = Field(alias="lastName")
    first_name: str = Field(alias="firstName")
    address: str
    city: str
    province: str
    postal_code: str = Field(alias="postal")
    home_phone: Optional[str] = Field(alias="homePhone")
    business_phone: Optional[str] = Field(alias="businessPhone")
    cell_phone: Optional[str] = Field(alias="phone")
    email: str
    supplier_no: Optional[str] = Field(alias="supplier")
    gst_no: Optional[str] = Field(alias="gst")
    comments: Optional[str] =''
    crc_check_date: Optional[datetime] = Field(alias="criminalRecordCheckDate")
    # crc_comment: Optional[str] =''
    contract_valid: bool= Field(alias="contractExtension")
    # contract_comment: Optional[str] =''

    # completed_training: bool
    # fax: Optional[str] =''

    languages: List[InterpreterLanguageSchema] = []
    events: Optional[List] = []
    bookings: Optional[List] = []

    admin_comment: Optional[str] = Field(alias="adminComments")
    # address_longitude: str
    # address_latitude: str
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True
 
class PageSchema(BaseModel):
    page: int = 1
    limit: int = 1000

class InterpreterResponseSchema(BaseModel):
    data: List[InterpreterSchema]
    pagination: PageSchema
    class Config():
        orm_mode = True

       
class InterpreterRequestSchema(BaseModel):    
    language:  Optional[str]
    level: Optional[List[str]]
    city: Optional[str]
    dates: Optional[List[datetime]]
    name: Optional[str]
    keywords: Optional[str]
    active: Optional[bool]
    criminalRecordCheck: Optional[datetime]
    courtAddr: Optional[str]
    distanceLimit: Optional[bool]
    location: Optional[LocationSchema]
    # file: Optional[str]
    # interpreter: Optional[str]
    # isStartFromToday: Optional[bool]

# payload_in_page_directory = criminalRecordCheck":"2021-12-25T03:39:00.000Z"} "Time is back utc. selected 2021-12-24T19:39Vancouver"
