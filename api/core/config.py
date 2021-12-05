import os
import logging
from pydantic import BaseSettings


class Settings(BaseSettings):

    DATABASE_SERVICE_NAME = os.getenv('DATABASE_SERVICE_NAME','db')
    DATABASE_ENGINE = os.getenv('DATABASE_ENGINE','postgresql')
    DATABASE_NAME = os.getenv('DATABASE_NAME')
    DATABASE_USER = os.getenv('DATABASE_USER')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')
    DB_SERVICE_HOST = os.getenv('DB_SERVICE_HOST')
    DB_SERVICE_PORT = os.getenv('DB_SERVICE_PORT')

    OIDC_RP_PROVIDER_URL = os.getenv('OIDC_RP_PROVIDER_URL')
    OIDC_RP_PROVIDER_REALM = os.getenv('OIDC_RP_PROVIDER_REALM')
    OIDC_RP_CLIENT_ID = os.getenv('OIDC_RP_CLIENT_ID')
    OIDC_RP_CLIENT_SECRET = os.getenv('OIDC_RP_CLIENT_SECRET')
    OIDC_RP_KC_IDP_HINT = os.getenv('OIDC_RP_KC_IDP_HINT')

    FRONTEND_HOST_URL = os.getenv('FRONTEND_HOST_URL','http://localhost:8081')
    DEFAULT_BASE_URL = os.getenv('DEFAULT_BASE_URL' ,'/court-interpreter-scheduling')
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY','5e094faa6ca25ahc81816')
    DATA_SECURITY_KEY = os.getenv('DATA_SECURITY_KEY','1tjhb7a9563je93f7099')
    

    # # API
    API_PREFIX = os.getenv('API_PREFIX', '/api/v1')
    API_VERSION = '0.1.0'
    API_TITLE = 'Court Interpreter System API'
    API_DESCRIPTION = API_TITLE
   

    # # cors
    CORS_ORIGIN = str(os.getenv('CORS_ORIGIN', '*')).split(',')    
    # # # LOCAL DEV: CORS_ORIGIN=http://localhost:8000,http://0.0.0.0:8000
    # # # TESTING: CORS_ORIGIN=https://www.???
    # # # PRODUCTION: CORS_ORIGIN=https://www.???


    class Config:
        case_sensitive = True


settings = Settings()
