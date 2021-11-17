import warnings
from app.core.config import settings
from app.schemas import LanguageResponse
from tests.ordered_test_helper import ordered
from tests.config import language_endpoint
from tests.unittest_functional_test_helper import ApiBaseTestCase

warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)


class TestLanguageController(ApiBaseTestCase):
    """
    This functional test ensures that the languages controller works as expected
    """
    @classmethod
    def setUpClass(cls) -> None:
        ApiBaseTestCase.setUpClass()
        ApiBaseTestCase.URL = f'http://localhost:{settings.PORT}'
        print(f'using url: {ApiBaseTestCase.URL}')

    @classmethod
    def tearDownClass(cls) -> None:
        ApiBaseTestCase.tearDownClass()

    def setUp(self) -> None:
        super().setUp()

    def tearDown(self) -> None:
        super().tearDown()

    @ordered
    def test_get_languages(self):
        url = self.get_url(f'{language_endpoint}')
        # TODO:// once secured add in the correct headers, likely just headers = {'Authorization': f'bearer: {access_token}'}
        response = TestLanguageController.session.get(url)
        assert response.status_code == 200
        languages = [LanguageResponse.parse_obj(x) for x in response.json()]
        assert len(languages) > 0

    @ordered
    def test_get_language_names(self):
        url = self.get_url(f'{language_endpoint}/names')
        # TODO:// once secured add in the correct headers, likely just headers = {'Authorization': f'bearer: {access_token}'}
        response = TestLanguageController.session.get(url)
        assert response.status_code == 200
        language_names = response.json()
        assert len(language_names) > 0

    # TODO:// add the create here
