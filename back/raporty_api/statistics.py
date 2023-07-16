from collections import defaultdict
from raporty_api.date_conversion import convert_date


class Statistics:
    def __init__(self, data: list) -> None:
        self.data = data
        self.places = self._places()

    def _places(self) -> list:
        places = []
        for raport in self.data:
            places.extend(regio.region for regio in raport.units)
        return list(set(places))

    def chart_labels_and_values(self) -> dict:
        '''Filtering data necessary for chart'''
        chartData = {}
        for place in self.places:
            chartValues = {}
            for raport in self.data:
                for regio in raport.units:
                    if regio.region == place:
                        fixed_mnth = convert_date(raport.date_created)
                        if regio.region in chartData and fixed_mnth in chartData[regio.region]:
                            chartValues[fixed_mnth] += 1
                        else:
                            chartValues[fixed_mnth] = 1
                        chartData[place] = dict(
                            sorted(chartValues.items(), reverse=False))
            for key in reversed(list(chartValues.keys())):
                chartValues[key] = chartValues.pop(key)
            chartData[place] = chartValues

        return chartData

    def get_raported_units(self) -> dict:
        '''Filtering raported items'''
        raportedUnits = {}
        sum_ = 0
        for place in self.places:
            elem = {}
            for raport in self.data:
                for regio in raport.units:
                    if regio.region == place:
                        sum_ += 1

                        if regio.unit in elem:
                            elem[regio.unit] += 1
                        else:
                            elem[regio.unit] = 1
            raportedUnits[place] = dict(
                sorted(elem.items(), key=lambda item: item[1], reverse=False))
        raportedUnits['sum'] = sum_
        # procentage usage of raported unit below (current unused)
        # raportedUnits[place] = self.proportions_raported_units(
        #     raportedUnits[place], sum_)

        return raportedUnits

    def proportions_raported_units(self, units: dict, sum_: int) -> dict:
        '''Creting a dict with list as value'''
        return {
            key: [value, f'{int(round(value / sum_ * 100, 0))}%']
            for key, value in units.items()
            if key != 'sum'
        }

    def split_users(self) -> dict:
        '''create dict with user as key and his raports as a list'''
        sum_users_raports = 0
        user_raports = defaultdict(list)
        for raport in self.data:
            sum_users_raports += 1
            if raport.author.username in user_raports:
                user_raports[raport.author.username] += 1
            else:
                user_raports[raport.author.username] = 1
        return {'sum': sum_users_raports,
                'user_raports': user_raports}

    def _pack_to_dict(self, chartData: dict, units: dict, user: dict) -> dict:
        '''Collects data into dict'''
        places = ['stolarnia', 'drukarnia', 'bibeloty']
        for each in places:
            if each not in chartData:
                chartData[each] = []
                units[each] = []

        return {'statistics': {
            'stolarnia': {
                'chart': chartData['stolarnia'],
                'items': units['stolarnia'],
            },
            'drukarnia': {
                'chart': chartData['drukarnia'],
                'items': units['drukarnia'],
            },
            'bibeloty': {
                'chart': chartData['bibeloty'],
                'items': units['bibeloty'],

            },
        },
            'user': user,
            'sum_all_raports': units['sum']
        }
