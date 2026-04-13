import pytest
from datetime import datetime, timedelta

from models.booking_model import BookingModel, BookingDatesModel, BookingCasesModel
from models.interpreter_model import InterpreterModel
from models.court_location_model import CourtLocationModel
from api.schemas.booking_schema import BookingSearchRequestSchema
from api.repository.search_booking_transactions import search_booking

FILE_NUMBERS = [
    "2025: 68781-1-KA/2-KA",
    "5771-39605-1",
    "93394-2C",
    "F-45680",
    "24-12521",
    "FOS-P-F-25740",
    "3561:101187-1A",
    "3561:F19684",
    "274918-1-K",
    "3035:  113363-1",
    "EA85212658",
    "69054",
]


@pytest.fixture
def seed_bookings(db_session):
    """Insert one booking per FILE_NUMBERS entry and return the list of file strings."""
    loc = CourtLocationModel(id=1, name="Test Court")
    db_session.add(loc)

    interp = InterpreterModel(id=1, first_name="John", last_name="Doe", disabled=False)
    db_session.add(interp)
    db_session.flush()

    now = datetime.now()

    for idx, file_num in enumerate(FILE_NUMBERS, start=1):
        booking = BookingModel(id=idx, location_id=1, interpreter_id=1)
        db_session.add(booking)
        db_session.flush()

        date_entry = BookingDatesModel(
            booking_id=booking.id,
            date=now - timedelta(days=10),
            status="Pending",
            method_of_appearance="In-Person",
        )
        db_session.add(date_entry)
        db_session.flush()

        case = BookingCasesModel(
            booking_date_id=date_entry.id,
            file=file_num,
            method_of_appearance="In-Person",
            requested_by="Court",
            federal=False,
        )
        db_session.add(case)

    db_session.commit()
    return FILE_NUMBERS


def _files_from_results(results):
    """Extract the case file strings from a list of BookingModel results."""
    files = []
    for booking in results:
        for d in booking.dates:
            for c in d.cases:
                if c.file:
                    files.append(c.file)
    return sorted(files)


class TestSearchBookingByFileNumber:
    """
    Call search_booking() with various file inputs against real data in SQLite.
    The current apply_file_number uses startswith, so we assert prefix matches.
    """

    @pytest.mark.parametrize("file_input, expected_files", [
        ("68781",    ["2025: 68781-1-KA/2-KA"]),
        ("39605",    ["5771-39605-1"]),
        ("69054",    ["69054"]),
        ("69",       ["69054"]),
        ("687",      ["2025: 68781-1-KA/2-KA"]),
        ("87",       ["2025: 68781-1-KA/2-KA", "3561:101187-1A"]),
        ("396",      ["5771-39605-1"]),
        ("274",      ["274918-1-K"]),
        ("125",      ["24-12521"]),
        ("113",      ["3035:  113363-1"]),
        ("101",      ["3561:101187-1A"]),
        ("196",      ["3561:F19684"]),
        ("852",      ["EA85212658"]),
        # ── inputs that span multiple file numbers ────────────────────
        ("1",        ["2025: 68781-1-KA/2-KA", "5771-39605-1", "24-12521", "3561:101187-1A", "3561:F19684", "274918-1-K", "3035:  113363-1", "EA85212658"]),
        ("9",        ["5771-39605-1", "93394-2C", "3561:F19684", "274918-1-K", "69054"]),
        ("5771",     ["5771-39605-1"]),
        ("24",       ["24-12521"]),
        ("3561",     ["3561:101187-1A", "3561:F19684"]),
        # ── no match
        ("9999",     []),
        ("30",     ["3035:  113363-1"]),
    ])
    def test_search_by_file_number_input(self, db_session, seed_bookings, file_input, expected_files):
        request = BookingSearchRequestSchema(
            file=file_input,
            locationIds=None,
            interpreter=None,
            dates=None,
            isStartFromToday=False,
        )

        results = search_booking(request, db_session, username="test_admin")
        result_files = _files_from_results(results)

        print(f"\nfile_input={file_input!r}  →  matched {result_files}")

        assert result_files == sorted(expected_files)

    @pytest.mark.parametrize("file_input", [None, ""])
    def test_no_file_number_input_returns_all(self, db_session, seed_bookings, file_input):
        request = BookingSearchRequestSchema(
            file=file_input,
            locationIds=None,
            interpreter=None,
            dates=None,
            isStartFromToday=False,
        )

        results = search_booking(request, db_session, username="test_admin")
        result_files = _files_from_results(results)

        assert len(result_files) == len(FILE_NUMBERS)
