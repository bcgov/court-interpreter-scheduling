
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from starlette.requests import Request
from core.config import settings
from api.schemas import TokenDataSchema

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=1)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception, request: Request):
    
    print("_____Verifing_Internal_Token_______") 
    if token is None:
        print("_________Internal_Token_Not_Found_________")
        raise credentials_exception
    
    if( "oidc_user_email" not in request.session):
        print("_________Internal_Token_User_Email_Not_Found_________")
        raise credentials_exception

    user_email = request.session["oidc_user_email"]

    try:        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])       

        email: str = payload.get("sub")
        if email is None or user_email is None or email != user_email:
            print("_________Internal_Token_Email_Error__________")
            raise credentials_exception

        token_data = TokenDataSchema(email=email)
        
        print("_________Internal_Token_Verified__________")

        # if("code" in request.session):
        #     code = request.session["code"]
        #     # _____________________________
        #     print("___________________________________CODE___OIDC________")
        #     print(code)

        return {"username":payload.get("username"), "email":email}

    except jwt.ExpiredSignatureError:
        print("_______________________________Internal_Token_Signature_Error___")
        return {"username":None, "email":None}

    except jwt.JWTClaimsError:
        print("_____________________Internal_Token_CLAIM_Error___")
        raise credentials_exception

    except JWTError:
        print("_____________________Internal_Token_Error___")
        raise credentials_exception




def verify_token_without_error(token: str, request: Request):
    
    print("_Verifing_Internal_Token_Without_raising_Error_________") 
    
    if token is None:
        print("_________Internal_Token_Not_Found_________")
        return {"username":None, "email":None}

    if( "oidc_user_email" not in request.session):
        print("_________Internal_Token_User_Email_Not_Found_________")
        return {"username":None, "email":None}

    user_email = request.session["oidc_user_email"]

    try:
        print(jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]))
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        print("____Internal_Token_Verified__________")
        # print(payload)
        
        email: str = payload.get("sub")
        if email is None or user_email is None or email != user_email:
            return {"username":None, "email":None}
        
        token_data = TokenDataSchema(email=email)

        # if("code" in request.session):
        #     code = request.session["code"]
        #     # _____________________________
        #     print("___________________________________CODE___OIDC________")
        #     print(code)

        return {"username":payload.get("username"), "email":email}

    except JWTError:
        return {"username":None, "email":None}