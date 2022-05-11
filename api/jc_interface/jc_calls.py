import logging
from core.config import settings

from fastapi import APIRouter, status, HTTPException

from requests import Session
from requests.auth import HTTPBasicAuth
import requests

import json

logger = logging.getLogger(__name__)

class JcInterfaceCalls:    


    def get_court_locations(self) -> {}:
        session = Session()
        session.auth = HTTPBasicAuth(settings.JC_INTERFACE_API_USERNAME, settings.JC_INTERFACE_API_PASSWORD) 
        response = session.get(settings.JC_INTERFACE_API_LOCATION_URL, timeout=5)
        if(response.status_code != 200):
            logger.error("JC Interface Endpoint doesn't respond.")
            raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="JC Interface Endpoint doesn't respond.")
        return response.json()


    def get_court_locations_address(self) -> {}:        
        self.client_id = settings.EFILING_HUB_KEYCLOAK_CLIENT_ID
        self.client_secret = settings.EFILING_HUB_KEYCLOAK_SECRET
        self.token_base_url = settings.EFILING_HUB_KEYCLOAK_BASE_URL
        self.token_realm = settings.EFILING_HUB_KEYCLOAK_REALM
        self.api_base_url = settings.EFILING_HUB_API_BASE_URL
        self.access_token = None
        return self.get_courts()


    def get_courts(self):       
        
        url = f"{self.api_base_url}/courts"#?courtLevel=S"
        response = self._get_api(url, headers={})

        if response.status_code == 200:
            cso_locations = json.loads(response.text)
            locations = list()

            for location in cso_locations["courts"]:
                
                # {'id': 9067.0001, 'identifierCode': '1031', 'name': 'Campbell River Court', 'code': 'CAR', 'isSupremeCourt': True, 'address': {'addressLine1': '500 13th Ave.', 'addressLine2': None, 'addressLine3': None, 'postalCode': None, 'cityName': 'Campbell River', 'provinceName': 'British Columbia', 'countryName': 'Canada'}}
                # print(location)
                locations.append({
                    "name": location["name"],
                    "address_line1": location["address"]["addressLine1"],
                    "address_line2": location["address"]["addressLine2"],
                    "address_line3": location["address"]["addressLine3"],
                    "postal_code": location["address"]["postalCode"],
                    "city": location["address"]["cityName"],
                    "province": location["address"]["provinceName"],                    
                    "location_code": location["id"],
                    "short_description": location["identifierCode"],
                })

            return locations
        else:
            return None

    def _get_api(self, url, headers):
        if not self.access_token and not self._get_token():
            raise HTTPException(status_code=404, detail=f"EFH - Unable to get API Token")

        for try_number in range(1):
            if try_number > 0:
                self._get_token()
            headers = self._set_headers(headers)
            response = requests.get(url, headers=headers)
            logger.debug(
                "EFHResources - Get API %d %s", response.status_code, response.text
            )
            if response.status_code != 401:
                break
        return response
    
    def _set_headers(self, headers, bceid_guid=None, transaction_id=None):
        headers.update({"Authorization": f"Bearer {self.access_token}"})
        if transaction_id:
            headers.update({"X-Transaction-Id": transaction_id})
        if bceid_guid:
            headers.update({"X-User-Id": bceid_guid})
        return headers
    
    def _get_token(self):
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        payload = {"grant_type": "client_credentials"}
        auth = HTTPBasicAuth(self.client_id, self.client_secret)

        response = requests.post(
            self._token_url(), headers=headers, data=payload, auth=auth
        )
        logger.debug("EFH - Get Token %d", response.status_code)
        if response.status_code == 200:
            response = response.json()
            if "access_token" in response:
                self.access_token = response["access_token"]
                return True
        return False

    def _token_url(self):
        return f"{self.token_base_url}/auth/realms/{self.token_realm}/protocol/openid-connect/token"


     
