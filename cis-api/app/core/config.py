import os
import logging
from app.core.utils import str_to_bool
from starlette.datastructures import CommaSeparatedStrings, Secret
from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME = os.getenv('PROJECT_NAME', 'cis-api')
    SYSTEM_NAME = os.getenv('SYSTEM_NAME', 'cis')
    LOG_LEVEL = logging.getLevelName(os.getenv('LOG_LEVEL', 'DEBUG'))

    # initialize logger
    logger = logging.getLogger(PROJECT_NAME)
    log_level = logging.getLevelName(LOG_LEVEL)
    logger.setLevel(log_level)

    ENVIRONMENT_NAME = os.getenv('ENVIRONMENT_NAME', 'development')

    IS_PRODUCTION = True if 'production' in ENVIRONMENT_NAME else False

    # hide openapi docs in /docs and /redoc if environment name contains production
    SHOW_OPENAPI_DOCS = True

    MAX_CONNECTIONS_COUNT = int(os.getenv('MAX_CONNECTIONS_COUNT', 10))
    MIN_CONNECTIONS_COUNT = int(os.getenv('MIN_CONNECTIONS_COUNT', 10))
    SECRET_KEY = Secret(os.getenv('SECRET_KEY', 'ABYXCFijhE3xQLfOKkqpWOAMR2oRuJwIkvcVperF8WLsCo2PwEnffaiJLiXyYY4V'))

    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split()
    PORT = int(os.getenv('PORT', '8000'))

    # used by gunicorn_conf.py file, placed here so we know it's used
    KEEP_ALIVE = int(os.getenv('KEEP_ALIVE', '0'))
    ENABLE_UVICORN_ACCESS_LOG = str_to_bool(os.getenv('ENABLE_UVICORN_ACCESS_LOG', False))

    # API
    API_PREFIX = os.getenv('API_PREFIX', '/cis-api/v1')
    API_VERSION = '0.1.0'
    API_TITLE = 'Court Interpreter System API'
    API_DESCRIPTION = API_TITLE

    logger.info(f'ENVIRONMENT_NAME={ENVIRONMENT_NAME}')

    # Readiness and Liveness header keys, just so they can be overridden in production is so desired
    INTERNAL_READINESS = os.getenv('INTERNAL_READINESS', '21122899-b9ff-4bbf-af54-67d6d5463df8')
    INTERNAL_LIVENESS = os.getenv('INTERNAL_LIVENESS', '434f11e0-a21b-4f6f-8612-5b8ebbe074e1')

    # WEB_CONCURRENCY check gunicorn_conf.py

    # test, we use this to allow testing of deletion of dummy stubs in functional testing
    # this environment variable is set when running the tests
    TEST_MODE = str_to_bool(os.getenv('TEST_MODE', True))
    TEST_MODE = False if 'production' in ENVIRONMENT_NAME else TEST_MODE

    # environment variables loaded by dotenv
    # this needs to happen first or the environment won't really be loaded and accessible from app.core.config
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)) + '/../../.env')
    load_dotenv(env_path)

    POSTGRES_DATABASE_URL = os.environ['POSTGRES_DATABASE_URL']

    # cors
    CORS_ORIGIN = CommaSeparatedStrings(os.getenv('CORS_ORIGIN', '*'))
    # # LOCAL DEV: CORS_ORIGIN=http://localhost:8000,http://0.0.0.0:8000
    # # TESTING: CORS_ORIGIN=https://www.???
    # # PRODUCTION: CORS_ORIGIN=https://www.???

    # TODO:// our keycloak integration isn't really great, we simply want to get the user details based on their jwt
    # follow https://github.com/keycloak-client/keycloak-client/blob/main/examples/starlette/app.py, check authorization.py and add
    #   pydantic models to schemas.py

    # TODO:// get these creds, fix up their definitions
    # MAPBOX = os.getenv('MAPBOX')
    # GOOGLEMAPS = os.getenv('GOOGLEMAPS')
    # SENTRY_DSN = os.getenv('SENTRY_DSN')
    # S3_CREDS = os.getenv('S3_CREDS')

    class Config:
        case_sensitive = True


settings = Settings()
