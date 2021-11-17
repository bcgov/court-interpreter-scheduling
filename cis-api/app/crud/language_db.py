import logging
from typing import Tuple, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_, insert, update, delete, inspect, asc, desc
from app.crud.abstract_db import AbstractDb
from app.models.cis import LanguageModel

logger = logging.getLogger(__name__)


class LanguageDb(AbstractDb):
    """
    this is a data access class to handle all language related things
    """
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def find_all(self) -> List[LanguageModel]:
        """
        returns all languages
        """
        return self.db_session.query(LanguageModel).order_by(asc(LanguageModel.name)).all()

    def get_language_names(self) -> List[str]:
        """
        returns all language names
        """
        all_languages = self.find_all()
        return [x.name for x in all_languages]

    def create(self, name: str) -> LanguageModel:
        """
        creates a new language name
        """
        # validate that the language doesn't already exist by lower case
        all_languages = self.get_language_names()
        found = len([x for x in all_languages if x.lower() == name.lower()]) > 0
        if found:
            raise ValueError(f'{name} already exists')
        else:
            m = LanguageModel(name=name)
            self.db_session.add(m)
            self.db_session.commit()
            return m
