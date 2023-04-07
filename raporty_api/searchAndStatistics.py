from collections import defaultdict

class Statistics:
    def __init__(self, data: list) -> None:
        self.data = data
        self.places = self._places()
        
               
    def _places(self) -> list:
        places = []
        for raport in self.data:
            places.extend(regio.region for regio in raport.units)
        return list(set(places))
        
    
    def chartLabelsAndValues(self) -> dict:
        chartData = {}
        for place in self.places:
            chartValues = {}
            for raport in self.data:
                for regio in raport.units:
                    if regio.region == place:
                        mnth = raport.date_created.strftime('%m')
                        if regio.region in chartData and mnth in chartData[regio.region]:
                            chartValues[mnth] += 1
                        else:
                            chartValues[mnth] = 1
                        chartData[place] = dict(sorted(chartValues.items(), reverse=False))
            for key in reversed(list(chartValues.keys())):
                chartValues[dateToStr(key)] = chartValues.pop(key) 
            chartData[place] = chartValues  

        return chartData
    
        
    def getRaportedUnits(self) -> dict:
        raportedUnits = {}
        for place in self.places:
            sum_ = 0
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
            raportedUnits[place] = self.proportionsRaportedUnits(raportedUnits[place], sum_)
            
        return raportedUnits

    def proportionsRaportedUnits(self, units: dict, sum_: int) -> dict:
        return {
            key: [value, f'{int(round(value / sum_ * 100, 0))}%']
            for key, value in units.items()
            if key != 'sum'
        }

        

    def splitUsers(self) -> dict:
        user_raport = defaultdict(list)
        for raport in self.data:
            if raport.author.username in user_raport:
                user_raport[raport.author.username] += 1
            else:
                user_raport[raport.author.username] = 1
        return user_raport
        

    def _packToDict(self, chartData: dict, units: dict, user_raport: dict) -> dict:
        
        places = ['Stolarnia', 'Drukarnia', 'Bibeloty']
        for each in places:
            if each not in chartData:
                chartData[each] = []
                units[each] = []

        return {'statistics': {
                    'stolarnia': {
                        'chart': chartData['Stolarnia'],
                        'items': units['Stolarnia'],
                    },
                    'drukarnia': {
                        'chart': chartData['Drukarnia'],
                        'items': units['Drukarnia'],
                    },
                    'bibeloty': {
                        'chart': chartData['Bibeloty'],
                        'items': units['Bibeloty'],

                    },
                },
                    'user_raport': user_raport,
                }
        
class Search:
    def __init__(self, data: list, searching: str) -> None:
        self.data = data
        self.searching = searching
    
    def chartLabelsAndValues(self) -> dict:
        chartData = {}
        chartValues = {}
        for unit in self.data:
            mnth = unit.date_created.strftime('%m')
            if self.searching in chartData and mnth in chartData[self.searching]:
                chartValues[mnth] += 1
            else:
                chartValues[mnth] = 1
            chartData[self.searching] = dict(sorted(chartValues.items(), reverse=False))
            
        for key in reversed(list(chartValues.keys())):
            chartValues[dateToStr(key)] = chartValues.pop(key) 
        chartData[self.searching] = chartValues  

        return chartData
    
      
    def getRaportedUnits(self) -> dict:
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
    
    def getRaportedDates(self) -> dict:
        elem = [{'id': unit.raport_id, 
                 'date': unit.date_created.strftime('%d-%m-%Y')} 
                for unit in self.data]
        
        return {self.searching: sorted(elem, key=lambda item: item['date'], reverse=False)}
    
    def _packToDict(self, chartData: dict, units: dict, searching: str) -> dict:
        return {
                'searching' : {
                    'query': searching,
                    'chart': chartData[searching],
                    'items': units[searching],
            }
        }   
    
        
        

def dateToStr(date: str) -> str:
        month = ''
        match date:
            case '01':
                month = 'sty'
            case '02':
                month = 'lut'
            case '03':
                month = 'mar'
            case '04':
                month = 'kwi'
            case '05':
                month = 'maj'
            case '06':
                month = 'cze'
            case '07':
                month = 'lip'
            case '08':
                month = 'sie'
            case '09':
                month = 'wrz'
            case '10':
                month = 'paz'
            case '11':
                month = 'lis'
            case '12':
                month = 'gru'
        return month