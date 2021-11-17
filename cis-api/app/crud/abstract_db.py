import logging
from sqlalchemy.orm import Session
logger = logging.getLogger(__name__)


class AbstractDb:
    """
    this is an abstract data access class, to be inherited by all of the others
    """
    def __init__(self, db_session: Session):
        """
        constructor that accepts our database session
        :param db_session:
        """
        self.db_session = db_session        
