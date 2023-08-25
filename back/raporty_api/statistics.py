from collections import defaultdict
from back.raporty_api.date_conversion import convert_date
from back.raporty_api.units_names import get_singular_unit_name


class Statistics:
    def __init__(self, data: list) -> None:
        self.data = data
        self.places = self._places()

    def _places(self) -> list:
        places = []
        for report in self.data:
            places.extend(region.region for region in report.units)
        return list(set(places))

    # def departments_chart_data(self) -> dict:
    #     """Filtering data necessary for chart"""
    #     chart_data = {}
    #     for place in self.places:
    #         chart_values = {}
    #         for report in self.data:
    #             for region in report.units:
    #                 if region.region == place:
    #                     fixed_month = convert_date(report.date_created)
    #                     if region.region in chart_data and fixed_month in chart_data[region.region]:
    #                         chart_values[fixed_month] += 1
    #                     else:
    #                         chart_values[fixed_month] = 1
    #                     chart_data[place] = dict(
    #                         sorted(chart_values.items(), reverse=False))
    #         for key in reversed(list(chart_values.keys())):
    #             chart_values[key] = chart_values.pop(key)
    #         chart_data[place] = chart_values
    #     return chart_data

    def departments_chart_data(self) -> dict:
        """Filtering data necessary for chart"""
        chart_data = {}

        for place in self.places:
            chart_values = {}

            for report in self.data:
                for region in report.units:
                    if region.region == place:
                        fixed_month = convert_date(report.date_created)
                        chart_values[fixed_month] = chart_values.get(fixed_month, 0) + 1

            sorted_chart_values = dict(sorted(chart_values.items()))
            chart_data[place] = sorted_chart_values

        return chart_data

    @staticmethod
    def __rename(name: str) -> str:
        return get_singular_unit_name(name)

    def units_chart_data(self) -> dict:
        """Filtering reported items"""
        reported_units = {}
        total_units_sum = 0

        for place in self.places:
            elem = {}
            for report in self.data:
                for region in report.units:
                    if region.region == place:
                        fixed_name = self.__rename(region.unit)
                        elem[fixed_name] = elem.get(fixed_name, 0) + 1

            reported_units[place] = dict(
                sorted(elem.items(), key=lambda item: item[1]))
            reported_units['sum'] = reported_units.get('sum', 0) + sum(elem.values())
        return reported_units

    def users_chart_data(self) -> dict:
        """create dict with user as key and his raports as a list"""
        user_raports = {}
        for report in self.data:
            user_raports[report.author.username] = user_raports.get(report.author.username, 0) + 1

        return {'sum': len(self.data),
                'user_raports': user_raports}

    def pack_to_dict(self, chartData: dict, units: dict, user: dict) -> dict:
        """Collects data into dict"""
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
