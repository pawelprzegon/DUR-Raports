import babel.dates

DATES_TABLE = {
    "stycznia": "styczeń",   "lutego": "luty",
    "marca": "marzec",       "kwietnia": "kwiecień",
    "maja": "maj",           "czerwca": "czerwiec",
    "lipca": "lipiec",       "sierpnia": "sierpień",
    "września": "wrzesień",  "października": "październik",
    "listopada": "listopad", "grudnia": "grudzień"
}


def convert_date(date):
    '''Converts dates into Polish s'''
    mnth = babel.dates.format_date(
        date, 'MMMM yyyy', locale='pl_PL')

    for k, v in DATES_TABLE.items():
        mnth = mnth.replace(k, v)
    return mnth
