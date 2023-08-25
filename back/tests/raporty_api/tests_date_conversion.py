import datetime
from back.raporty_api.date_conversion import convert_date
import pytest


def test_is_converted_datetime_string():
    date = datetime.datetime.now()
    assert isinstance(convert_date(date), str)


@pytest.mark.parametrize("month, year, expected", [
    (1, 2023, "styczeń 2023"),
    (2, 2023, "luty 2023"),
    (3, 2023, "marzec 2023"),
    (4, 2023, "kwiecień 2023"),
    (5, 2023, "maj 2023"),
    (6, 2023, "czerwiec 2023"),
    (7, 2023, "lipiec 2023"),
    (8, 2023, "sierpień 2023"),
    (9, 2023, "wrzesień 2023"),
    (10, 2023, "październik 2023"),
    (11, 2023, "listopad 2023"),
    (12, 2023, "grudzień 2023"),
])
def test_convert_date(month, year, expected):
    date = datetime.datetime(year, month, 15)
    assert convert_date(date) == expected
