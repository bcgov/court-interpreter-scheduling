from typing import Optional
from pydantic import BaseModel


    
class PdfSchema(BaseModel):
    
    html: Optional[str]
    booking_id: Optional[int]
    
    class Config():
        orm_mode = True