from fastapi import Request, status, HTTPException, Depends
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer
from core import JWTtoken
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from models.user_model import UserModel

token_bearer_schema = HTTPBearer()




def logged_in_user_without_raising_error(request: Request, token: HTTPAuthorizationCredentials = Depends(token_bearer_schema)):
       
    user = JWTtoken.verify_token_without_error(token.credentials, request)        
    return user



def logged_in_user(request: Request, token: HTTPAuthorizationCredentials = Depends(token_bearer_schema)):

    return verify_user(request, token)



def admin_user(request: Request, db: Session= Depends(get_db_session), token: HTTPAuthorizationCredentials = Depends(token_bearer_schema)):
    
    require_roles = ['super-admin', 'cis-admin']
    user_info = verify_user(request, token)
    check_user_roles(require_roles, user_info['username'], db)

    return user_info



def super_admin(request: Request, db: Session= Depends(get_db_session), token: HTTPAuthorizationCredentials = Depends(token_bearer_schema)):
    
    require_roles = ['super-admin']
    user_info = verify_user(request, token)
    check_user_roles(require_roles, user_info['username'], db)

    return user_info



def user_in_role(request: Request, db: Session= Depends(get_db_session), token: HTTPAuthorizationCredentials = Depends(token_bearer_schema)):
    
    require_roles = ['super-admin', 'cis-admin', 'cis-user']
    user_info = verify_user(request, token)
    check_user_roles(require_roles, user_info['username'], db)

    return user_info




def check_user_roles(require_roles, username, db: Session):    
    user = db.query(UserModel).filter( UserModel.username==username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User is not available.")
    
    user_roles = [role.role_name for role in user.role]
    
    for require_role in require_roles:        
        if require_role in user_roles:
            return

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Unauthorized user.")



def verify_user(request: Request, token: HTTPAuthorizationCredentials):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user = JWTtoken.verify_token(token.credentials, credentials_exception, request)

    if ("username" not in user or "email" not in user):
        raise credentials_exception
    elif (user["username"] is None and user["email"] is None ):  
        raise credentials_exception
    else:
        return user