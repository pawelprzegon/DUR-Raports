FIRST_LVL_UNITS_NAMES = {
    'Pilarka': 'Pilarki',
    'Zbijarka': 'Zbijarki',
    'Xeikon': 'Xeikony',
    'Mutoh': 'Mutohy',
    'Impala': 'Impale',
    'Laminarka': 'Laminarki',
    'Ebs': 'Ebsy',
}


def get_singular_unit_name(units):
    for key, val in FIRST_LVL_UNITS_NAMES.items():
        if val == units:
            return key
    return units
