
from requests.auth import HTTPBasicAuth, AuthBase
import requests
from uuid import uuid4
import json
import base64
from core.config import settings
from models.user_model import UserModel
from sqlalchemy.orm import Session
from fastapi import HTTPException


# DOC: https://ches-dev.apps.silver.devops.gov.bc.ca/api/v1/docs#tag/Email

class BearerAuth(AuthBase):
    def __init__(self, token):
        self.token = token
    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r

class EmailService():
    def __init__(self):
        self.token = ''
        self.token_url=settings.CHES_AUTH_URL
        self.email_url=settings.CHES_EMAIL_URL
        self.client_id=settings.EMAIL_SERVICE_CLIENT_ID
        self.client_secret=settings.EMAIL_SERVICE_CLIENT_SECRET
        self.recipients_email=settings.RECIPIENT_EMAILS
        self.recipient_name = ''
        self.sender_name = ''
        self.sender_email = ''
        self.email_body = ''


    def get_access_token(self):
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        payload = {"grant_type": "client_credentials"}
        auth = HTTPBasicAuth(self.client_id, self.client_secret)

        response = requests.post(
            self.token_url, headers=headers, data=payload, auth=auth
        )

        if response.status_code == 200 and 'access_token' in response.json():
            return response.json().get('access_token')
        else:
            return ''


    def send_request(self, subject,  pdf_content = None, type = None):
        #print(subject)
    
        sender_info = f"{self.sender_name} <{self.sender_email}>"
        to = self.recipients_email.split(",")
        
        self.token = self.get_access_token()
        email={       
            "bodyType": "text",
            "body": self.email_body,
            "from": sender_info,
            "priority": "normal",
            "subject": subject,
            "to": to,
            "tag": str(uuid4())
        }

        
        if pdf_content is not None:            
            email["attachments"] = [
                {
                    "content": (base64.b64encode(pdf_content)).decode("utf-8"),
                    "contentType": "application/pdf",
                    "encoding": "base64",
                    "filename": ("ADM_"+type+".pdf")
                }
            ]

        data = json.dumps(email, indent = 4)
        
        # print(data)
        # print("_____________________")
        # print("_____________________")
        
        email_headers = {"Content-Type":"application/json"}
        email_response = requests.post(
            self.email_url, headers=email_headers, data=data, auth=BearerAuth(self.token),
        )

        if email_response.status_code != 201:
            raise HTTPException(status_code=404, detail=f"Email is not sent.")

        return email    


#___Request_Access    
    def request_access(self, db: Session, username, access_reason):
        current_user = db.query(UserModel).filter( UserModel.username==username).first()    
        if not current_user:
            raise HTTPException(status_code=404, detail=f"User is not available.")
        
        self.sender_name = current_user.display_name
        self.sender_email = current_user.email
        first_name = current_user.first_name
        last_name = current_user.last_name
        self.get_request_access_email_body(first_name, last_name, self.sender_name, self.sender_email, access_reason)
        self.send_request("Request Access for CIS app")

    def get_request_access_email_body(self, first_name, last_name, name, email, reason):
        self.email_body = f"\
            Requesting Person: \n \
            Name: {name} \n \
            First Name: {first_name} \n \
            Last Name: {last_name} \n \n\
            Email : {email} \n \n \
            Reason For Access: \n \
            {reason} \n "


#___Email_Adm    
    def email_adm(self, body, to, title, db: Session, username, pdf_content, type, interpreter_name, interpreter_email):
        current_user = db.query(UserModel).filter( UserModel.username==username).first()    
        if not current_user:
            raise HTTPException(status_code=404, detail=f"User is not available.")
        
        self.sender_name = current_user.display_name
        self.sender_email = current_user.email
        print("ADM_PROD_ENV=="+settings.ADM_PRODUCTION_ENV)
        self.recipients_email = current_user.email
        self.recipient_name = interpreter_name

        #TODO for PROD
        if(settings.ADM_PRODUCTION_ENV == 'true'):
            if to:
                self.recipients_email = to
            else:           
                self.recipients_email = interpreter_email
        
        if title:
            email_title = title
        else:
            email_title = f"Court Interpreter's ADM {type.capitalize()}"

        if body:
            self.email_body = body
        else:
            self.get_adm_email_body(type)
 
        return self.send_request(email_title, pdf_content, type)


    def get_adm_email_body(self, type):
        if type=='INVOICE':
            body = f"Please find the attachment, a copy of the Invoice for your court interpreting session.\n\
            If you see any issues in the information, please let me know through email at \'{self.sender_email}\'. \n"
        else:
            body = f"Please find attached, a copy of the invoice as a confirmation for your booking. \n\
            If you have any questions or concerns, please contact me at \'{self.sender_email}\'.\n"
            
            # Please find the attachment, a copy of the court interpreting information Form (ADM322).\n\
            

        self.email_body = f"\
            Dear {self.recipient_name}, \n\n\
            {body}\n\
            Regards,\n\
            {self.sender_name}\n\
            {self.sender_email}\n\
            Court Services Branch"

