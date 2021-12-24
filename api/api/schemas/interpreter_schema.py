from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from api.schemas.language_schema import InterpreterLanguageSchema

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
 
    
    