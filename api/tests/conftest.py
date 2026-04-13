import re as _re
import sys
import os
import types
from unittest.mock import MagicMock

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import ENUM as pgEnum

# ── sys.path ──────────────────────────────────────────────────────────────────
_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

# Clear cached 'api' module so it resolves from the correct path
for _mod in ("api", "api.schemas"):
    sys.modules.pop(_mod, None)

# ── Patch core modules before any project imports touch them ──────────────────
_fake_config = types.ModuleType("core.config")
_fake_config.settings = MagicMock()
sys.modules["core.config"] = _fake_config

_Base = declarative_base()

_fake_mw = types.ModuleType("core.multi_database_middleware")
_fake_mw.DeclarativeBase = _Base
sys.modules["core.multi_database_middleware"] = _fake_mw

# ── Register all model tables with Base.metadata ──────────────────────────────
import models.booking_model       # noqa: F401, E402
import models.interpreter_model   # noqa: F401, E402
import models.court_location_model # noqa: F401, E402
import models.language_model      # noqa: F401, E402
import models.pdf_model           # noqa: F401, E402
import models.user_model          # noqa: F401, E402
import models.role_model          # noqa: F401, E402
import models.oidc_model          # noqa: F401, E402
import models.geo_status_model    # noqa: F401, E402

# ── Compile PostgreSQL ENUM as VARCHAR on SQLite ──────────────────────────────
@compiles(pgEnum, "sqlite")
def _compile_pg_enum(element, compiler, **kw):
    return "VARCHAR"


# ── Fixtures ──────────────────────────────────────────────────────────────────
@pytest.fixture
def db_session():
    """In-memory SQLite session with all tables created."""
    engine = create_engine("sqlite:///:memory:")

    @event.listens_for(engine, "connect")
    def _register_sqlite_functions(dbapi_conn, _):
        # regexp(pattern, value) — used by SQLAlchemy's regexp_match() on SQLite
        dbapi_conn.create_function("regexp", 2,
            lambda pattern, value: bool(_re.search(pattern, value)) if value else False)
        # strpos(string, substring) — mirrors PostgreSQL's strpos(); SQLite has instr() but not strpos()
        dbapi_conn.create_function("strpos", 2,
            lambda s, sub: (s.index(sub) + 1) if s and sub in s else 0)

    _Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
