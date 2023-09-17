from starlette.requests import Request
from core.config import settings

def getBaseUrl(request: Request):
    # print("__UTIL_____") #TODO
    # print(request.headers)
    # print("__")
    # print(request.url.netloc)
    # print("__")
    # print(settings.APP_RUN_IN_DOCKER)
    # print("__")
    # print(request.url)
    # if (
    #     "x-forwarded-host" in request.headers
    #     and "x-forwarded-port" in request.headers
    #     and request.headers["x-forwarded-port"] not in ("80", "443")
    #     and ":" not in request.headers["x-forwarded-host"]
    # ):
    #     # print("____X_FORWARDED_HOST_")
    #     return f"{settings.URL_SCHEME}://{request.headers['x-forwarded-host']}:{request.headers['x-forwarded-port']}"

    if (
        settings.APP_RUN_IN_DOCKER=='True' and
        "x-forwarded-host" in request.headers and 
        "x-forwarded-port" in request.headers
    ):
        return f"{settings.URL_SCHEME}://{request.headers['x-forwarded-host']}:{request.headers['x-forwarded-port']}"
    
    elif  (
        "x-forwarded-host" in request.headers       
        and ":" not in request.headers["x-forwarded-host"]
    ):
        # print("____X_FORWARDED_HOST_II")
        return f"{settings.URL_SCHEME}://{request.headers['x-forwarded-host']}{settings.DEFAULT_BASE_URL}"
    
    else:
        # print("____regular_URL___")
        return f"{settings.URL_SCHEME}://{request.url.netloc}"


def getLoginUrl(request: Request):
    return f"{getBaseUrl(request)}/api/v1/login"

def getLogoutUrl(request: Request):
    return f"{getBaseUrl(request)}/api/v1/logout"