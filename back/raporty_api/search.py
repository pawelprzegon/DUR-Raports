from raporty_api.date_conversion import convert_date


class Search:
    def __init__(self, data: list, searching: str) -> None:
        self.data = data
        self.searching = searching

    def chart_labels_and_values(self) -> dict:
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

        for key in reversed(list(chartValues.keys())):
            chartValues[key] = chartValues.pop(key)
        chartData[self.searching] = chartValues

        return chartData

    def get_raported_units(self) -> dict:
        '''Filtering raported items'''
        elem = {}
        for unit in self.data:
            if unit.unit in elem:
                elem[unit.unit] += 1
            else:
                elem[unit.unit] = 1
        return {
            self.searching: dict(
                sorted(elem.items(), key=lambda item: item[1], reverse=False)
            )
        }

    def get_raported_dates(self) -> dict:
        '''Filtering id's and created dates for each item'''
        elem = [{'id': unit.raport_id,
                 'date': unit.date_created.strftime('%d-%m-%Y')}
                for unit in self.data]

        return {self.searching: sorted(elem, key=lambda item: item['date'], reverse=False)}

    def _pack_to_dict(self, chartData: dict, units: dict, searching: str) -> dict:
        '''Collects data into dict'''
        return {
            'searching': {
                'query': searching,
                'chart': chartData[searching],
                'items': units[searching],
            }
        }
