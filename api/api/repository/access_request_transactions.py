
from requests.auth import HTTPBasicAuth, AuthBase
import requests
from uuid import uuid4
import json
from core.config import settings
from models.user_model import UserModel
from sqlalchemy.orm import Session
from fastapi import HTTPException


# DOC: https://ches-dev.apps.silver.devops.gov.bc.ca/api/v1/docs#tag/Email



class EmailRequestAccess():
    def __init__(self):
        self.token = ''
        self.token_url=settings.CHES_AUTH_URL
        self.email_url=settings.CHES_EMAIL_URL
        self.client_id=settings.EMAIL_SERVICE_CLIENT_ID
        self.client_secret=settings.EMAIL_SERVICE_CLIENT_SECRET
        self.recipients_email=settings.RECIPIENT_EMAILS
        self.sender_name = ''
        self.sender_email = ''
        self.email_body = ''
    
    def request_access(self, db: Session, username, access_reason):
        current_user = db.query(UserModel).filter( UserModel.username==username).first()    
        if not current_user:
            raise HTTPException(status_code=404, detail=f"User is not available.")
        
        self.sender_name = current_user.display_name
        self.sender_email = current_user.email
        first_name = current_user.first_name
        last_name = current_user.last_name
        self.get_email_body(first_name, last_name, self.sender_name, self.sender_email, access_reason)
        self.send_request()


    def get_email_body(self, first_name, last_name, name, email, reason):

        self.email_body = f"\
            Requesting Person: \n \
            Name: {name} \n \
            First Name: {first_name} \n \
            Last Name: {last_name} \n \n\
            Email : {email} \n \n \
            Reason For Access: \n \
            {reason} \n "
    

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


    def send_request(self):
    
        sender_info = f"{self.sender_name} <{self.sender_email}>"            
        subject="Request Access for CIS app"        
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

        # print(json.dumps(email, indent = 4))
        # print("_____________________")
        # print("_____________________")
    
        email_headers = {"Content-Type":"application/json"}
        email_response = requests.post(
            self.email_url, headers=email_headers, data=json.dumps(email, indent = 4), auth=BearerAuth(self.token),
        )
        # print(email_response)
        # print(email_response.content)

        if email_response.status_code != 201:
            raise HTTPException(status_code=404, detail=f"Email was not sent.")    


class BearerAuth(AuthBase):
    def __init__(self, token):
        self.token = token
    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r