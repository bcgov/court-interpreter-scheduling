import os
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from core.pdf import create_pdf_response, render_pdf
from api.schemas.adm_schema import PdfSchema
from models.booking_model import BookingModel
from models.pdf_model import PdfModel
from api.repository.user_transactions import get_update_by
from core.encryption import Encryptor


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
           


def get_adm322_pdf(request: PdfSchema, db: Session, username):
    
    html = request.html
    booking_id = request.booking_id
    if not booking_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Request Parameters missing.")

    pdf_content = None

    try:        
        pdf_content = render_pdf(html)        
    except Exception as ex:
        logger.error("ERROR: Pdf generation failed %s", ex)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Pdf generation failed.")

    updated_by = get_update_by(db, username)
    data_key, data_enc = Encryptor().encrypt(pdf_content)
    # data_decrypted = Encryptor().decrypt(key, data)        

    booking = db.query(BookingModel).filter(BookingModel.id==booking_id).first()        
    if booking.records_approved == True:
        pdf_type = "INVOICE"
    else:
        pdf_type = "FORM"

    
    pdf_query = db.query(PdfModel).filter(PdfModel.booking_id==booking_id, PdfModel.pdf_type==pdf_type)
    if(pdf_query.first()):
        pdf_query.update({
            "data":data_enc,
            "key":data_key,
            "updated_by":updated_by,
        })
    else:       
        new_pdf = PdfModel(
            data = data_enc,
            key = data_key,
            updated_by = updated_by,
            pdf_type = pdf_type,
            booking_id = booking.id 
        )
        db.add(new_pdf)
    db.commit()

    
    return create_pdf_response(pdf_content, "Adm322.pdf")