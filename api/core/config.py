import os
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
    URL_SCHEME = os.getenv('URL_SCHEME' ,'http')
    APP_RUN_IN_DOCKER = os.getenv('APP_RUN_IN_DOCKER', 'False')
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY','5e094faa6ca25ahc81816')
    DATA_SECURITY_KEY = os.getenv('DATA_SECURITY_KEY')

    PDF_SERVICE_URL = os.getenv('PDF_SERVICE_URL') 
    
    # # JC Interface
    JC_INTERFACE_API_FILE_URL = os.getenv('JC_INTERFACE_API_FILE_URL')
    JC_INTERFACE_API_LOCATION_URL = os.getenv('JC_INTERFACE_API_LOCATION_URL')
    JC_INTERFACE_API_USERNAME = os.getenv('JC_INTERFACE_API_USERNAME')
    JC_INTERFACE_API_PASSWORD = os.getenv('JC_INTERFACE_API_PASSWORD')
    JC_INTERFACE_API_FILE_USERNAME = os.getenv('JC_INTERFACE_API_FILE_USERNAME')
    JC_INTERFACE_API_FILE_PASSWORD = os.getenv('JC_INTERFACE_API_FILE_PASSWORD')

    # # Efiling Hub
    EFILING_HUB_API_BASE_URL = os.getenv('EFILING_HUB_API_BASE_URL')
    EFILING_HUB_KEYCLOAK_CLIENT_ID = os.getenv('EFILING_HUB_KEYCLOAK_CLIENT_ID')
    EFILING_HUB_KEYCLOAK_BASE_URL = os.getenv('EFILING_HUB_KEYCLOAK_BASE_URL')
    EFILING_HUB_KEYCLOAK_SECRET = os.getenv('EFILING_HUB_KEYCLOAK_SECRET')
    EFILING_HUB_KEYCLOAK_REALM = os.getenv('EFILING_HUB_KEYCLOAK_REALM')

    # # API
    API_PREFIX = os.getenv('API_PREFIX', '/api/v1')
    API_VERSION = '0.1.0'
    API_TITLE = 'Court Interpreter System API'
    API_DESCRIPTION = API_TITLE
   
    # # Geo coordinate calls
    GOOGLE_MAP_URL = os.getenv('GOOGLE_MAP_URL')
    OPENROAD_MAP_URL = os.getenv('OPENROAD_MAP_URL')

    # # cors
    CORS_ORIGIN = str(os.getenv('CORS_ORIGIN', '*')).split(',')    
    # # # LOCAL DEV: CORS_ORIGIN=http://localhost:8000,http://0.0.0.0:8000
    # # # TESTING: CORS_ORIGIN=https://www.???
    # # # PRODUCTION: CORS_ORIGIN=https://www.???

    # # CHES Email service
    CHES_AUTH_URL = os.getenv('CHES_AUTH_URL')
    CHES_EMAIL_URL = os.getenv('CHES_EMAIL_URL')
    EMAIL_SERVICE_CLIENT_ID = os.getenv('EMAIL_SERVICE_CLIENT_ID')
    EMAIL_SERVICE_CLIENT_SECRET = os.getenv('EMAIL_SERVICE_CLIENT_SECRET')
    RECIPIENT_EMAILS = os.getenv('RECIPIENT_EMAILS') 
    ADM_PRODUCTION_ENV = os.getenv('ADM_PRODUCTION_ENV','false')

    class Config:
        case_sensitive = True


settings = Settings()
