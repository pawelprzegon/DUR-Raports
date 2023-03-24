from fastapi_sqlalchemy import db
import schema
from fastapi import APIRouter, Request, HTTPException, Security, status
from models import Raport, Unit, Plexi, Dekl, User
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from collections import defaultdict
from typing import List
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from auth_api.auth import Auth
from starlette.responses import JSONResponse
from datetime import datetime

auth_handler = Auth()
security = HTTPBearer()
raporty = APIRouter()


@raporty.get("/raports", response_model=List[schema.RaportsSmall])
async def root(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        return db.session.query(Raport).order_by(
            Raport.date_created.desc()).all()
    
        


@raporty.get("/raports/{username}", response_model=List[schema.RaportsOut])
async def user_raports(username: str, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        return db.session.query(Raport).join(User).filter(
            User.username == username).all()
   


@raporty.get("/raport/{raport_id}", response_model=schema.RaportsOut)
async def raport(raport_id: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        try:
            if (
                raport := db.session.query(Raport)
                .filter(Raport.id == raport_id)
                .first()
            ):
                print(raport)
                return raport
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="raport not found"
                    )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.orig.args,
            ) from e



@raporty.get("/delete/{raport_id}")
async def delete_raport(raport_id: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        try:
            if (resoult := db.session.query(Raport).filter(
                Raport.id == raport_id).first()):
                date = (resoult.date_created).strftime('%d-%m-%Y')
                shortDate = date
                db.session.delete(resoult)
                db.session.commit()
                return JSONResponse(status_code=status.HTTP_200_OK, content={"message": f"Raport z dnia {date} został usunięty"})
            
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": f"Nie znaleziono raportu nr: {raport_id}"})
        
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.orig.args,
            ) from e


@raporty.put('/create/')
async def create_raport(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        form_data = await request.json()
        return fillFormAndRelpaceDb(form_data)


@raporty.put('/update/')
async def update_raport(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        form_data = await request.json()
        return fillFormAndRelpaceDb(form_data)
    
def getPlexiData(data):
    for each in data:
        for key,value in each.items():
            match key:
                case 'Wydrukowano':
                    printed = value
                case 'Błędnie':
                    wrong = value
                case 'Współczynnik':
                    factor = value
    return printed, wrong, factor

def getDeklData(data):
    adam, pawel, bartek = '', '', ''
    for each in data:
        for key,value in each.items():
            match key:
                case 'Adam':
                    adam = value
                case 'Paweł':
                    pawel = value
                case 'Bartek':
                    bartek = value
    return adam, pawel, bartek


def fillFormAndRelpaceDb(form):
    try:
        if 'id' in form:
            raport = db.session.query(Raport).filter(
                Raport.id == form['id']).first()
        author = db.session.query(User).filter_by(
            username=form['username']).first()
        rap = Raport(author=author)
        to_update = [rap]
        for key, value in form.items():
            print(key, value)
            if value:
                match key:
                    case 'Stolarnia' | 'Drukarnia' | 'Bibeloty':
                        if 'units' in value and 'text' in value:
                            for each in value['units']:
                                data = Unit(unit=each, info=value['text'], region=key, raport=rap)
                            to_update.append(data)
                            
                    case 'plexi':
                        printed, wrong, factor = getPlexiData(value)
                        data = Plexi(
                            printed=printed, wrong=wrong, factor=factor,  raport=rap)
                        to_update.append(data)
                        
                    case 'dekl':
                        adam, pawel, bartek = getDeklData(value)
                        data = Dekl(adam=adam, pawel=pawel, bartek=bartek, 
                                    raport=rap)
                        to_update.append(data)
                        
                    
                    
        print(to_update)
        
        if 'id' in form:
            print(raport)
            message = f"zaktualizowano raport z dnia {(raport.date_created).strftime('%d-%m-%Y')}"
            db.session.delete(raport)
        else:
            message = 'dodano raport'
            db.session.add_all(to_update)

        db.session.commit()
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": message})

    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.orig.args,
            ) from e


@raporty.get('/search/{searching}', response_model=List[schema.RaportsOut])
def search_raport(searching: str, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        return search(searching.capitalize())


def search(query):
    print(query)
    try:
        return (
            db.session.query(Raport)
            .join(Unit)
            .order_by(Raport.date_created.desc())
            .filter(or_(Unit.unit == query, Unit.region == query))
            .all()
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.orig.args,
            ) from e


@raporty.get('/statistics')
def statistics_raport(credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        resoults = db.session.query(Raport).order_by(
            Raport.date_created.desc()).all()
        places = ['Stolarnia', 'Drukarnia', 'Bibeloty']
        chartData = chartLabelsAndValues(resoults, places)
        units = getRaportedUnits(resoults, places)
        users = splitUsers(resoults)
        
        return _packToDictAndSort(chartData, units, users)


def chartLabelsAndValues(resoults: list, places: list) -> dict:
    chartData = {}
    for place in places:
        chartValues = {}
        for raport in resoults:
            for regio in raport.units:
                if regio.region == place:
                    mnth = raport.date_created.strftime('%m')
                    if place in chartData and mnth in chartData[place]:
                        chartValues[mnth] += 1
                    else:
                        chartValues[mnth] = 1
                    chartData[place] = dict(sorted(chartValues.items(), reverse=False))
        for key in reversed(list(chartValues.keys())):
            chartValues[dateToStr(key)] = chartValues.pop(key) 
        chartData[place] = chartValues  

    return chartData

def dateToStr(date) -> str:
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
    
def getRaportedUnits(resoults: list, places: list) -> dict:
    raportedUnits = {}
    for place in places:
        elem = {}
        for raport in resoults:
            for regio in raport.units:
                if regio.region == place:
                    if 'sum' in elem:
                        elem['sum'] += 1
                    else:
                        elem['sum'] = 1
                        
                    if regio.unit in elem:
                        elem[regio.unit] += 1
                    else:
                        elem[regio.unit] = 1
        raportedUnits[place] = dict(
                sorted(elem.items(), key=lambda item: item[1], reverse=False))
        raportedUnits[place] = proportionsRaportedUnits(raportedUnits[place])
        
    return raportedUnits

def proportionsRaportedUnits(units: dict) -> dict:
    return {
        key: [value, str(int(round(value / units['sum'] * 100, 0))) +'%']
        for key, value in units.items()
        if key != 'sum'
    }

    

def splitUsers(resoults: list) -> dict:
    user_raport = defaultdict(list)
    for raport in resoults:
        if raport.author.username in user_raport:
            user_raport[raport.author.username] += 1
        else:
            user_raport[raport.author.username] = 1
    return user_raport
    




def _packToDictAndSort(chartData, units, user_raport):

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


# def units_statistics(temp_raports, query):
#     elem = {}
#     for raport in temp_raports:
#         for regio in raport.units:
#             if (
#                 regio.region == query
#                 and regio.unit in elem
#                 or regio.region != query
#                 and regio.unit == query
#                 and regio.unit in elem
#             ):
#                 elem[regio.unit] += 1
#             elif regio.region == query or regio.unit == query:
#                 elem[regio.unit] = 1

#     return dict(sorted(elem.items(), key=lambda item: item[1], reverse=True))
