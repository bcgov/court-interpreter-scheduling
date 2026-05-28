from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from api.schemas.language_schema import InterpreterLanguageSchema
from api.schemas.custom_type import JsonBase
from api.schemas.location_schema import CourtDistanceSchema


#__________________________________________
#__________________________________________
class InterpreterBase(BaseModel):

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
    site_code: Optional[str] = Field(default=None, alias="siteCode")
    
    contract_valid: Optional[bool] = Field(None, alias="contractExtension")
      
    languages: Optional[List[InterpreterLanguageSchema]] = []

    comments: Optional[str] = None
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True
#__________________________________________
#__________________________________________

class InterpreterCreateModifyRequestSchema(InterpreterBase):
    crc_check_date: Optional[datetime] = Field(alias="criminalRecordCheckDate")
    completed_training: Optional[bool] = False
    admin_comment: Optional[str] = Field("", alias="adminComments")
    crc_comment: Optional[str] = Field(None, alias="criminalRecordCheckComment")
    contract_comment: Optional[str] = None



class InterpreterGetAdminResponseSchema(InterpreterCreateModifyRequestSchema):
    id: int     
    events: Optional[List] = []
    booking: Optional[List] = []
    created_at: Optional[datetime]



# payload_in_page_directory = criminalRecordCheck":"2021-12-25T03:39:00.000Z"} "Time is back utc. selected 2021-12-24T19:39Vancouver"




class InterpreterBookingResponseSchema(BaseModel):
    id: Optional[int] 
    last_name: Optional[str] = Field(alias="lastName")
    first_name: Optional[str] = Field(alias="firstName")
    cell_phone: Optional[str] = Field(alias="phone")
    email: Optional[str]
    languages: Optional[List[InterpreterLanguageSchema]] = []
    language_history: Optional[JsonBase] = Field(alias="languageHistory")
    courts: Optional[List[CourtDistanceSchema]]
    address: Optional[str]
    city: Optional[str]
    province: Optional[str] = "BC"
    postal_code: Optional[str] = Field(alias="postal")

    class Config():
        orm_mode = True
        allow_population_by_field_name = True


class InterpreterADMBookingResponseSchema(InterpreterBookingResponseSchema):
    supplier_no: Optional[str] = Field(alias="supplier")
    gst_no: Optional[str] = Field(alias="gst")
    site_code: Optional[str] = Field(alias="siteCode")
    address_longitude : Optional[float] = Field(alias="addressLongitude")
    address_latitude : Optional[float] = Field(alias="addressLatitude")


class InterpreterGeoStatusSchema(BaseModel):
    id: int
    update_started = False
    last_name: Optional[str] = Field(alias="lastName")
    first_name: Optional[str] = Field(alias="firstName")

    address: Optional[str]
    city: Optional[str]
    province: Optional[str] = "BC"
    postal_code: Optional[str] = Field(alias="postal")

    updated_at: Optional[datetime]
    contract_valid: Optional[bool] = Field(None, alias="contractExtension")
    geo_service: Optional[str]

    class Config():
        orm_mode = True
        allow_population_by_field_name = True

class InterpreterBookingResponseShortSchema(BaseModel):
    id: Optional[int] 
    last_name: Optional[str] = Field(alias="lastName")
    first_name: Optional[str] = Field(alias="firstName")
    class Config():
        orm_mode = True
        allow_population_by_field_name = True