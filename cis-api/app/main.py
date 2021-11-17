import uvicorn
import sys
import logging
from fastapi import FastAPI
from starlette.exceptions import HTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from fastapi.exceptions import RequestValidationError
from starlette.responses import JSONResponse
from loguru import logger
from app.api.api_v1.api import router as api_router
from app.core.logging import InterceptHandler, format_record
from app.core.errors import http_422_error_handler, http_error_handler, PayloadValidationError
from app.core.config import settings
from fastapi_sqlalchemy import DBSessionMiddleware


def get_application() -> FastAPI:
    """
    the primary entrypoint for the application, configure it and return to the main
    :return:
    """

    docs_url = f'{settings.API_PREFIX}/docs'
    redoc_url = f'{settings.API_PREFIX}/redoc'
    openapi_url = f'{settings.API_PREFIX}/openapi.json'
    new_app = FastAPI(title=settings.API_TITLE, description=settings.API_DESCRIPTION, docs_url=docs_url, redoc_url=redoc_url,
                      openapi_url=openapi_url, version=settings.API_VERSION)

    logging.basicConfig(
        handlers=[InterceptHandler(level=settings.LOG_LEVEL)], level=settings.LOG_LEVEL
    )
    logger.configure(
        handlers=[{"sink": sys.stderr, "level": settings.LOG_LEVEL, "format": format_record}]
    )
    new_app.logger = logger
    # hook up uvicorn access log to our InterceptHandler, we filter out the probes controller cause it's
    #   so noisy
    # logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]

    new_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGIN,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # manage global exception handlers
    new_app.add_exception_handler(HTTPException, http_error_handler)
    new_app.add_exception_handler(HTTP_422_UNPROCESSABLE_ENTITY, http_422_error_handler)

    new_app.include_router(api_router, prefix=settings.API_PREFIX)

    new_app.add_middleware(DBSessionMiddleware, db_url=settings.POSTGRES_DATABASE_URL)
    return new_app


# get our app and start it up
app = get_application()


@app.on_event('startup')
async def on_startup() -> None:
    """
    :return:
    """
    app.logger.info(f'running on_startup method')    


@app.on_event('shutdown')
async def on_shutdown() -> None:
    """
    :return:
    """
    app.logger.info(f'running on_shutdown method')


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """
    handles global RequestValidationError, converting these to a format we desire.
    originally these exceptions would just be raised without our control
    :param request:
    :param exc:
    :return:
    """
    error = PayloadValidationError(error='PayloadValidationError', message=str(exc))
    return JSONResponse(error.dict(), status_code=HTTP_422_UNPROCESSABLE_ENTITY)


def start_main():
    """
    spin up uvicorn
    :return:
    """
    app.logger.info(f'starting uvicorn on port {settings.PORT} - {settings.ENVIRONMENT_NAME}')
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT, access_log=settings.ENABLE_UVICORN_ACCESS_LOG)


if __name__ == '__main__':
    start_main()
