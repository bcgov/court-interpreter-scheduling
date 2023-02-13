from pydantic import BaseModel, Field, Json
from datetime import datetime
from typing import Optional, List, Dict

from api.schemas.interpreter_schema import InterpreterBase, InterpreterBookingResponseSchema, InterpreterADMBookingResponseSchema
from models.booking_enums import BookingPeriodEnum, BookingStatusEnum, BookingRequestedByEnum, BookingMethodOfAppearanceEnum, BookingInterpretForEnum
from api.schemas.custom_type import TruncatedUserIdBase, JsonBase
from api.schemas.language_schema import InterpreterLanguageSchema


class BookingCasesResponseSchema(BaseModel):    
    id: Optional[int]

    file: Optional[str]
    case_name: Optional[str] = Field(alias="caseName")
    room: Optional[str]
    
    case_type: Optional[str] = Field(alias="caseType")
    court_level: Optional[str] = Field(alias="courtLevel")
    court_class: Optional[str] = Field(alias="courtClass")
    reason: Optional[str] 
       
    bilingual: Optional[bool] = False
    interpretation_mode: Optional[str] = Field(alias="interpretationMode")

    language: Optional[InterpreterLanguageSchema]
    interpret_for: Optional[str] = Field(alias="interpretFor")

    federal: Optional[bool] = False
    prosecutor: Optional[str]

    remote_registry: Optional[str] = Field(alias="remoteRegistry")
    remote_location_id: Optional[int] = Field(alias="remoteLocationId")
    van_registry: Optional[str] = Field(alias="vanRegistry")
    van_location_id: Optional[int] = Field(alias="vanLocationId") 
   
    requested_by: Optional[BookingRequestedByEnum] = Field(alias="requestedBy")
    method_of_appearance: Optional[BookingMethodOfAppearanceEnum] = Field(alias="methodOfAppearance")
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True  


class BookingDateSchema(BaseModel):
    id: Optional[int]
    date: Optional[datetime]

    cases: Optional[List[BookingCasesResponseSchema]]

    start_time: Optional[str] = Field(alias="startTime")
    finish_time: Optional[str] = Field(alias="finishTime")
    
    actual_start_time: Optional[str] = Field(alias="actualStartTime")
    actual_finish_time: Optional[str] = Field(alias="actualFinishTime")
    approvers_initials: Optional[str] = Field(alias="approversInitials")

    cancellation_reason: Optional[str] = Field(alias="cancellationReason")
    cancellation_comment: Optional[str] = Field(alias="cancellationComment")
    cancellation_date: Optional[datetime] = Field(alias="cancellationDate")
    cancellation_time: Optional[str] = Field(alias="cancellationTime")
    cancellation_fee: Optional[str] = Field(alias="cancellationFee")

    
    comment: Optional[str]
   
    method_of_appearance: Optional[BookingMethodOfAppearanceEnum] = Field(alias="methodOfAppearance")
    status: Optional[BookingStatusEnum]
    
    # location_id: Optional[int] = Field(alias="locationId")
    
    class Config():
        orm_mode = True
        allow_population_by_field_name = True

#_______________________________
#_______Request____(IN)_____
#_______________________________
class BookingDateSchemaIn(BookingDateSchema):
    # languages: Optional[List[Dict]]
    pass

class BookingRequestBase(BaseModel):
      
    # scheduling_clerk: Optional[str] = Field(alias="schedulingClerk")
    clerk_phone: Optional[str] = Field(alias="clerkPhone")  

    dates: List[BookingDateSchemaIn]

    class Config():
        orm_mode = True
        allow_population_by_field_name = True

#_______________________________
#______Response____(OUT)____
#_______________________________
class BookingDateSchemaOut(BookingDateSchema):
    languages: Optional[JsonBase]

class BookingResponseBase(BaseModel):
      
    scheduling_clerk: Optional[TruncatedUserIdBase] = Field(alias="schedulingClerk")
    clerk_phone: Optional[str] = Field(alias="clerkPhone") 
    interpreter: InterpreterBookingResponseSchema
    location_id: Optional[int]
    location_name: Optional[str]

    dates: List[BookingDateSchemaOut]

    class Config():
        orm_mode = True
        allow_population_by_field_name = True
#_______________________________
#_______________________________
#_______________________________
#_______________________________

class BookingRequestSchema(BookingRequestBase):
    interpreter_id: Optional[int] = Field(alias="interpreterId")
    location_id: Optional[int] = Field(alias="locationId")
    location_name: Optional[str] = Field(alias="locationName")



# General Info
class BookingResponseSchema(BookingResponseBase):
    id: Optional[int]           
    interpreter: InterpreterBookingResponseSchema
    records_approved: Optional[bool] = Field(alias="recordsApproved")

    created_at: Optional[datetime]
    updated_by: TruncatedUserIdBase



#Specific to ADM (OUT of DB)
class ADMBookingResponseSchema(BookingResponseBase):
    id: Optional[int]
    records_approved: Optional[bool] = Field(alias="recordsApproved")
    approver_name: Optional[str] = Field(alias="approverName")
    interpreter_signed: Optional[bool] = Field(alias="interpreterSigned")
    interpreter_signdate: Optional[str] = Field(alias="interpreterSigningDate")
    qr_signed: Optional[bool] = Field(alias="qualifiedReceiverSigned")
    qr_signdate: Optional[str] = Field(alias="qualifiedReceiverSigningDate")
    fees_gst: Optional[float] = Field(alias="feesGST")
    fees_total: Optional[float] = Field(alias="feesTotal")
    expense_gst: Optional[float] = Field(alias="expenseGST")
    expense_total: Optional[float] = Field(alias="expenseTotal")
    invoice_total: Optional[float] = Field(alias="invoiceTotal")
    invoice_date: Optional[str] = Field(alias="invoiceDate")
    invoice_number: Optional[str] = Field(alias="invoiceNumber")
    adm_detail: Optional[JsonBase] = Field(alias="admDetail")          
    interpreter: InterpreterADMBookingResponseSchema
    created_at: Optional[datetime]
    updated_by: TruncatedUserIdBase
    adm_updated_by: Optional[TruncatedUserIdBase]

    form_sender: Optional[TruncatedUserIdBase] = Field(alias="formSender")
    form_sender_email: Optional[str] = Field(alias="formSenderEmail")
    form_recipient_email: Optional[str] = Field(alias="formRecipientEmail")
    form_sent_date: Optional[datetime] = Field(alias="formSentDate")

    invoice_sender: Optional[TruncatedUserIdBase] = Field(alias="invoiceSender")
    invoice_sender_email: Optional[str] = Field(alias="invoiceSenderEmail")
    invoice_recipient_email: Optional[str] = Field(alias="invoiceRecipientEmail")
    invoice_sent_date: Optional[datetime] = Field(alias="invoiceSentDate")

#Specific to ADM (In to DB)
class ADMBookingRequestSchema(BookingRequestBase):
    id: Optional[int]
    records_approved: Optional[bool] = Field(alias="recordsApproved")
    approver_name: Optional[str] = Field(alias="approverName")
    interpreter_signed: Optional[bool] = Field(alias="interpreterSigned")
    interpreter_signdate: Optional[str] = Field(alias="interpreterSigningDate")
    qr_signed: Optional[bool] = Field(alias="qualifiedReceiverSigned")
    qr_signdate: Optional[str] = Field(alias="qualifiedReceiverSigningDate")
    fees_gst: Optional[float] = Field(alias="feesGST")
    fees_total: Optional[float] = Field(alias="feesTotal")
    expense_gst: Optional[float] = Field(alias="expenseGST")
    expense_total: Optional[float] = Field(alias="expenseTotal")
    invoice_total: Optional[float] = Field(alias="invoiceTotal")
    invoice_date: Optional[str] = Field(alias="invoiceDate")
    invoice_number: Optional[str] = Field(alias="invoiceNumber")
    adm_detail: Optional[Dict] = Field(alias="admDetail")
    
    


class BookingDateRangeSchema(BaseModel):
    endDate: Optional[str]
    startDate: Optional[str]



class BookingSearchRequestSchema(BaseModel):    

    dates: Optional[List[BookingDateRangeSchema]]
    file: Optional[str]
    interpreter: Optional[str]
    isStartFromToday: Optional[bool]
    locationId: Optional[int]
    

    
class BookingSearchResponseSchema(BaseModel):
    
    reason: Optional[str]    
    file: Optional[str]    
    location_id: Optional[int] = Field(alias="locationId")    
    dates: List[BookingDateSchemaOut]

    class Config():
        orm_mode = True
        allow_population_by_field_name = True


class BookingInvoiceNumberResponseSchema(BaseModel):
    
    id: Optional[int]
    invoice_number: Optional[str] = Field(alias="invoiceNumber")

    class Config():
        orm_mode = True
        allow_population_by_field_name = True   