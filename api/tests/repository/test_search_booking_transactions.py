import pytest
from unittest.mock import MagicMock

from api.repository.search_booking_transactions import apply_file_number
from models.booking_model import BookingCasesModel


@pytest.fixture
def mock_bookings():
    """Create a mock query object that tracks chained calls."""
    query = MagicMock()
    query.join.return_value = query
    query.where.return_value = query
    return query


class TestApplyFileNumberExtraction:
    """Test that apply_file_number extracts the longest digit sequence and filters correctly."""

    @pytest.mark.parametrize("file_input, expected_digits", [
        ("A-1234-4-c", "1234"),
        ("A12344c",    "12344"),
        ("1234",       "1234"),
        ("1234-2-c",   "1234"),
        ("12-13456-3-C", "13456"),
        ("1234 c",     "1234"),
        ("A 1234-c",   "1234"),
        ("A1234-c",    "1234"),
        ("12 13456 3C", "13456"),
    ])
    def test_extracts_longest_digit_sequence(self, mock_bookings, file_input, expected_digits):
        result, digits = apply_file_number(mock_bookings, file_input)

        assert digits == expected_digits
        mock_bookings.join.assert_called_once_with(BookingCasesModel)
        where_args = mock_bookings.where.call_args
        assert where_args is not None, "Expected .where() to be called"


class TestApplyFileNumberPassthrough:
    """Test that apply_file_number returns bookings unchanged for empty/None input."""

    @pytest.mark.parametrize("file_input", [
        None,
        "",
    ])
    def test_returns_bookings_unchanged(self, mock_bookings, file_input):
        result, digits = apply_file_number(mock_bookings, file_input)

        assert result is mock_bookings
        assert digits is None
        mock_bookings.join.assert_not_called()
        mock_bookings.where.assert_not_called()

    def test_no_digits_returns_bookings_unchanged(self, mock_bookings):
        result, digits = apply_file_number(mock_bookings, "---ABC---")

        assert result is mock_bookings
        assert digits is None
        mock_bookings.join.assert_not_called()
