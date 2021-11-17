import unittest
import urllib3
import sys
import inspect
import warnings
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.core.multi_database_middleware import DBSession

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)) + '/../')
load_dotenv(os.path.join(BASE_DIR, ".env"))
warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)


class DbTestSession:
    db_session: Session = None

    def __init__(self):
        self.db_session = DBSession()

    def close(self):
        try:
            self.db_session.close()
        except Exception as exc:
            pass


class SqlAlchemyTestBase(unittest.TestCase):
    """
    a base class meant to be used by our style of unit/integration tests with the sql alchemy framework
    this allows us to test our db layer using integration testing without going thru the api
    """
    inner_db: DbTestSession = None
    db_session: Session = None

    @classmethod
    def setUpClass(cls) -> None:
        print('connecting')
        SqlAlchemyTestBase.inner_db = DbTestSession()
        SqlAlchemyTestBase.db_session = SqlAlchemyTestBase.inner_db.db_session

    @classmethod
    def tearDownClass(cls) -> None:
        print('disconnecting')
        SqlAlchemyTestBase.inner_db.close()

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

    def raise_not_implemented(self):
        call_frame = inspect.getouterframes(inspect.currentframe(), 2)[1][3]
        call_stack = inspect.stack()[1][3]
        assert False, f'test method {call_frame} not implemented'
