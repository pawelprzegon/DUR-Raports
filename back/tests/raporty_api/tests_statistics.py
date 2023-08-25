from back.raporty_api.statistics import Statistics
from collections import namedtuple
import pytest
import datetime

Unit = namedtuple('Unit', ['region', 'unit'])
User = namedtuple('User', ["username"])
Raport = namedtuple('Raport', ['units', "date_created", "author"])


@pytest.fixture
def fake_data_from_db() -> list:
    return [
        Raport(author=User(username="Paul"),
               units=[Unit(region="Drukarnia", unit='Mutohy'), Unit(region="Stolarnia", unit='Pilarki')],
               date_created=datetime.datetime(2023, 1, 1)),
        Raport(author=User(username="Adam"),
               units=[Unit(region="Bibeloty", unit='Laminarki'), Unit(region="Drukarnia", unit='Xeikony')],
               date_created=datetime.datetime(2023, 2, 1)),
        Raport(author=User(username="Paul"),
               units=[Unit(region="Stolarnia", unit='Zbijarki')],
               date_created=datetime.datetime(2023, 1, 1)),
    ]


@pytest.fixture
def fake_places() -> list:
    return ['Stolarnia', 'Bibeloty', 'Drukarnia']


def test_get_places_from_data_list(fake_data_from_db):
    statistics_data = Statistics(fake_data_from_db)
    assert statistics_data.places.sort() == ['Stolarnia', 'Bibeloty', 'Drukarnia'].sort()


def test_is_places_returns_a_list_type(fake_data_from_db):
    statistics_data = Statistics(fake_data_from_db)
    assert isinstance(statistics_data._places(), list)


def test_is_departments_chart_data_returned_dict(fake_data_from_db, fake_places):
    statistics_data = Statistics(fake_data_from_db)
    statistics_data.places = fake_places
    assert isinstance(statistics_data.departments_chart_data(), dict)


def test_departments_chart_data_response(fake_data_from_db, fake_places):
    expected_result = {
        "Drukarnia": {"styczeń 2023": 1, "luty 2023": 1},
        "Stolarnia": {"styczeń 2023": 2},
        "Bibeloty": {"luty 2023": 1}
    }
    statistics_data = Statistics(fake_data_from_db)
    statistics_data.places = fake_places
    assert statistics_data.departments_chart_data() == expected_result


def test_is_units_chart_data_returned_dict(fake_data_from_db):
    statistics_data = Statistics(fake_data_from_db)
    assert isinstance(statistics_data.units_chart_data(), dict)


def test_units_chart_data_response(fake_data_from_db, fake_places):
    statistics_data = Statistics(fake_data_from_db)
    statistics_data.places = fake_places
    assert statistics_data.units_chart_data() == {
        "Drukarnia": {
            "Mutoh": 1,
            "Xeikon": 1
        },

        "Stolarnia": {
            "Pilarka": 1,
            "Zbijarka": 1
        },
        "Bibeloty": {
            "Laminarka": 1
        },
        "sum": 5
    }


def test_is_users_chart_data_returned_dict(fake_data_from_db):
    statistics_data = Statistics(fake_data_from_db)
    assert isinstance(statistics_data.users_chart_data(), dict)


def test_users_chart_data_response(fake_data_from_db):
    statistics_data = Statistics(fake_data_from_db)
    assert statistics_data.users_chart_data() == {
        'sum': 3,
        'user_raports': {
            'Paul': 2,
            'Adam': 1
        }
    }
