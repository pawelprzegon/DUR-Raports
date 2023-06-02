import schema
from fastapi import APIRouter, Request, HTTPException, Security, status
from models import Raport, Unit, User
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from auth_api.auth import Auth
from starlette.responses import JSONResponse
from raporty_api.search import Search
from raporty_api.statistics import Statistics
from raporty_api.raports import Raports
from db import get_session
from fastapi_sqlalchemy import db

auth_handler = Auth()
security = HTTPBearer()
raporty = APIRouter()


@raporty.get("/raports/", response_model=List[schema.RaportsOut])
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


@raporty.get("/raport/{id}", response_model=schema.RaportsOut)
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


@raporty.get("/raports/{username}", response_model=List[schema.RaportsOut])
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


@raporty.get('/search/{searching}')
def search(searching: str, credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: search (raport(date), unit(Impale, Latex, Xeikony), region(Drukarnia, Stolarnia))
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        if searching.capitalize() == 'Ebs':
            query = searching.upper()
        else:
            query = searching.capitalize()

        try:
            if results := db.session.query(Unit).order_by(Unit.date_created.desc()).filter(
                    Unit.region == query).all():
                search = Search(results, query)
                chartData = search.chart_labels_and_values()
                units = search.get_raported_units()
                return search._pack_to_dict(chartData, units, query)

            elif results := db.session.query(Unit).order_by(Unit.date_created.desc()).filter(
                    Unit.unit == query).all():
                search = Search(results, query)
                chartData = search.chart_labels_and_values()
                units = search.get_raported_dates()
                return search._pack_to_dict(chartData, units, query)

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


@raporty.get('/statistics')
def statistics(credentials: HTTPAuthorizationCredentials = Security(security)):
    '''
    endpoint: show statistics
    Authorization needed: Barer token - sended as Header: ('Authorization': 'Bearer '+ token)
    '''
    token = credentials.credentials
    if (auth_handler.decode_token(token)):
        resoults = db.session.query(Raport).order_by(
            Raport.date_created.desc()).all()

        statistics = Statistics(resoults)
        chartData = statistics.chart_labels_and_values()
        units = statistics.get_raported_units()
        users = statistics.splitUsers()

        return statistics._pack_to_dict(chartData, units, users)


@raporty.put('/create/')
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


@raporty.put('/update/')
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


@raporty.delete("/delete/{id}")
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
