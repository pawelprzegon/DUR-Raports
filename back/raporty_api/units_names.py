FIRST_LVL_UNITS_NAMES = {
    'Pilarki': 'Pilarka',
    'Zbijarki': 'Zbijarka',
    'Xeikony': 'Xeikon',
    'Mutohy': 'Mutoh',
    'Impale': 'Impala',
    'Laminarki': 'Laminarka',
    'Ebsy': 'Ebs',
}


def get_singular_unit_name(units) -> str:
    return next(
        (val for key, val in FIRST_LVL_UNITS_NAMES.items() if key == units),
        units,
    )