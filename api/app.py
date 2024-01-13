
from fastapi import FastAPI
from contextlib import asynccontextmanager

import uvicorn
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware
from api.repository.geo_update_schedule_transactions import check_geo_update_schedule

from core.config import settings
from core.multi_database_middleware import DATABASE_URL

from api.api import router as api_router
from oidc.oidc_router import router as oidc_router
from jc_interface.jc_router import router as jc_router

from core.multi_database_middleware import DBSession
from core.repeat_task import repeat_every

from starlette.middleware.sessions import SessionMiddleware

# setup loggers
logging.config.fileConfig('logging.conf', disable_existing_loggers=False)

logger = logging.getLogger(__name__)

# app = FastAPI()

@repeat_every(seconds= 60*60)  # for 1hour  ==>  60*60
async def geo_update_schedule_task() -> None:
    logger.info("_________CHECK___GEO_Update_Schedule________")
    with DBSession() as db:
        await check_geo_update_schedule(db)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await geo_update_schedule_task()
    yield

#___________________________________________________

def get_application() -> FastAPI:
   
    new_app = FastAPI(
        title=settings.API_TITLE, 
        description=settings.API_DESCRIPTION, 
        version=settings.API_VERSION,
        lifespan=lifespan
    )

    logger.info("CORES are: "+" ".join(settings.CORS_ORIGIN))
    new_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGIN,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    new_app.add_middleware(SessionMiddleware, secret_key="store secret key")
    new_app.include_router(oidc_router)
    new_app.include_router(api_router)
    new_app.include_router(jc_router)

    new_app.add_middleware(DBSessionMiddleware, db_url=DATABASE_URL)

    return new_app



app = get_application()



@app.get('/api/v1/health')
def openshift_Health_Check():
    #______Health check for OpenShift______
    return "Healthy"

      

def start_main():
        
    print("____FAST_API____")
    print("API_HTTP_PORT is: ",os.getenv('API_HTTP_PORT', ''))
    uvicorn.run(app, host="0.0.0.0", port=8080)
    # app.logger.info(f'starting uvicorn on port {settings.PORT} - {settings.ENVIRONMENT_NAME}')
    # uvicorn.run(app, host="0.0.0.0", port=settings.PORT, access_log=settings.ENABLE_UVICORN_ACCESS_LOG)


if __name__ == '__main__':
    start_main()