from typing import Dict, Optional
from fastapi import FastAPI, HTTPException, Depends, Response, status, Request, Cookie
from fastapi.security import HTTPBearer
import uvicorn
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware
from core.config import settings
from core.multi_database_middleware import DATABASE_URL
from api.api import router as api_router
from oidc.oidc_router import router as oidc_router
from core.auth import logged_in_user
from api.schemas import UserSchema

from starlette.middleware.sessions import SessionMiddleware


# app = FastAPI()

#___________________________________________________

def get_application() -> FastAPI:
   
    new_app = FastAPI(
        title=settings.API_TITLE, 
        description=settings.API_DESCRIPTION, 
        version=settings.API_VERSION
    )
    print("====CORES=====")
    print(settings.CORS_ORIGIN)
    new_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGIN,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    new_app.add_middleware(SessionMiddleware, secret_key="test secret key")
    new_app.include_router(oidc_router)
    new_app.include_router(api_router)

    new_app.add_middleware(DBSessionMiddleware, db_url=DATABASE_URL)

    return new_app



app = get_application()


@app.get('/api/v1/health')
def checkHealth(user: UserSchema = Depends(logged_in_user)):
    print("______Health check for OpenShift______")  
    print(user)  
    return "Healthy"


def start_main():

    print("____FAST_API____")
    print("API_HTTP_PORT is: ",os.getenv('API_HTTP_PORT', ''))
    uvicorn.run(app, host="0.0.0.0", port=8080)
    # app.logger.info(f'starting uvicorn on port {settings.PORT} - {settings.ENVIRONMENT_NAME}')
    # uvicorn.run(app, host="0.0.0.0", port=settings.PORT, access_log=settings.ENABLE_UVICORN_ACCESS_LOG)


if __name__ == '__main__':
    start_main()