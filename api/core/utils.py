from starlette.requests import Request
from core.config import settings

def getBaseUrl(request: Request):
    print("__UTIL_____")
    print(request.headers)
    if (
        "x-forwarded-host" in request.headers
        and "x-forwarded-port" in request.headers
        and request.headers["x-forwarded-port"] not in ("80", "443")
        and ":" not in request.headers["x-forwarded-host"]
    ):
        print("__FORWARDED__")
        return f"{settings.URL_SCHEME}://{request.headers['x-forwarded-host']}:{request.headers['x-forwarded-port']}"
    else:
        print("__regular__")
        return f"{settings.URL_SCHEME}://{request.url.netloc}"


def getLoginUrl(request: Request):
    return f"{getBaseUrl(request)}/api/v1/login"

def getLogoutUrl(request: Request):
    return f"{getBaseUrl(request)}/api/v1/logout"