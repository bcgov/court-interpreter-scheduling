import warnings
import sys
from app.crud.language_db import LanguageDb
from app.models.cis import LanguageModel
from tests.ordered_test_helper import ordered
from tests.unittest_sqlalchemy_test_helper import SqlAlchemyTestBase
from tests.config import new_lang_name

warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)


class TestLanguageDb(SqlAlchemyTestBase):
    @classmethod
    def setUpClass(cls) -> None:
        SqlAlchemyTestBase.setUpClass()

    @classmethod
    def tearDownClass(cls) -> None:
        SqlAlchemyTestBase.tearDownClass()

    def setUp(self) -> None:
        super().setUp()
        warnings.filterwarnings(action="ignore", module="requests", category=DeprecationWarning)
        warnings.filterwarnings(action="ignore", module="requests", category=ResourceWarning)
        warnings.filterwarnings(action="ignore", module="email", category=ResourceWarning)
        warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)
        warnings.filterwarnings(action="ignore", message="unverified", category=ResourceWarning)
        if not sys.warnoptions:
            warnings.simplefilter("ignore", ResourceWarning)
        self.language_db = LanguageDb(TestLanguageDb.db_session)

    def tearDown(self) -> None:
        super().tearDown()

    def _delete_dummy_lang(self):
        lang = TestLanguageDb.db_session.query(LanguageModel).where(LanguageModel.name == new_lang_name).first()
        if lang is not None:
            TestLanguageDb.db_session.delete(lang)
            TestLanguageDb.db_session.commit()
        assert TestLanguageDb.db_session.query(LanguageModel).where(LanguageModel.name == new_lang_name).first() is None

    @ordered
    def test_find_all(self):
        langs = self.language_db.find_all()
        assert len(langs) > 0

    @ordered
    def test_get_language_names(self):
        names = self.language_db.get_language_names()
        assert len(names) > 0

    @ordered
    def test_create_language(self):
        self._delete_dummy_lang()
        lang = self.language_db.create(new_lang_name)
        assert lang is not None
        assert lang.id is not None
        assert lang.created_at is not None
        assert lang.name == new_lang_name
        self._delete_dummy_lang()

    @ordered
    def test_create_duplicate_language(self):
        try:
            lang = self.language_db.create(new_lang_name)
            assert lang is not None
            lang = self.language_db.create(new_lang_name)
            assert lang is not None
            # this should never occur
            assert 1 != 1
        except ValueError as exc:
            pass
        finally:
            self._delete_dummy_lang()
