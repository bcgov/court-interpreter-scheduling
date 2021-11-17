import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models.cis import Base as DeclarativeBase
from dotenv import load_dotenv

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)) + '/../../')
load_dotenv(os.path.join(BASE_DIR, ".env"))

# declare our engines
engines = {
    'db_engine': create_engine(os.environ["POSTGRES_DATABASE_URL"])
}

# create our session
DBSession: Session = sessionmaker()

# auto route sessions based on model declarative bases.
DBSession.configure(binds={DeclarativeBase: engines['db_engine']})


def get_db_session() -> Session:
    """
    get our db session generator
    :return:
    """
    try:
        db_session = DBSession()
        yield db_session
    finally:
        db_session.close()
