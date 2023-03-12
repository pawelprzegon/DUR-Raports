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
            resoult = db.session.query(Raport).filter(
                Raport.id == raport_id).first()
            date = resoult.date_created
            db.session.delete(resoult)
            db.session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": f"Raport z dnia {date} został usunięty"})
        
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
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
                        data = Plexi(
                            plexi=value, raport=rap)
                        to_update.append(data)
                        
                match key.split('_')[0]:
                    case 'dekl':
                        data = Dekl(dekl=value, raport=rap,
                                         name=key.split('_')[1])
                        to_update.append(data)
                    
        print(to_update)
        
        if 'id' in form:
            print(raport)
            message = f"zaktualizowano raport z dnia {raport.date_created}"
            db.session.delete(raport)
        else:
            print('DOCIERAM TUTAJ')
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
def search_raport(searching, credentials: HTTPAuthorizationCredentials = Security(security)):
    
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.orig.args,
            ) from e


@raporty.get('/statistics')
def statistics_raport(credentials: HTTPAuthorizationCredentials = Security(security)):
    # sourcery skip: merge-dict-assign, move-assign
    units = {}
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        resoults = db.session.query(Raport).order_by(
            Raport.date_created.desc()).all()
        units['stolarnia'] = search_statistics(resoults, 'Stolarnia')
        units['drukarnia'] = search_statistics(resoults, 'Drukarnia')
        units['bibeloty'] = search_statistics(resoults, 'Bibeloty')
        labels = createLabels(resoults)
        users = splitUsers(resoults)
        
        return _packToDictAndSort(labels, units, users)
    
def search_statistics(temp_raports, query):
    elem = {}
    for raport in temp_raports:
        for regio in raport.units:
            print(regio.region, query)
            if (
                regio.region == query
                and regio.unit in elem
                or regio.region != query
                and regio.unit == query
                and regio.unit in elem
            ):
                print(1)
                elem[regio.unit] += 1
            elif regio.region == query or regio.unit == query:
                print(2)
                elem[regio.unit] = 1
                
    return dict(sorted(elem.items(), key=lambda item: item[1], reverse=True))

def splitUsers(resoults):
    user_raport = defaultdict(list)
    for raport in resoults:
        if raport.author.username in user_raport:
            user_raport[raport.author.username] += 1
        else:
            user_raport[raport.author.username] = 1
    return user_raport
    

def createLabels(resoults):
    lab = defaultdict(list)
    month = ''
    for raport in resoults:
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
    return lab


def _packToDictAndSort(lab, units, user_raport):
    labels = defaultdict(list)
    values = defaultdict(list)
    for key, val in lab.items():
        labels['stolarnia'].append(key)
        values['stolarnia'].append(val.count('Stolarnia'))
        labels['drukarnia'].append(key)
        values['drukarnia'].append(val.count('Drukarnia'))
        labels['bibeloty'].append(key)
        values['bibeloty'].append(val.count('Bibeloty'))
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
