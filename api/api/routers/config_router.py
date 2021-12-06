from fastapi import APIRouter, status
from core.config import settings
from ..schemas import ConfigForWeb

router = APIRouter(
    prefix="/config",
    tags=['Auth']
)
   

@router.get('', status_code=status.HTTP_200_OK, response_model=ConfigForWeb )
def getConfigForWeb():
    return {
        "keycloakAuthUrl":settings.OIDC_RP_PROVIDER_URL, 
        "keycloakRealm":settings.OIDC_RP_PROVIDER_REALM, 
        "flag":True
    }