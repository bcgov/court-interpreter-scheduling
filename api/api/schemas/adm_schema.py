from typing import Optional
from pydantic import BaseModel


    
class PdfSchema(BaseModel):
    
    html: Optional[str]
    booking_id: Optional[int]
    body: Optional[str]
    to: Optional[str]
    title: Optional[str]
    
    class Config():
        orm_mode = True