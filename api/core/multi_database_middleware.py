from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from core.config import settings
from sqlalchemy.ext.declarative import declarative_base

DeclarativeBase = declarative_base()

DATABASE_URL = "postgresql+psycopg2://"+\
                settings.DATABASE_USER+":"+\
                settings.DATABASE_PASSWORD+"@"+\
                settings.DB_SERVICE_HOST+":"+\
                settings.DB_SERVICE_PORT+"/"+\
                settings.DATABASE_NAME
# print("___DB_________")
# print(DATABASE_URL)

# declare our engines
engines = {
    'db_engine': create_engine(DATABASE_URL)
}

# create our session
DBSession: Session = sessionmaker()

# auto route sessions based on model declarative bases.
DBSession.configure(binds={DeclarativeBase: engines['db_engine']})


def get_db_session() -> Session:
    try:
        db_session = DBSession()
        yield db_session
    finally:
        db_session.close()
