import logging
from core.config import settings
from datetime import datetime

from fastapi import APIRouter, status, HTTPException

from requests import Session
from requests.auth import HTTPBasicAuth
import requests
import json

from api.schemas.file_search_schema import CourtLevel, CourtClass

logger = logging.getLogger(__name__)

class JcInterfaceCalls:    

    def __init__(self):
        self.client_id = settings.EFILING_HUB_KEYCLOAK_CLIENT_ID
        self.client_secret = settings.EFILING_HUB_KEYCLOAK_SECRET
        self.token_base_url = settings.EFILING_HUB_KEYCLOAK_BASE_URL
        self.token_realm = settings.EFILING_HUB_KEYCLOAK_REALM
        self.api_base_url = settings.EFILING_HUB_API_BASE_URL
        self.access_token = None
        

    JC_INTERFACE_APPLICATION_CD = "A2A"
    # List of file permission codes
    FILE_PERMISSION_CODES = [
        "A", "Y", "T", "F", "C", "M", "L", "R", "B", "D", "E", "G", "H", 
        "N", "O", "P", "S", "V"
    ]
    
    @property
    def FILE_PERMISSIONS(self) -> str:
        """Returns URL-encoded JSON array of file permission codes."""
        encoded = requests.utils.quote(json.dumps(self.FILE_PERMISSION_CODES))
        return encoded

    def get_court_locations(self) -> {}:
        session = Session()
        session.auth = HTTPBasicAuth(settings.JC_INTERFACE_API_USERNAME, settings.JC_INTERFACE_API_PASSWORD) 
        
        response = session.get(settings.JC_INTERFACE_API_LOCATION_URL, timeout=5)
        if(response.status_code != 200):
            logger.error("JC Interface Endpoint doesn't respond.")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="JC Interface Endpoint doesn't respond.")
        return response.json()

    def get_court_locations_address(self) -> {}:        
        return self.get_courts()

    def get_courts(self):       
        url = f"{self.api_base_url}/courts"
        response = self._get_api(url, headers={})

        if response.status_code == 200:
            cso_locations = json.loads(response.text)
            locations = list()

            for location in cso_locations["courts"]:
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

    def get_file_search(self, is_criminal: bool, query_params: dict) -> dict:
        """
        Search for files in the JC Interface system.
        
        Args:
            is_criminal (bool): Whether to search criminal or civil files
            query_params (dict): Search parameters for the file search
            
        Returns:
            dict: JSON response from the API
            
        Raises:
            HTTPException: If the API request fails
        """
        session = Session()
        session.auth = HTTPBasicAuth(settings.JC_INTERFACE_API_FILE_USERNAME, settings.JC_INTERFACE_API_FILE_PASSWORD)
        
        session.headers.update({
            "requestAgencyIdentifierId": settings.JC_INTERFACE_FILE_AGENCY_ID,
            "requestPartId": settings.JC_INTERFACE_FILE_PART_ID,
            "applicationCd": self.JC_INTERFACE_APPLICATION_CD
        })
        
        search_params = query_params.copy()
        logger.info(f"jc_interface - Query params: {search_params}")
        
        if "fileNumberTxt" in search_params and search_params["fileNumberTxt"] and len(str(search_params["fileNumberTxt"]).strip()) > 0:
            original_file_number = search_params["fileNumberTxt"]
            sanitized_file_number = self.sanitize_file_number(str(original_file_number), is_criminal)
            search_params["fileNumberTxt"] = sanitized_file_number
            # logger.info(f"jc_interface - File number sanitized: '{original_file_number}' -> '{sanitized_file_number}'")
        
        search_mode = search_params.pop("searchMode", "FILENO")
        search_params.update({
            "searchMode": search_mode,
            "filePermissions": self.FILE_PERMISSIONS
        })

        file_type = "criminal" if is_criminal else "civil"
        base_url = f"{settings.JC_INTERFACE_API_FILE_URL}/files/{file_type}"
        
        if search_params:
            query_string = "&".join(
                f"{key}={value}" 
                for key, value in search_params.items() 
                if value is not None and value != "" and str(value).strip()
            )
            if query_string:
                base_url += f"?{query_string}"
                
        response = session.get(base_url, timeout=5)
        response_data = response.json()
        
        if "fileDetail" in response_data:
            for file in response_data["fileDetail"]:
                if "courtLevelCd" in file:
                    file["courtLevelCd"] = CourtLevel.to_display_name(file["courtLevelCd"])
                if "courtClassCd" in file:
                    file["courtClassCd"] = CourtClass.to_display_name(file["courtClassCd"])
                
                if "participant" in file and isinstance(file["participant"], list) and len(file["participant"]) > 1:
                    file["participant"].sort(key=lambda participant: participant.get("fullNm", "").lower())
            
            # Sort files by nextApprDt
            def sort_key(file):
                next_appr_dt = file.get("nextApprDt")
                if next_appr_dt is None or next_appr_dt == "":
                    return datetime.min
                try:
                    date_part = next_appr_dt.split(" ")[0]
                    return datetime.strptime(date_part, "%Y-%m-%d")
                except (ValueError, TypeError, IndexError):
                    return datetime.min
            
            response_data["fileDetail"].sort(key=sort_key, reverse=True)
        
        return response_data
    
    def get_file_appearances(self, is_criminal: bool, file_id: str, query_params: dict) -> dict:
        """
        Search for appearances of a file in the JC Interface system.
        
        Args:
            is_criminal (bool): Whether to search criminal or civil files
            file_id (str): The mdocJustinNo to search for appearances
            query_params (dict): Search parameters for the file search
            
        Returns:
            dict: JSON response from the API
            
        Raises:
            HTTPException: If the API request fails
        """
        session = Session()
        session.auth = HTTPBasicAuth(settings.JC_INTERFACE_API_FILE_USERNAME, settings.JC_INTERFACE_API_FILE_PASSWORD)
        
        session.headers.update({
            "requestAgencyIdentifierId": settings.JC_INTERFACE_FILE_AGENCY_ID,
            "requestPartId": settings.JC_INTERFACE_FILE_PART_ID,
            "applicationCd": self.JC_INTERFACE_APPLICATION_CD
        })
        
        search_params = query_params.copy()
        file_type = "criminal" if is_criminal else "civil"
        base_url = f"{settings.JC_INTERFACE_API_FILE_URL}/files/{file_type}/{file_id}/appearances"
        
        if search_params:
            query_string = "&".join(
                f"{key}={value}" 
                for key, value in search_params.items() 
                if value is not None and value != "" and str(value).strip()
            )
            if query_string:
                base_url += f"?{query_string}"
                
        response = session.get(base_url, timeout=5)
        response_data = response.json()
        
        if "appearanceDetail" in response_data and isinstance(response_data["appearanceDetail"], list):
            def sort_key(appearance):
                appearance_dt = appearance.get("appearanceDt")
                appearance_tm = appearance.get("appearanceTm")
                
                if appearance_dt is None or appearance_dt == "":
                    date_key = datetime.min
                else:
                    try:
                        date_part = appearance_dt.split(" ")[0]  # Get "2012-07-31"
                        date_key = datetime.strptime(date_part, "%Y-%m-%d")
                    except (ValueError, TypeError, IndexError):
                        date_key = datetime.min
                
                if appearance_tm is None or appearance_tm == "":
                    time_key = datetime.min.time()
                else:
                    try:
                        time_part = appearance_tm.split(" ")[1].split(".")[0]  # Get "09:00:00"
                        time_key = datetime.strptime(time_part, "%H:%M:%S").time()
                    except (ValueError, TypeError, IndexError):
                        time_key = datetime.min.time()
                
                return (-date_key.timestamp() if date_key != datetime.min else float('inf'), 
                        time_key if time_key != datetime.min.time() else datetime.max.time())
            
            response_data["appearanceDetail"].sort(key=sort_key)
        
        return response_data

    def _get_api(self, url, headers, params=None):
        if not self.access_token and not self._get_token():
            raise HTTPException(status_code=404, detail="EFH - Unable to get API Token")

        for try_number in range(1):
            if try_number > 0:
                self._get_token()
            headers = self._set_headers(headers)
            response = requests.get(url, headers=headers, params=params)
            logger.debug("EFHResources - Get API %d %s", response.status_code, response.text)
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

        response = requests.post(self._token_url(), headers=headers, data=payload, auth=auth)
        logger.debug("EFH - Get Token %d", response.status_code)
        if response.status_code == 200:
            response = response.json()
            if "access_token" in response:
                self.access_token = response["access_token"]
                return True
        return False

    def _token_url(self):
        return f"{self.token_base_url}/auth/realms/{self.token_realm}/protocol/openid-connect/token"
    
    def sanitize_file_number(self, file_number: str, is_criminal: bool) -> str:
        """
        Returns:
            str: The sanitized file number
            
        Examples:
            Civil:
                D-88-500 → 88-500
                C-47283 → 47283
            Criminal:
                263837-3-C → 263837
                263837-1 → 263837
                263837-2 → 263837
        """
        if not file_number or not isinstance(file_number, str):
            return file_number
        
        file_number = file_number.strip()
        
        if is_criminal:
            import re
            match = re.match(r'^(\d+)-\d+(-[A-Za-z]+)?$', file_number)
            if match:
                return match.group(1)
        else:
            import re
            match = re.match(r'^[A-Za-z]-(.+)$', file_number)
            if match:
                return match.group(1)
        
        return file_number
