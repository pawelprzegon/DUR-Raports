import urllib.parse
from fastapi_sqlalchemy import db
import schema
from fastapi import APIRouter, Request
from models import Raport, Unit, Plexi, Dekl, User
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from fastapi_pagination import Page, paginate
from collections import defaultdict

raporty = APIRouter()


@raporty.get("/raports", response_model=Page[schema.RaportsOut])
async def root():
    resoults = db.session.query(Raport).order_by(
        Raport.date_created.desc()).all()
    return paginate(resoults)


@raporty.get("/raports/{username}", response_model=Page[schema.RaportsOut])
async def user_raports(username: str):
    resoults = db.session.query(Raport).join(User).filter(
        User.username == username).all()
    return paginate(resoults)


@raporty.get("/raport/{raport_id}", response_model=schema.RaportsOut)
async def raport(raport_id: int):
    return db.session.query(Raport).filter(
        Raport.id == raport_id).first()


@raporty.get("/delete/{raport_id}")
async def delete_raport(raport_id: int):
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
        return {'category': 'error',
                'message': e
                }


@raporty.put('/create/{form}')
def create_raport(form):
    return fillFormAndRelpaceDb(form)


@raporty.put('/update/')
def update_raport(request: Request):
    params = dict(request.query_params)
    return fillFormAndRelpaceDb(params['data'], params['raport_id'])


def fillFormAndRelpaceDb(form, raport_id=None):
    try:
        raport = db.session.query(Raport).filter(
            Raport.id == raport_id).first()
        data = urllib.parse.parse_qs(form, keep_blank_values=True)
        author = db.session.query(User).filter_by(
            id=int(data['user_id'][0])).first()
        rap = Raport(author=author)
        to_update = [rap]
        for fieldname, value in data.items():
            if value:
                match fieldname.split('_')[0]:
                    case 'stolarnia':
                        if fieldname.split('_')[1] != 'Text':
                            fieldname = Unit(unit=fieldname.split('_')[
                                1], info=data['stolarnia_Text'][0], region=fieldname.split('_')[0], raport=rap)
                            to_update.append(fieldname)
                    case 'drukarnia':
                        if fieldname.split('_')[1] != 'Text':
                            fieldname = Unit(unit=fieldname.split(
                                '_')[1], info=data['drukarnia_Text'][0], region=fieldname.split('_')[0], raport=rap)
                            to_update.append(fieldname)
                    case 'bibeloty':
                        if fieldname.split('_')[1] != 'Text':
                            fieldname = Unit(unit=fieldname.split(
                                '_')[1], info=data['bibeloty_Text'][0], region=fieldname.split('_')[0], raport=rap)
                            to_update.append(fieldname)
                    case 'plexi':
                        if 'plexi_' in data:
                            fieldname = Plexi(
                                plexi=data['plexi_Text'][0], raport=rap)
                            to_update.append(fieldname)
                    case 'dekl':
                        fieldname = Dekl(dekl=value[0], raport=rap,
                                         name=fieldname.split('_')[1])
                        to_update.append(fieldname)
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


@raporty.get('/search/', response_model=Page[schema.RaportsOut])
def update_raport(request: Request):
    params = dict(request.query_params)
    return paginate(search(params['query']))


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
def statistics_raport():
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
        'resoults': resoults
    }
