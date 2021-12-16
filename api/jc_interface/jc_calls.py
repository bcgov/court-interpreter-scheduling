import logging
from core.config import settings

from requests import Session
from requests.auth import HTTPBasicAuth

logger = logging.getLogger(__name__)

class JcInterfaceCalls:    
    
    def get_court_locations(self) -> {}:
        session = Session()
        session.auth = HTTPBasicAuth(settings.JC_INTERFACE_API_USERNAME, settings.JC_INTERFACE_API_PASSWORD) 
        response = session.get(settings.JC_INTERFACE_API_LOCATION_URL, timeout=5)
        return response.json()

      
