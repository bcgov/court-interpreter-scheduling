from typing import Optional
from pydantic import BaseModel


    
class PdfSchema(BaseModel):
    
    html: Optional[str]
    
    class Config():
        orm_mode = True