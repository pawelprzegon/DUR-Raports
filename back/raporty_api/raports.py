from db import get_session
from models import Raport, Unit, Plexi, Dekl, User
from starlette.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status


class Raports:
    def __init__(self, form) -> None:
        self.form = form

    def create_new_model(self):
        with get_session() as session:
            author = session.query(User).filter_by(
                username=self.form['username']).first()

        new_raport = Raport(author=author)
        self.new_raport_model = []

        for key, value in self.form.items():
            if value:
                match key:
                    case 'Stolarnia' | 'Drukarnia' | 'Bibeloty':
                        if 'units' in value and 'text' in value:
                            for each in value['units']:
                                data = Unit(
                                    unit=each, info=value['text'], region=key, raport=new_raport)
                            self.new_raport_model.append(data)

                    case 'plexi':
                        data = Plexi(
                            printed=value['printed'], wrong=value['wrong'], factor=value['factor'],  raport=new_raport)
                        self.new_raport_model.append(data)

                    case 'dekl':

                        data = Dekl(adam=value['Adam'], pawel=value['Pawel'], bartek=value['Bartek'],
                                    raport=new_raport)
                        self.new_raport_model.append(data)

    def save_raport_in_db(self) -> JSONResponse:
        try:
            with get_session() as session:
                message = 'dodano raport'
                session.add_all(self.new_raport_model)
                session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": message})

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.orig.args,
            ) from e

    def update_raport_in_db(self) -> JSONResponse:
        try:
            with get_session() as session:
                if 'id' in self.form:
                    exist_raport = session.query(Raport).filter(
                        Raport.id == self.form['id']).first()
                    message = f"zaktualizowano raport z dnia {(exist_raport.date_created).strftime('%d-%m-%Y')}"
                    session.delete(exist_raport)
                session.add_all(self.new_raport_model)
                session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": message})

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e.orig.args,
            ) from e
