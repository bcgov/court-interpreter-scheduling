import os
import io
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse

from core.pdf import create_pdf_response, render_pdf
from api.schemas.adm_schema import PdfSchema

import logging
logger = logging.getLogger(__name__)




def get_fillable_pdf():
    filepath = os.getcwd()+'/api/fillable_files/Adm322_auto fill_Mar2022-1.pdf'
    
    try:
        with open(filepath, "rb") as file:
            pdf_content = file.read()
            return create_pdf_response(pdf_content, "Adm322_auto fill_Mar2022-1.pdf")           

    except EnvironmentError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fillable File Not Found.")         
           


def get_adm322_pdf(request: PdfSchema):

    html = request.html
   
    try:                        
        pdf_content = render_pdf(html)        
        return create_pdf_response(pdf_content, "Adm322.pdf")

    except Exception as ex:
        logger.error("ERROR: Pdf generation failed %s", ex)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Pdf generation failed.")
    


    
