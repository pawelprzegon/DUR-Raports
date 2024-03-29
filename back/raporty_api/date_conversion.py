import babel.dates
import datetime

DATES_TABLE = {
    "stycznia": "styczeń",   "lutego": "luty",
    "marca": "marzec",       "kwietnia": "kwiecień",
    "maja": "maj",           "czerwca": "czerwiec",
    "lipca": "lipiec",       "sierpnia": "sierpień",
    "września": "wrzesień",  "października": "październik",
    "listopada": "listopad", "grudnia": "grudzień"
}


def convert_date(date: datetime) -> str:
    """ Converts dates into Polish """
    month = babel.dates.format_date(
        date, 'MMMM yyyy', locale='pl_PL')

    for k, v in DATES_TABLE.items():
        month = month.replace(k, v)
    return month
