from raporty_api.date_conversion import convert_date
from collections import OrderedDict


class Search:
    def __init__(self, data: list, searching: str) -> None:
        self.data = data
        self.searching = searching

    def departaments(self) -> dict:
        '''Filtering data necessary for chart'''
        chartData = {}
        chartValues = {}
        for unit in self.data:
            fixed_mnth = convert_date(unit.date_created)
            if self.searching in chartData and fixed_mnth in chartData[self.searching]:
                chartValues[fixed_mnth] += 1
            else:
                chartValues[fixed_mnth] = 1
            chartData[self.searching] = dict(
                sorted(chartValues.items(), reverse=False))

        chartData[self.searching] = OrderedDict(
            reversed(list(chartValues.items())))
        print(chartData)
        return chartData

    def get_raported_units(self) -> dict:
        '''Filtering raported items'''
        elem = {}
        for unit in self.data:
            if unit.unit in elem:
                elem[unit.unit] += 1
            else:
                elem[unit.unit] = 1
        # return {
        #     self.searching: dict(
        #         sorted(elem.items(), key=lambda item: item[1], reverse=False)
        #     )}
        data = []
        [data.append({
            'name': key,
            'quantity': value}) for key, value in elem.items()]
        # for key, value in elem.items():
        #     data.append({
        #         'name': key,
        #         'quantity': value})
        print(data)
        return {self.searching: data}

    def units(self) -> dict:
        '''Filtering data necessary for chart'''
        chartData = {}
        chartValues = {}
        for unit in self.data:
            printer_name = f'{self.searching} {unit.number}'
            fixed_mnth = convert_date(unit.date_created)
            if self.searching in chartData and printer_name in chartData[self.searching]:
                if printer_name not in chartValues:
                    chartValues[printer_name] = {}
                if fixed_mnth not in chartValues[printer_name]:
                    chartValues[printer_name][fixed_mnth] = 0
                chartValues[printer_name][fixed_mnth] += 1
            else:
                chartValues[printer_name] = {fixed_mnth: 1}
            chartData[self.searching] = dict(
                sorted(chartValues.items(), reverse=True))

        for key in chartValues:
            chartValues[key] = dict(sorted(chartValues[key].items()))
        return dict(sorted(chartValues.items()))

    def get_raported_dates(self) -> dict:
        '''Filtering id's and created dates for each item'''
        data = {}
        for unit in self.data:
            key = f'{unit.unit} {unit.number}'
            if key not in data:
                data[key] = []
            data[key].append({
                'id': unit.raport_id,
                'date': unit.date_created.strftime('%d-%m-%Y')})
        # sorting each list by date
        for key in data:
            data[key] = sorted(
                data[key], key=lambda item: item['date'], reverse=False)
        return data

    def _pack_to_dict(self, chartData: dict, units: dict, query: str, searching: str) -> dict:
        statistics = {}
        for each in chartData:
            statistics[each] = {
                'chart': chartData[each],
                'items': units[each]
            }
        data = {'searching': searching,
                'statistics': statistics}

        print(data)
        return data
