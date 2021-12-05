from fastapi import Request, status, HTTPException, Depends
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer
from core import JWTtoken

token_bearer_schema = HTTPBearer()

def logged_in_user(request: Request, token: HTTPAuthorizationCredentials = Depends(token_bearer_schema)):

    print("_________Check_If_User_Logged_in")
    print(token)
    print(token.credentials)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user = JWTtoken.verify_token(token.credentials, credentials_exception, request)

    if ("username" not in user or "email" not in user):
        raise credentials_exception
    elif (user["username"] is None and user["email"] is None ):
        print("__TOKEN_EXPIRED___REFRESH_REQUIRED__")    
        raise credentials_exception
    else:
        return user
