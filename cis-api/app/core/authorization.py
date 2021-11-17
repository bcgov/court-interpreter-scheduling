from fastapi import Depends, Header, Request
from starlette.exceptions import HTTPException
from starlette.status import HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

could_not_validate_creds_msg = 'Could not validate credentials'
auth_scheme = HTTPBearer


# TODO:// get the proper object returning from here, and inject into secured controller methods
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> object:
    """
    does the current user have a valid active account? Is this a valid HTTPBearer?
    We do support our slight invalid variation on Authorization: bearer: "TOKEN" and Authorization: bearer "TOKEN"
    :param token:
    :type token:
    :return:
    :rtype:
    """
    try:
        if token is None or token.credentials is None or token.credentials == '':
            raise Exception(could_not_validate_creds_msg)

        # admin = KeycloakAdmin()
        # result = admin.get_user_from_token(token.credentials)
        # return result
        # TODO:// finish me, refer to this:
        # https://github.com/keycloak-client/keycloak-client/blob/main/examples/starlette/app.py
        return ''
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail=could_not_validate_creds_msg
        )
