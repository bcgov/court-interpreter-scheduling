import os
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from core.pdf import create_pdf_response, render_pdf
from api.schemas.adm_schema import PdfSchema
from models.booking_model import BookingModel
from models.pdf_model import PdfModel
from api.repository.user_transactions import get_update_by
from core.encryption import Encryptor
from api.repository.access_request_transactions import EmailService
from datetime import datetime



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


def get_sent_adm322_pdf(id, type,  db):
    if not type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"PDF type Parameter missing.")
    
    pdf_type = type.upper()
    filename = "Adm322_"+pdf_type+".pdf"

    pdf_query = db.query(PdfModel).filter(PdfModel.booking_id==id, PdfModel.pdf_type==pdf_type).first()
    if not pdf_query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Pdf file not found.")

    pdf_content = Encryptor().decrypt(pdf_query.key, pdf_query.data)
    return create_pdf_response(pdf_content, filename)


def get_adm322_pdf(request: PdfSchema, db: Session, username , email=None):
    
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

    booking = db.query(BookingModel).filter(BookingModel.id==booking_id).first()        
    if booking.records_approved == True:
        pdf_type = "INVOICE"
    else:
        pdf_type = "FORM"
    
    if email =='true':
        pdf_type = 'EMAILED-'+pdf_type

    interpreter_name = str(booking.interpreter.first_name + ' '+booking.interpreter.last_name)
    interpreter_email = str(booking.interpreter.email)

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
    
    if email =='true':
        # print('__EMAIL_FORM__')
        return send_adm_form(db, username, booking_id, pdf_content,  updated_by, pdf_type, interpreter_name, interpreter_email)
    else:
        return create_pdf_response(pdf_content, "Adm322.pdf")           
        
   


def send_adm_form(db: Session, username, booking_id, pdf_content,  updated_by, type, interpreter_name, interpreter_email):
    
    pdf_type = type[8:]
    # print(pdf_type)

    email = EmailService().email_adm(db, username, pdf_content, pdf_type, interpreter_name, interpreter_email)
    email["attachments"]="PDF Attached"    
    email["type"] = pdf_type
    email["to"] = (','.join(email["to"]))

    booking_query = db.query(BookingModel).filter(BookingModel.id==booking_id)
    if pdf_type == "INVOICE":
        booking_query.update({
            "invoice_sender":updated_by,
            "invoice_sender_email":email["from"],
            "invoice_recipient_email":email["to"],
            "invoice_sent_date": datetime.now()       
        })
    else:
        booking_query.update({
            "form_sender":updated_by,
            "form_sender_email":email["from"],
            "form_recipient_email":email["to"],
            "form_sent_date": datetime.now()       
        })
    db.commit()
    return email