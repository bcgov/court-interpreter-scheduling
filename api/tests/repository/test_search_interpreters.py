from datetime import datetime

import pytest

from api.repository.search_interpreter_transactions import search_Interpreter
from api.schemas.interpreter_search_schema import (
	CrcDateRangeSchema,
	InterpreterSearchRequestSchema,
	InterpreterSearchResponseSchema,
)
from api.schemas.location_schema import LocationSchema
from models.court_location_model import CourtDistanceModel, CourtLocationModel
from models.interpreter_model import InterpreterModel
from models.language_model import InterpreterLanguageModel, LanguageModel


@pytest.fixture(autouse=True)
def force_admin_role(monkeypatch):
	monkeypatch.setattr(
		"api.repository.search_interpreter_transactions.check_user_roles",
		lambda _roles, _username, _db: True,
	)


@pytest.fixture
def seed_interpreters(db_session):
	language_english = LanguageModel(id=1, name="English")
	language_spanish = LanguageModel(id=2, name="Spanish")
	db_session.add_all([language_english, language_spanish])

	court = CourtLocationModel(
		id=10,
		name="Vancouver Law Courts",
		city="Vancouver",
		location_code="VAN",
		short_description="Downtown",
		timezone="America/Vancouver",
	)
	db_session.add(court)

	interpreters = [
		InterpreterModel(
			id=1,
			first_name="Alice",
			last_name="Stone",
			city="Vancouver",
			address="100 Main St",
			email="alice.stone@example.com",
			contract_valid=True,
			disabled=False,
			crc_check_date=datetime(2021, 6, 15),
		),
		InterpreterModel(
			id=2,
			first_name="Bob",
			last_name="Nguyen",
			city="Victoria",
			address="200 Oak St",
			email="bob.nguyen@example.com",
			contract_valid=False,
			disabled=False,
			crc_check_date=datetime(2020, 1, 10),
		),
		InterpreterModel(
			id=3,
			first_name="Carol",
			last_name="Smith",
			city="Vancouver",
			address="300 Pine St",
			email="carol.smith@example.com",
			contract_valid=True,
			disabled=False,
			crc_check_date=datetime(2021, 7, 1),
		),
		InterpreterModel(
			id=4,
			first_name="Disabled",
			last_name="Interpreter",
			city="Vancouver",
			contract_valid=True,
			disabled=True,
			crc_check_date=datetime(2021, 6, 20),
		),
	]
	db_session.add_all(interpreters)

	db_session.add_all(
		[
			InterpreterLanguageModel(interpreter_id=1, language_id=1, level=2, language="English"),
			InterpreterLanguageModel(interpreter_id=2, language_id=2, level=1, language="Spanish"),
			InterpreterLanguageModel(interpreter_id=3, language_id=2, level=3, language="Spanish"),
			InterpreterLanguageModel(interpreter_id=4, language_id=1, level=4, language="English"),
		]
	)

	db_session.add_all(
		[
			CourtDistanceModel(court_id=10, interpreter_id=1, court_code="VAN", distance=20000, duration=1200),
			CourtDistanceModel(court_id=10, interpreter_id=2, court_code="VAN", distance=50000, duration=2400),
			CourtDistanceModel(court_id=10, interpreter_id=3, court_code="VAN", distance=10000, duration=900),
		]
	)

	db_session.commit()
	return {
		"court": LocationSchema(
			id=10,
			name="Vancouver Law Courts",
			location_code="VAN",
			address_line1="800 Smithe St",
			address_line2="",
			city="Vancouver",
			postal_code="V6Z 2E1",
			created_at=datetime(2024, 1, 1, 12, 0, 0),
			updated_at=datetime(2024, 1, 1, 12, 0, 0),
			short_description="Downtown",
			latitude=49.2827,
			longitude=-123.1207,
			timezone="America/Vancouver",
		)
	}


def build_request(**overrides):
	payload = {
		"languageId": None,
		"level": None,
		"city": None,
		"dates": None,
		"name": None,
		"keywords": None,
		"active": None,
		"criminalRecordCheck": None,
		"courtAddr": None,
		"distanceLimit": False,
		"location": None,
		"limit": 50,
		"page": 1,
	}
	payload.update(overrides)
	return InterpreterSearchRequestSchema(**payload)


def _ids(search_result):
	return sorted(item.id for item in search_result.items)


class TestSearchInterpreters:
	def test_search_by_name_is_case_insensitive_and_supports_swapped_names(self, db_session, seed_interpreters):
		request = build_request(name="stone ALICE")

		response = search_Interpreter(request, db_session, "admin_user", InterpreterSearchResponseSchema)

		assert response.total == 1
		assert _ids(response) == [1]

	def test_non_admin_forces_only_active_interpreters(self, db_session, seed_interpreters, monkeypatch):
		monkeypatch.setattr(
			"api.repository.search_interpreter_transactions.check_user_roles",
			lambda _roles, _username, _db: False,
		)
		request = build_request(active=False)

		response = search_Interpreter(request, db_session, "standard_user", InterpreterSearchResponseSchema)

		assert response.total == 2
		assert _ids(response) == [1, 3]

	def test_search_by_language_and_level_filters_expected_interpreter(self, db_session, seed_interpreters):
		request = build_request(languageId=2, level=["3"])

		response = search_Interpreter(request, db_session, "admin_user", InterpreterSearchResponseSchema)

		assert response.total == 1
		assert _ids(response) == [3]

	def test_search_keywords_uses_all_terms(self, db_session, seed_interpreters):
		request = build_request(keywords="vancouver, stone")

		response = search_Interpreter(request, db_session, "admin_user", InterpreterSearchResponseSchema)

		assert response.total == 1
		assert _ids(response) == [1]

	def test_search_by_crc_date_applies_five_year_offset(self, db_session, seed_interpreters):
		request = build_request(
			criminalRecordCheck=CrcDateRangeSchema(
				startDate="2026-06-01T00:00:00",
				endDate="2026-06-30T23:59:59",
			)
		)

		response = search_Interpreter(request, db_session, "admin_user", InterpreterSearchResponseSchema)

		assert response.total == 1
		assert _ids(response) == [1]

	def test_search_by_distance_limit_filters_and_sets_court_distance(self, db_session, seed_interpreters):
		request = build_request(distanceLimit=True, location=seed_interpreters["court"])

		response = search_Interpreter(request, db_session, "admin_user", InterpreterSearchResponseSchema)

		assert response.total == 2
		assert _ids(response) == [1, 3]
		assert {item.id: item.court_distance for item in response.items} == {1: 20000, 3: 10000}

	def test_pagination_returns_requested_page_and_preserves_total(self, db_session, seed_interpreters):
		request = build_request(limit=1, page=2)

		response = search_Interpreter(request, db_session, "admin_user", InterpreterSearchResponseSchema)

		assert response.total == 3
		assert response.page == 2
		assert response.limit == 1
		assert len(response.items) == 1
