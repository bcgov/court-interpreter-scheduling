from collections.abc import Iterable
from datetime import datetime, timezone
from pydantic import BaseConfig, BaseModel

from fastapi.openapi.constants import REF_PREFIX
from fastapi.openapi.utils import (
    validation_error_definition,
    validation_error_response_definition,
)
from starlette.exceptions import HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY


async def http_error_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse({"errors": [exc.detail]}, status_code=exc.status_code)


async def http_422_error_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Handler for 422 error to transform default pydantic error object to gothinkster format
    """

    # TODO:// adjust these so they're not following gothinkster format,
    #  I prefer {'error': 'name of error', 'message': 'error message'}
    errors = {"body": []}

    if isinstance(exc.detail, Iterable) and not isinstance(
        exc.detail, str
    ):  # check if error is pydantic's model error
        for error in exc.detail:
            error_name = ".".join(
                error["loc"][1:]
            )  # remove 'body' from path to invalid element
            errors["body"].append({error_name: error["msg"]})
    else:
        errors["body"].append(exc.detail)

    return JSONResponse({"errors": errors}, status_code=HTTP_422_UNPROCESSABLE_ENTITY)


validation_error_definition["properties"] = {
    "body": {"title": "Body", "type": "array", "items": {"type": "string"}}
}

validation_error_response_definition["properties"] = {
    "errors": {
        "title": "Errors",
        "type": "array",
        "items": {"$ref": REF_PREFIX + "ValidationError"},
    }
}


class SentryWrappedException(Exception):
    original_exception: Exception
    user_id: str
    message: str


class PayloadValidationError(BaseModel):
    class Config(BaseConfig):
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc)
            .isoformat()
            .replace("+08:00", "Z")
        }
    error: str
    message: str


class InvalidUserCredentials(Exception):
    pass


class UnknownError(Exception):
    pass


class InvalidToken(Exception):
    pass
