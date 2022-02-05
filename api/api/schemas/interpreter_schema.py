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
    crc_comment: Optional[str] =''
    site_code: Optional[str] =None
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
    created_at: Optional[datetime]
    
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

class DatesSchema(BaseModel):
    arrivalTime: Optional[str]
    date: Optional[datetime]
    period: Optional[str]


class InterpreterSearchRequestSchema(BaseModel):    
    language:  Optional[str]
    level: Optional[List[str]]
    city: Optional[str]
    dates: Optional[List[DatesSchema]]
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

class InterpreterRequestSchema(BaseModel):    

    last_name: Optional[str] = Field(alias="lastName")
    first_name: Optional[str] = Field(alias="firstName")

    address: Optional[str]
    city: Optional[str]
    province: Optional[str] = "BC"
    postal_code: Optional[str] = Field(alias="postal")
    
    home_phone: Optional[str] = Field(alias="homePhone")
    business_phone: Optional[str] = Field(alias="businessPhone")
    cell_phone: Optional[str] = Field(alias="phone")
    fax: Optional[str] = None    
    email: Optional[str] =''

    supplier_no: Optional[str] = Field(alias="supplier")
    gst_no: Optional[str] = Field(alias="gst")
    site_code: Optional[str] =None

    crc_check_date: Optional[datetime] = Field(alias="criminalRecordCheckDate")
    
    contract_valid: Optional[bool] = Field(None, alias="contractExtension")
    completed_training: Optional[bool] = False    

    languages: Optional[List[InterpreterLanguageSchema]] = []

    admin_comment: Optional[str] = Field("", alias="adminComments")
    comments: Optional[str] = None
    crc_comment: Optional[str] = Field(None, alias="criminalRecordCheck")
    contract_comment: Optional[str] = None
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True


class InterpreterBookingResponseSchema(BaseModel):
    id: Optional[int] 
    last_name: Optional[str] = Field(alias="lastName")
    first_name: Optional[str] = Field(alias="firstName")
    cell_phone: Optional[str] = Field(alias="phone")
    email: Optional[str]
    languages: Optional[List[InterpreterLanguageSchema]] = []
    

    class Config():
        orm_mode = True
        allow_population_by_field_name = True