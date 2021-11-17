import unittest
import os
import urllib3
import sys
import inspect
import warnings
from app.core.config import settings

warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)

from fastapi.testclient import TestClient
from app.main import app


class ApiBaseTestCase(unittest.TestCase):
    """
    A base class to be used by other integration tests that do http requests, require auth/auth, and need the
        api server up and running!
    """
    client = TestClient(app)

    @classmethod
    def setUpClass(cls) -> None:
        ApiBaseTestCase.session = ApiBaseTestCase.client
        ApiBaseTestCase.URL = f'http://localhost:{settings.PORT}'

    @classmethod
    def tearDownClass(cls) -> None:
        pass

    def setUp(self) -> None:
        urllib3.disable_warnings()
        warnings.filterwarnings(action="ignore", module="requests", category=DeprecationWarning)
        warnings.filterwarnings(action="ignore", module="requests", category=ResourceWarning)
        warnings.filterwarnings(action="ignore", module="email", category=ResourceWarning)
        warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)
        warnings.filterwarnings(action="ignore", message="unverified", category=ResourceWarning)
        if not sys.warnoptions:
            warnings.simplefilter("ignore", ResourceWarning)

    def tearDown(self) -> None:
        pass

    @classmethod
    def get_python_env(cls):
        # this was missing, we need to setup the PYTHONPATH for our tests, the following two lines do that
        env = os.environ.copy()
        current_dir = os.getcwd()
        if 'PYTHONPATH' not in env or env['PYTHONPATH'] is None or len(env['PYTHONPATH']) < 1:
            env['PYTHONPATH'] = f"{current_dir}:{current_dir}/app"
        else:
            env['PYTHONPATH'] = f"{env['PYTHONPATH']}:{env['PYTHONPATH']}/app"
        return env

    def raise_not_implemented(self):
        call_frame = inspect.getouterframes(inspect.currentframe(), 2)[1][3]
        call_stack = inspect.stack()[1][3]
        assert False, f'test method {call_frame} not implemented'

    def get_url(self, relative_url: str) -> str:
        return ApiBaseTestCase.get_url(relative_url)

    # pydantic .3 doesn't have any sugar. Ugh, this means that using these classes is painful
    #   you have to do some round about things like convert an object instance to a dict using .dict() then encapsulate that in a json.dumps using the default handler to manage datetimes
    def datetime_handler(self, x):
        import datetime
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    def object_to_dict_to_json(self, o) -> dict:
        import json
        d = o.dict()
        r = json.dumps(d, default=self.datetime_handler)
        return r

    @staticmethod
    def get_url(relative_url: str) -> str:
        result = f'{ApiBaseTestCase.URL}{settings.API_PREFIX}{relative_url}'
        return result
