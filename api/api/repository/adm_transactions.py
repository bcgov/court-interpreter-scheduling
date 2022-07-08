import os
import io
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse




def get_fillable_pdf():
    filepath = os.getcwd()+'/api/fillable_files/Adm322_auto fill_Mar2022-1.pdf'
    
    try:
        with open(filepath, "rb") as file:
            pdf_file = io.BytesIO(file.read())
            pdf_file.seek(0)        
            response = StreamingResponse(pdf_file, media_type='application/pdf')
            response.headers["Content-Disposition"] = 'filename=Adm322_auto fill_Mar2022-1.pdf'        
            return response

    except EnvironmentError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fillable File Not Found.")         
           



    
