from pydantic import BaseModel

class ConfigForWeb(BaseModel):
    keycloakAuthUrl: str 
    keycloakRealm: str
    flag: bool