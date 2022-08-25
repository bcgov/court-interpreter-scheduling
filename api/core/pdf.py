import json
import io
import requests
from core.config import settings
from fastapi.responses import StreamingResponse


PDF_URL = settings.PDF_SERVICE_URL


def render_pdf(*html):
    """
    Calls the PDF rendering microservice to convert html into
    a PDF file.
    """

    if not PDF_URL:
        raise Exception("PDF_SERVICE_URL environment variable is not set.")

    if len(html) > 1:
        response = requests.post(
            "{}/multiple".format(PDF_URL), data=json.dumps(html), stream=True
        )
    elif html:
        response = requests.post(
            "{}/pdf?bootstrap=true".format(PDF_URL), data=html[0].encode("utf-8"), stream=True
        )
    else:
        raise Exception("No HTML input provided")

    response.raise_for_status()
    return response.content



def create_pdf_response(pdf_content, file_name):
    pdf_file = io.BytesIO(pdf_content)
    pdf_file.seek(0)
    response = StreamingResponse(pdf_file, media_type='application/pdf')
    response.headers["Content-Disposition"] = "filename={}".format(file_name)
    return response