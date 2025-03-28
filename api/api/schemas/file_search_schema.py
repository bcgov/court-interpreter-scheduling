from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel, validator

class CourtLevel(str, Enum):
    P = "Provincial"
    S = "Supreme"
    A = "Court of Appeal"

    @classmethod
    def from_display_name(cls, ui_value: str) -> str:
        for key, value in cls.__members__.items():
            if value.value.lower() == ui_value.lower():
                return key
        return ""

    @classmethod
    def to_display_name(cls, api_value: str) -> str:
        for key, value in cls.__members__.items():
            if key == api_value:
                return value.value
        return ""


class CourtClass(str, Enum):
    A = "Adult"
    Y = "Youth"
    T = "Ticket (Traffic/Bylaw)"
    B = "Bankruptcy and insolvency"
    C = "Small Claims"
    E = "Family Law Proceeding (Divorce Act and Family Law Act)"
    F = "Family"
    D = "Divorce"
    H = "Foreclosure"
    L = "Enforcement Proceedings"
    M = "Motor Vehicle Accidents"
    N = "Adoption"
    O = "Appeal Civil"
    P = "Probate and Administration"
    Q = "Appeal Criminal"
    S = "Supreme Civil (General)"
    V = "Caveat"
    G = "Public Hearings"
    R = "TC"

    @classmethod
    def from_display_name(cls, ui_value: str) -> str:
        for key, value in cls.__members__.items():
            if value.value.lower() == ui_value.lower():
                return key
        return ""

    @classmethod
    def to_display_name(cls, api_value: str) -> str:
        for key, value in cls.__members__.items():
            if key == api_value:
                return value.value
        return ""
    
class FileSearchQueryParams(BaseModel):
    searchMode: Optional[str] = None
    fileHomeAgencyId: Optional[str] = None
    fileNumberTxt: Optional[str] = None
    filePrefixTxt: Optional[str] = None
    filePermissions: Optional[str] = None
    fileSuffixNo: Optional[str] = None
    mdocRefTypeCd: Optional[str] = None
    courtClassCd: Optional[str] = None
    courtLevelCd: Optional[str] = None
    nameSearchTypeCd: Optional[str] = None
    lastNm: Optional[str] = None
    orgNm: Optional[str] = None
    givenNm: Optional[str] = None
    birthDt: Optional[str] = None
    searchByCrownPartId: Optional[str] = None
    searchByCrownActiveOnlyYN: Optional[str] = None
    searchByCrownFileDesignationCd: Optional[str] = None
    mdocJustinNoSet: Optional[str] = None
    physicalFileIdSet: Optional[str] = None

    @validator('courtClassCd', 'courtLevelCd', pre=True, allow_reuse=True)
    def validate_enum(cls, v, field):
        if v is None or v == "":
            return v 
        try:
            if isinstance(v, str):
                if field.name == 'courtClassCd':
                    return CourtClass.from_display_name(v) or v
                if field.name == 'courtLevelCd':
                    return CourtLevel.from_display_name(v) or v
            return v
        except (ValueError, TypeError):
            return v

    class Config:
        orm_mode = True

class FileSearchRequestSchema(BaseModel):
    query: Optional[FileSearchQueryParams]
    location_id: Optional[int]
    date_range: Optional[Dict[str, str]]
    is_criminal: bool = False
    class Config:
        orm_mode = True
        use_enum_values = True

class FileDetail(BaseModel):
    mdocJustinNo: Optional[str] = None
    physicalFileId: Optional[str] = None
    fileHomeAgencyId: Optional[str] = None
    fileNumberTxt: Optional[str] = None
    mdocSeqNo: Optional[str] = None
    ticketSeriesTxt: Optional[str] = None
    mdocRefTypeCd: Optional[str] = None
    courtLevelCd: Optional[str] = None
    courtClassCd: Optional[str] = None
    warrantYN: Optional[str] = None
    inCustodyYN: Optional[str] = None
    nextApprDt: Optional[str] = None
    pcssCourtDivisionCd: Optional[str] = None
    sealStatusCd: Optional[str] = None
    approvalCrownAgencyTypeCd: Optional[str] = None
    participant: List[Dict]

class FileSearchResponseSchema(BaseModel):
    responseCd: Optional[str] = None
    responseMessageTxt: Optional[str] = None
    recCount: Optional[str] = None
    fileDetail: List[FileDetail]

    class Config:
        orm_mode = True