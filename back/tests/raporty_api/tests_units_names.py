from back.raporty_api.units_names import get_singular_unit_name
import pytest


def test_is_returned_value_string():
    assert isinstance(get_singular_unit_name("Pilarki"), str)


@pytest.mark.parametrize("unit, expects", [
    ('Pilarki', 'Pilarka'),
    ('Zbijarki', 'Zbijarka'),
    ('Xeikony', 'Xeikon'),
    ('Mutohy', 'Mutoh'),
    ('Impale', 'Impala'),
    ('Laminarki', 'Laminarka'),
    ('Ebsy', 'Ebs'),
])
def test_is_func_returning_right_unit_name(unit, expects):
    assert get_singular_unit_name(unit) == expects
