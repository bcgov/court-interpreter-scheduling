
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
    print("_Verifing___________") 
    if token is None:
        raise credentials_exception

    try:
        print(jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]))
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("_Verified_3__________")
        print(payload)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenDataSchema(email=email)

        if("code" in request.session):
            code = request.session["code"]
            # _____________________________
            print("___________________________________CODE___OIDC________")
            print(code)

        return {"username":payload.get("username"), "email":email}

    except jwt.ExpiredSignatureError:
        print("_______________________________SIGN___")
        return {"username":None, "email":None}

    except jwt.JWTClaimsError:
        print("_____________________CLAIM____")
        raise credentials_exception

    except JWTError:
        raise credentials_exception

