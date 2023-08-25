import back.schema as schema
from fastapi import APIRouter, Request, HTTPException, Security, status
from back.models import Raport, Unit, User
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from back.auth_api.auth import Auth
from starlette.responses import JSONResponse
from back.raporty_api.search import Search
from back.raporty_api.statistics import Statistics
from back.raporty_api.raports import Raports
from back.db import get_session
from fastapi_sqlalchemy import db
from back.raporty_api.units_names import get_singular_unit_name

auth_handler = Auth()
security = HTTPBearer()
raporty = APIRouter()

departaments = ['drukarnia', 'stolarnia',
                'bibeloty', 'Drukarnia', 'Stolarnia', 'Bibeloty']


@raporty.get("/raports/", response_model=List[schema.RaportsOut], tags=['Raports'])
async def all_raports(credentials: HTTPAuthorizationCredentials = Security(security), quantity: int | None = None):
    """
     endpoint: list all raports
    """
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        if quantity:
            return db.session.query(Raport).order_by(
                Raport.date_created.desc()).limit(quantity).all()
        else:
            return db.session.query(Raport).order_by(
                Raport.date_created.desc()).all()


@raporty.get("/raport/{id}", response_model=schema.RaportsOut, tags=['Raports'])
async def single_raport(id: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: show a specific report
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        try:
            if (
                raport := db.session.query(Raport)
                .filter(Raport.id == id)
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


@raporty.get("/raports/{username}", response_model=List[schema.RaportsOut], tags=['Raports'])
async def user_raports(username: str, credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: show user's raports
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        return (
            db.session.query(Raport)
            .join(User)
            .filter(User.username == username)
            .all()
        )


@raporty.get('/search/{searching}', tags=['Raports'])
def search(searching: str, credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: search (raport(date), unit(Impale, Latex, Xeikony), region(Drukarnia, Stolarnia))
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):

        if searching not in departaments:
            if searching.capitalize() == 'Ebs':
                query = searching.upper()
            else:
                query = searching.capitalize()
            query = get_singular_unit_name(query)
        else:
            query = searching.lower()

        try:
            # szukanie po regionie
            if results := db.session.query(Unit).order_by(Unit.date_created.desc()).filter(
                    Unit.region == query).all():
                search = Search(results, query)
                chartData = search.departaments()
                units = search.get_raported_units()
                return search._pack_to_dict(chartData, units, query, searching.capitalize())
            # szukanie po urządzeniu
            elif results := db.session.query(Unit).order_by(Unit.date_created.desc()).filter(
                    Unit.unit == query).all():
                search = Search(results, query)
                chartData = search.units()
                units = search.get_raported_dates()
                return search._pack_to_dict(chartData, units, query, searching.capitalize())

            # szukanie po dacie
            elif results := db.session.query(Raport).filter(
                    Raport.date_created == query).first():
                return schema.Raport(id=results.id,
                                     date_created=results.date_created,
                                     author=results.author)

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Nie znaleziono '{searching}' w bazie danych",
            ) from e


@raporty.get('/statistics', tags=['Raports'])
def statistics(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    '''
    endpoint: show statistics
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if auth_handler.decode_token(token):
        results = db.session.query(Raport).order_by(
            Raport.date_created.desc()).all()
        statistics_data = Statistics(results)
        departments_chart_data = statistics_data.departments_chart_data()
        units_chart_data = statistics_data.units_chart_data()
        users_chart_data = statistics_data.users_chart_data()
        return statistics_data.pack_to_dict(departments_chart_data, units_chart_data, users_chart_data)


@raporty.put('/create/', tags=['Raports'])
async def create_raport(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: create raport
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        form_data = await request.json()
        create_new_raport = Raports(form_data)
        create_new_raport.create_new_model()
        return create_new_raport.save_raport_in_db()


@raporty.put('/update/', tags=['Raports'])
async def update_raport(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: update raport
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        form_data = await request.json()
        update_exist_raport = Raports(form_data)
        update_exist_raport.create_new_model()
        return update_exist_raport.update_raport_in_db()


@raporty.delete("/delete/{id}", tags=['Raports'])
async def delete_raport(id: int, credentials: HTTPAuthorizationCredentials = Security(security)):
    """
     endpoint: Delete raport
     Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    """
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        try:
            with get_session() as session:
                if (resoult := session.query(Raport).filter(
                        Raport.id == id).first()):
                    date = (resoult.date_created).strftime('%d-%m-%Y')
                    session.delete(resoult)
                    session.commit()
                    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": f"Raport z dnia {date} został usunięty"})

            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": f"Nie znaleziono raportu nr: {id}"})

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.orig.args,
            ) from e
