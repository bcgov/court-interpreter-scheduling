from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from api.schemas.interpreter_schema import InterpreterBase
from api.schemas.location_schema import CourtDistanceSchema, LocationSchema
from api.schemas.booking_schema import BookingSearchResponseSchema



class DatesSchema(BaseModel):
    arrivalTime: Optional[str]
    date: Optional[datetime]
    period: Optional[str]


class CrcDateRangeSchema(BaseModel):
    endDate: Optional[str]
    startDate: Optional[str]


class InterpreterSearchRequestSchema(BaseModel):    
    languageId:  Optional[int]
    level: Optional[List[str]]
    city: Optional[str]
    dates: Optional[List[DatesSchema]]
    name: Optional[str]
    keywords: Optional[str]
    active: Optional[bool]
    criminalRecordCheck: Optional[CrcDateRangeSchema]
    courtAddr: Optional[str]
    distanceLimit: Optional[bool]
    location: Optional[LocationSchema]
    limit: Optional[int]
    page: Optional[int]



class InterpreterSearchResponseSchema(InterpreterBase):    
    id: int     
    events: Optional[List] = []
    booking: Optional[List[BookingSearchResponseSchema]] = []
    created_at: Optional[datetime]
    court: Optional[CourtDistanceSchema]
    court_distance: Optional[int] = Field(alias="courtDistance")    


class InterpreterDataInExcelRequestSchema(BaseModel):
    ids: List[int]

