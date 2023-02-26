from fastapi_sqlalchemy import db
import schema
from fastapi import APIRouter, Request, HTTPException, Security
from models import Raport, Unit, Plexi, Dekl, User
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from collections import defaultdict
from typing import List
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from auth_api.auth import Auth

auth_handler = Auth()
security = HTTPBearer()
raporty = APIRouter()


@raporty.get("/raports", response_model=List[schema.RaportsSmall])
async def root(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    print(token)
    print('PRZECHODZI')
    if(auth_handler.decode_token(token)):
        return db.session.query(Raport).order_by(
            Raport.date_created.desc()).all()
        


@raporty.get("/raports/{username}", response_model=List[schema.RaportsOut])
async def user_raports(username: str, credentials: HTTPAuthorizationCredentials = Security(security)):
    return db.session.query(Raport).join(User).filter(
        User.username == username).all()


@raporty.get("/raport/{raport_id}", response_model=schema.RaportsOut)
async def raport(raport_id: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        if (
            raport := db.session.query(Raport)
            .filter(Raport.id == raport_id)
            .first()
        ):
            return raport
        else:
            raise HTTPException(status_code=404, detail="not found")
    except SQLAlchemyError as e:
        return e


@raporty.get("/delete/{raport_id}")
async def delete_raport(raport_id: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        resoult = db.session.query(Raport).filter(
            Raport.id == raport_id).first()
        date = resoult.date_created
        db.session.delete(resoult)
        db.session.commit()
        return {'category': 'success',
                'message': f"Raport z dnia {date} został usunięty"
                }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Raport o numerze {raport_id} nie istnieje",
        ) from e


@raporty.put('/create/')
async def create_raport(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    form = await request.json()
    return fillFormAndRelpaceDb(form)
    # return fillFormAndRelpaceDb(form)


@raporty.put('/update/')
def update_raport(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    params = dict(request.query_params)
    return fillFormAndRelpaceDb(params['data'], params['raport_id'])


def fillFormAndRelpaceDb(form, raport_id=None):
    print(form)
    try:
        raport = db.session.query(Raport).filter(
            Raport.id == raport_id).first()
        # data = urllib.parse.parse_qs(form, keep_blank_values=True)
        author = db.session.query(User).filter_by(
            id=int(form['user_id'])).first()
        rap = Raport(author=author)
        to_update = [rap]
        for key, value in form.items():
            if value:
                match key:
                    case 'Stolarnia' | 'Drukarnia' | 'Bibeloty':
                        for each in value['units']:
                            print(value['text'])
                            data = Unit(unit=each, info=value['text'], region=key, raport=rap)
                        to_update.append(data)
                    case 'plexi':
                        data = Plexi(
                            plexi=value, raport=rap)
                        to_update.append(data)
                        
                match key.split('-')[0]:
                    case 'dekl':
                        data = Dekl(dekl=value, raport=rap,
                                         name=key.split('-')[1])
                        to_update.append(data)
                    
        print(to_update)
        
        if raport_id:
            message = f"zaktualizowano raport z dnia {raport.date_created}"
            db.session.delete(raport)
        else:
            message = 'dodano raport'
            db.session.add_all(to_update)

        db.session.commit()
        return {'category': 'success',
                'message': message
                }
    except SQLAlchemyError as e:
        return {'category': 'error',
                'message': e
                }


@raporty.get('/search/{searching}', response_model=List[schema.RaportsOut])
def search_raport(searching, credentials: HTTPAuthorizationCredentials = Security(security)):
    print(searching)
    return search(searching)


def search(query):
    try:
        return (
            db.session.query(Raport)
            .join(Unit)
            .order_by(Raport.date_created.desc())
            .filter(or_(Unit.unit == query, Unit.region == query))
            .all()
        )
    except SQLAlchemyError as e:
        return {'category': 'error',
                'message': e
                }


def search_statistics(temp_raports, query):
    elem = {}
    for raport in temp_raports:
        for regio in raport.units:
            if regio.region == query:
                if regio.unit in elem:
                    elem[regio.unit] += 1
                else:
                    elem[regio.unit] = 1

            elif regio.unit == query:
                if regio.unit in elem:
                    elem[regio.unit] += 1
                else:
                    elem[regio.unit] = 1

    return dict(sorted(elem.items(), key=lambda item: item[1], reverse=True))


@raporty.get('/statistics')
def statistics_raport(credentials: HTTPAuthorizationCredentials = Security(security)):
    resoults = db.session.query(Raport).order_by(
        Raport.date_created.desc()).all()
    response = statistics(resoults)
    return statistics(resoults)


def statistics(resoults):
    lab = defaultdict(list)
    user_raport = defaultdict(list)
    labels = defaultdict(list)
    values = defaultdict(list)
    units = {}
    month = ''
    for raport in resoults:
        if raport.author.username in user_raport:
            user_raport[raport.author.username] += 1
        else:
            user_raport[raport.author.username] = 1
        for regio in raport.units:
            match raport.date_created.strftime('%m'):
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

            lab[month].append(regio.region)

    units['stolarnia'] = search_statistics(resoults, 'stolarnia')
    units['drukarnia'] = search_statistics(resoults, 'drukarnia')
    units['bibeloty'] = search_statistics(resoults, 'bibeloty')
    for key, val in lab.items():
        labels['stolarnia'].append(key)
        values['stolarnia'].append(val.count('stolarnia'))
        labels['drukarnia'].append(key)
        values['drukarnia'].append(val.count('drukarnia'))
        labels['bibeloty'].append(key)
        values['bibeloty'].append(val.count('bibeloty'))
    for val in labels.values():
        val.reverse()
    for val in values.values():
        val.reverse()

    return {'chart': {
        'stolarnia': {
            'labels': labels['stolarnia'],
            'values': values['stolarnia'],
            'units': units['stolarnia'],
            'sum': sum(values['stolarnia'])
        },
        'drukarnia': {
            'labels': labels['drukarnia'],
            'values': values['drukarnia'],
            'units': units['drukarnia'],
            'sum': sum(values['drukarnia'])
        },
        'bibeloty': {
            'labels': labels['bibeloty'],
            'values': values['bibeloty'],
            'units': units['bibeloty'],
            'sum': sum(values['bibeloty'])
        },
    },
        'user_raport': user_raport,
        # 'resoults': resoults - wszystkie raporty - dla statystyk zbędne
    }


def units_statistics(temp_raports, query):
    elem = {}
    for raport in temp_raports:
        for regio in raport.units:
            if regio.region == query:
                if regio.unit in elem:
                    elem[regio.unit] += 1
                else:
                    elem[regio.unit] = 1

            elif regio.unit == query:
                if regio.unit in elem:
                    elem[regio.unit] += 1
                else:
                    elem[regio.unit] = 1

    return dict(sorted(elem.items(), key=lambda item: item[1], reverse=True))
