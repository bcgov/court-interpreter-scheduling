import logging
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import psycopg2
import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)) + '/../../../')
load_dotenv(os.path.join(BASE_DIR, ".env"))
sys.path.append(BASE_DIR)

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

config.set_main_option("sqlalchemy.url", os.environ["POSTGRES_DATABASE_URL"])
db_name = 'cis'

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")

from app.models import cis
target_metadata = cis.Base.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    try:
        with connectable.connect() as connection:
            context.configure(
                connection=connection, target_metadata=target_metadata
            )
            logger.info('running migration')
            with context.begin_transaction():
                context.run_migrations()

    except Exception as exc:
        if f'database "{db_name}" does not exist' in str(exc):
            print(f'database named {db_name} was not found, attempting to create')
            con_str = os.getenv('POSTGRES_DATABASE_URL').replace('+psycopg2', '').replace(f'/{db_name}', '/postgres')
            con = psycopg2.connect(con_str)
            con.autocommit = True
            cursor = con.cursor()
            print(f'creating database named {db_name}')
            cursor.execute(f'''create database {db_name}''')
            print(f'created database named {db_name}')
            print(f'resuming migration')
            con.close()
            run_migrations_online()
        else:
            raise exc


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
