import json
from fastapi import APIRouter, status, HTTPException, Depends, Response, Request
from fastapi.encoders import jsonable_encoder
from starlette import responses
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from api.schemas import UserSchema
from models.user_model import UserModel
from models.oidc_model import OidcUserModel
from typing import Dict, Optional
from starlette.responses import RedirectResponse
from oidc.openid_connect import OpenIDConnect
from core.utils import getBaseUrl, getLoginUrl, getLogoutUrl
from fastapi.security import HTTPBearer
from uuid import uuid4
from core.config import settings
from oidc.oidc_user_repository import oidc_user_repository
from core import JWTtoken
import requests

hint = settings.OIDC_RP_KC_IDP_HINT
host = settings.OIDC_RP_PROVIDER_URL
realm = settings.OIDC_RP_PROVIDER_REALM
client_id = settings.OIDC_RP_CLIENT_ID
client_secret = settings.OIDC_RP_CLIENT_SECRET

oidc = OpenIDConnect(hint, host, realm, client_id, client_secret)

# _____________________________
print("==================")
print(oidc.issuer)
print(oidc.authorization_endpoint)
print(oidc.token_endpoint)
print(oidc.userinfo_endpoint)
print(oidc.jwks_uri)
print(oidc.logout_uri)
# _____________________________

router = APIRouter(
    prefix="/api/v1",
    tags=['Oidc']
)


@router.get('/login/cb')
async def oidc_login_callback(request: Request, db: Session = Depends(get_db_session)):

    code = request.query_params.get("code")
    
    if ("oidc_auth_state" not in request.session or request.session["oidc_auth_state"] != request.query_params.get("state")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid OpenID Connect callback state value.")
    
    callback_uri = f"{getBaseUrl(request)}{request.url.path}"
    oidc_userinfo, oidc_refresh_token = oidc.authenticate(code, callback_uri, include_user_info=True)
    
    # _____________________________
    print("____CALLBACK2_URL__")
    print(callback_uri)
    print(oidc_userinfo)
    print("_+++++++++++++++OIDC__REFRESH_TOKEN__")
    print(oidc_refresh_token)
    # _____________________________
    
    # oidc_user = oidc_user_repository(oidc_userinfo, db)
    # access_token = JWTtoken.create_access_token(data={"sub": oidc_user.user.email, "username": oidc_user.user.username})
    # "user":jsonable_encoder(oidc_user.user)})
    # request.session["access_token"]=access_token
    request.session["oidc_refresh_token"] = oidc_refresh_token
    # request.session["callback_uri"]= callback_uri

    #___________GOTO the Frontend Route__________
    #___________GOTO the Frontend Route__________
    #___________GOTO the Frontend Route__________
    if ("x-forwarded-host" not in request.headers 
        and "host" in request.headers
        and "localhost:" in request.headers['host']
    ):
        redirect_url = f"{settings.FRONTEND_HOST_URL}{settings.DEFAULT_BASE_URL}/home"
    else:
        redirect_url = f"{getBaseUrl(request)}{settings.DEFAULT_BASE_URL}/home"
    
    return RedirectResponse(redirect_url)

@router.get('/login')
def web_login_callback(request: Request):
    
    callback_uri = f"{getBaseUrl(request)}{request.url.path}"+"/cb"

    # _____________________________
    print("______Login______")
    print(callback_uri)
    print(request.base_url)
    print(request.url)
    print(request.client)
    print(request.headers)
    print(request)
    # _____________________________

    session_key = str(uuid4())
    request.session["oidc_auth_state"]=session_key
    login_url = oidc.get_auth_redirect_uri(callback_uri,session_key)
    
    # _____________________________
    print(request.session)    
    print("______Login__END____")    
    print(login_url)
    # _____________________________

    return RedirectResponse(login_url)


@router.get('/logout')
def web_logout_user(request: Request):
    
    print("________VOID_THE_TOKEN______")
    if ("oidc_refresh_token" in request.session):
        request.session["oidc_refresh_token"] = None

    if ("oidc_auth_state" in request.session):
        request.session["oidc_auth_state"] = None

    
    callback_uri = f"{getBaseUrl(request)}{request.url.path}"+"/cb"
    return RedirectResponse(f"{oidc.logout_uri}?redirect_uri={callback_uri}")

@router.get('/logout/cb')
def oidc_logout_done(request: Request):
    print("_______LOGGED-OUT_______")
    if ("x-forwarded-host" not in request.headers 
        and "host" in request.headers
        and "localhost:" in request.headers['host']
    ):
        redirect_url = f"{settings.FRONTEND_HOST_URL}{settings.DEFAULT_BASE_URL}"
    else:
        redirect_url = f"{getBaseUrl(request)}{settings.DEFAULT_BASE_URL}"

    
    return RedirectResponse(redirect_url)


@router.get('/token')
def token_user(request: Request, db: Session = Depends(get_db_session)):
    
    print("________REFRESH__TOKEN______")
    if( 
        "oidc_refresh_token" in request.session 
        and request.session["oidc_refresh_token"] is not None       
    ):
        oidc_refresh_token = request.session["oidc_refresh_token"]
               
        print(oidc_refresh_token)

        response = oidc.get_refresh_token(oidc_refresh_token)
        oidc_userinfo = oidc.get_user_info(response['access_token'])

        print("________REFRESH__TOKEN__RESPONSE______")
        print(response)
        print(oidc_userinfo)
        # _____________________________

        oidc_user = oidc_user_repository(oidc_userinfo, db)
        access_token = JWTtoken.create_access_token(data={"sub": oidc_user.user.email, "username": oidc_user.user.username})
       
        return {"access_token": access_token, "token_type": "bearer", "login_url":None, "logout_url":getLogoutUrl(request)}
    else:
        return {"access_token": None, "token_type": "bearer", "login_url":getLoginUrl(request), "logout_url":getLogoutUrl(request)}