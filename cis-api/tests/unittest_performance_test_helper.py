import unittest
import warnings
import time
import requests
import inspect
import urllib3
import timeit


class PerformanceBaseTestCase(unittest.TestCase):
    """
    A base class to be used by other performance tests
    """
    URL = None
    process = None
    SLEEP_SECS = 3
    DEFAULT_ACCEPTABLE_TIME = 5
    start = None
    end = None
    acceptable_time = DEFAULT_ACCEPTABLE_TIME
    exec_time = None
    session: requests.Session = None

    @classmethod
    def setUpClass(cls) -> None:
        PerformanceBaseTestCase.session = PerformanceBaseTestCase.session or requests.Session()
        time.sleep(PerformanceBaseTestCase.SLEEP_SECS)

    @classmethod
    def tearDownClass(cls) -> None:
        pass

    def setUp(self) -> None:
        urllib3.disable_warnings()
        warnings.simplefilter("ignore")
        PerformanceBaseTestCase.start = timeit.default_timer()
        PerformanceBaseTestCase.exec_time = None
        PerformanceBaseTestCase.end = None
        PerformanceBaseTestCase.acceptable_time = PerformanceBaseTestCase.DEFAULT_ACCEPTABLE_TIME

    def tearDown(self) -> None:
        PerformanceBaseTestCase.end = timeit.default_timer()
        PerformanceBaseTestCase.exec_time = PerformanceBaseTestCase.end - PerformanceBaseTestCase.start
        self.assert_exec_time(PerformanceBaseTestCase.exec_time, PerformanceBaseTestCase.acceptable_time)

    def raise_not_implemented(self):
        call_frame = inspect.getouterframes(inspect.currentframe(), 2)[1][3]
        call_stack = inspect.stack()[1][3]
        assert False, f'test method {call_frame} not implemented'

    def assert_exec_time(self, value, allowed):
        frame1 = inspect.getouterframes(inspect.currentframe(), 1)[1][3]
        call_frame = inspect.getouterframes(inspect.currentframe(), 2)[1][3]
        call_stack = inspect.stack()[1][3]
        call_stack2 = inspect.stack()[2][3]
        call_stack3 = inspect.stack()[1][0]
        call_stack4 = inspect.stack()[3][3]
        assert value <= allowed, f'Performance test {call_frame} took longer than allowed. Allowed: {allowed} is less than {value}'

    def get_url(self, relative_url: str) -> str:
        result = f'{PerformanceBaseTestCase.URL}{relative_url}'
        return result
