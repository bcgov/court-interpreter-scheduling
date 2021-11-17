import dateutil.parser
import uuid
import json
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from starlette.responses import JSONResponse
from datetime import datetime, timezone
import pendulum


def create_aliased_response(model: BaseModel) -> JSONResponse:
    return JSONResponse(content=jsonable_encoder(model, by_alias=True))


def str_to_bool(str_value):
    result = str(str_value).lower() in ("yes", "true", "t", "1")
    return result


def rchop(s, suffix):
    """removes the end of a string"""
    if suffix and s.endswith(suffix):
        return s[:-len(suffix)]
    return s


def get_current_dts():
    return pendulum.now()


def time_delta_in_days(days):
    import datetime
    return datetime.timedelta(days=days)


def timestamp_to_datetime(ts):
    import datetime
    return datetime.datetime.fromtimestamp(ts)


def from_iso_format(date_string):
    return dateutil.parser.isoparse(date_string)


def generate_unique_id():
    """
    gets the vanity version of a uuid4
    """
    result = uuid.uuid4().hex
    return result


def generate_api_key():
    """
    get the vanity version of a uuid4
    """
    result = uuid.uuid4().hex
    return result


def utc_to_local(utc_datetime) -> datetime:
    return utc_datetime.replace(tzinfo=timezone.utc).astimezone(tz=None)


def read_json(file_path) -> dict:
    with open(file_path) as f:
        return json.load(f)


def write_json(file_path, data: dict) -> None:
    with open(file_path, 'w') as f:
        json.dump(data, f)


def get_seeds_dir(file_path) -> str:
    """
    this is intended for use by alembic migrations and seeds, simply pass it __file__ from a migration
    and it will return back the seeds directory for use with loading seeds and such
    """
    import os
    return os.path.join(os.path.dirname(os.path.abspath(file_path)) + '/../../seeds/')


def get_test_seeds_dir(file_path) -> str:
    """
    this is intended for use by alembic migrations and test seeds, simply pass it __file__ from a migration
    and it will return back the seeds directory for use with loading seeds and such
    """
    import os
    return os.path.join(os.path.dirname(os.path.abspath(file_path)) + '/../../../../tests/seeds/')


def validate_api_key(api_key: str) -> str:
    if api_key is None or len(api_key.strip()) != 32:
        raise ValueError('invalid api key')
    return api_key.strip()
