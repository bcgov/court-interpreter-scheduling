import json
import logging
from base64 import b64encode
from functools import wraps
from json.decoder import JSONDecodeError
from typing import Dict
from urllib.parse import quote
from fastapi.encoders import jsonable_encoder

import jwt
from jwt import DecodeError
from jwt import InvalidTokenError

import requests
from fastapi import Request
from starlette.responses import RedirectResponse

from .exceptions import OpenIDConnectException

logger = logging.getLogger(__name__)


class OpenIDConnect:
    well_known_pattern = "{}/auth/realms/{}/.well-known/openid-configuration"
    
    def __init__(
        self,
        hint: str,        
        host: str,
        realm: str,
        client_id: str,
        client_secret: str,
        scope: str = "openid email profile",        
    ) -> None:
        self.scope = scope
        self.client_id = client_id
        self.client_secret = client_secret
        self.hint = hint

        endpoints = self.to_dict_or_raise(requests.get(self.well_known_pattern.format(host, realm)))
        # print("______________________________ENDPOINTS____________________")
        # print(endpoints)
        self.issuer = endpoints.get("issuer")
        self.authorization_endpoint = endpoints.get("authorization_endpoint")
        self.token_endpoint = endpoints.get("token_endpoint")
        self.userinfo_endpoint = endpoints.get("userinfo_endpoint")
        self.jwks_uri = endpoints.get("jwks_uri")
        self.logout_uri = endpoints.get("end_session_endpoint")
        self.introspection_uri = endpoints.get("introspection_endpoint")

    def authenticate(
        self, code: str, callback_uri: str, include_user_info: bool = False
    ) -> Dict:

        auth_token = self.get_auth_token(code, callback_uri)
        id_token = auth_token.get("id_token")

        #Check Token Validity
        try:
            alg = jwt.get_unverified_header(id_token).get("alg")
        except DecodeError:
            logging.warning("Error getting unverified header in jwt.")
            raise OpenIDConnectException
    
        validated_token = self.obtain_validated_token(alg, id_token)
        #End Check Token Validity

        if not include_user_info:
            return auth_token.get("refresh_token")
    
        user_info = self.get_user_info(auth_token.get("access_token"))
        self.validate_sub_matching(validated_token, user_info)
    
        return user_info, auth_token.get("refresh_token")

    def get_auth_redirect_uri(self, callback_uri, session_key):
        return "{}?kc_idp_hint={}&response_type=code&scope={}&client_id={}&redirect_uri={}&state={}".format( 
            self.authorization_endpoint,
            self.hint,
            self.scope,
            self.client_id,
            quote(callback_uri),
            session_key
        )

    def get_auth_token(self, code: str, callback_uri: str) -> str:
        
        authstring = "Basic " + b64encode( f"{self.client_id}:{self.client_secret}".encode("utf-8") ).decode("utf-8")
        headers = {"Authorization": authstring}
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": callback_uri,
        }        
        response = requests.post( self.token_endpoint, data=data, headers=headers )
        return self.to_dict_or_raise(response)

    def get_refresh_token(self, refresh_token) -> str:
        
        authstring = "Basic " + b64encode( f"{self.client_id}:{self.client_secret}".encode("utf-8") ).decode("utf-8")
        headers = {"Authorization": authstring}
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
        }        
        response = requests.post( self.token_endpoint, data=data, headers=headers )        

        return self.to_dict_or_raise(response)
       

    def get_introspection_info(self, token) -> str:
        
        authstring = "Bearer " +token
        headers = {"Authorization": authstring}
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,            
            'token': token,
        } 
        response = requests.post(self.introspection_uri, data=data, headers=headers )
        if response.status_code ==200 :
            return self.to_dict_or_raise(response)
        else:
            return {'realm_access':{'roles':[]}}

    def obtain_validated_token(self, alg: str, id_token: str) -> Dict:
        if alg == "HS256":
            try:
                return jwt.decode(
                    id_token,
                    self.client_secret,
                    algorithms=["HS256"],
                    audience=self.client_id,
                )
            except InvalidTokenError:
                logger.error("An error occurred while decoding the id_token")
                raise OpenIDConnectException(
                    "An error occurred while decoding the id_token"
                )
        elif alg == "RS256":
            response = requests.get(self.jwks_uri)
            web_key_sets = self.to_dict_or_raise(response)
            jwks = web_key_sets.get("keys")
            public_key = self.extract_token_key(jwks, id_token)
            try:
                return jwt.decode(
                    id_token,
                    key=public_key,
                    algorithms=["RS256"],
                    audience=self.client_id,
                )
            except InvalidTokenError:
                logger.error("An error occurred while decoding the id_token")
                raise OpenIDConnectException(
                    "An error occurred while decoding the id_token"
                )
        else:
            raise OpenIDConnectException("Unsupported jwt algorithm found.")

    def extract_token_key(self, jwks: Dict, id_token: str) -> str:
        
        public_keys = {}
        for jwk in jwks:
            kid = jwk.get("kid")
            if not kid:
                continue
            public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk( json.dumps(jwk) )

        try:
            kid = jwt.get_unverified_header(id_token).get("kid")
        except DecodeError:
            logger.warning("kid could not be extracted.")
            raise OpenIDConnectException("kid could not be extracted.")

        return public_keys.get(kid)

    def get_user_info(self, access_token: str) -> Dict:
        bearer = "Bearer {}".format(access_token)
        headers = {"Authorization": bearer}
        response = requests.get(self.userinfo_endpoint, headers=headers)
        if response.status_code ==200 :
            return self.to_dict_or_raise(response)
        else:
            return {'sub':''}
        

    @staticmethod
    def validate_sub_matching(token: Dict, user_info: Dict) -> None:
        token_sub = ""  
        if token:
            token_sub = token.get("sub")
        if token_sub != user_info.get("sub") or not token_sub:
            logger.warning("Subject mismatch error.")
            raise OpenIDConnectException("Subject mismatch error.")

    @staticmethod
    def to_dict_or_raise(response: requests.Response) -> Dict:
        if response.status_code != 200:
            logger.error(f"Returned with status {response.status_code}.")
            raise OpenIDConnectException(
                f"Status code {response.status_code} for {response.url}."
            )
        try:
            return response.json()
        except JSONDecodeError:
            logger.error("Unable to decode json.")
            raise OpenIDConnectException(
                "Was not able to retrieve data from the response."
            )
