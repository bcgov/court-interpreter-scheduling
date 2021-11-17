from fastapi import APIRouter, Header, HTTPException, Depends
from starlette.status import HTTP_404_NOT_FOUND
from app.core.multi_database_middleware import get_db_session
from app.schemas import BoolResponse
from app.core.config import settings

router = APIRouter()


@router.get("/liveness",
            tags=["probes"],
            include_in_schema=False)
async def liveness(internal_liveness: str = Header(None)) -> BoolResponse:
    """
    serves as liveness probe for k8s
    If the container doesn't respond in the time specified it's restarted after x attempts!
    Specific header key/values are used to ensure nobody else can successfully communicate with these endpoints
    {'Internal-Liveness': '123123'}
    :param internal_liveness:
    :return:
    """
    if internal_liveness == settings.INTERNAL_LIVENESS:
        return BoolResponse(success=True)
    else:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=f"Not Found")


@router.get("/readiness",
            tags=["probes"],
            include_in_schema=False)
async def readiness(internal_readiness: str = Header(None),
                    db_session=Depends(get_db_session)) -> BoolResponse:
    """
    serves as readiness probe for k8s
    If a deployment occurs traffic won't be sent here until ready,
    this is useful for detecting containers that aren't ready yet, and for bad images, ensures we don't experience
    down time...
    Specific header key/values are used to ensure nobody else can successfully communicate with these endpoints
    {'Internal-Readiness': '123123'}
    :param internal_readiness:
    :param db_session:
    :return:
    """
    # TODO:// we should check our database connectivity here, if it's down then we raise err
    if internal_readiness == settings.INTERNAL_READINESS:
        return BoolResponse(success=True)
    else:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=f"Not Found")
