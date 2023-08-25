from back.db import get_session
from back.models import Raport, Unit, Plexi, Dekl, User
from starlette.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status


class Raports:
    def __init__(self, form) -> None:
        self.form = form

    def create_new_model(self):
        '''Creating new raport from input form'''
        with get_session() as session:
            author = session.query(User).filter_by(
                username=self.form['username']).first()

        self.new_raport = Raport(author=author)
        self.new_raport_model = []

        for key, value in self.form.items():
            match key:
                case 'stolarnia' | 'drukarnia' | 'bibeloty':
                    print(type(value))
                    for k, v in value.items():
                        print(k)
                        data = Unit(
                            unit=k.split('_')[0].capitalize(), number=k.split('_')[1], info=v, region=key, raport=self.new_raport)
                    self.new_raport_model.append(data)

                case 'plexi':
                    data = Plexi(
                        printed=value['printed'], wrong=value['wrong'], factor=value['factor'],  raport=self.new_raport)
                    self.new_raport_model.append(data)

                case 'dekl':
                    data = Dekl(adam=value['Adam'], pawel=value['Pawel'], bartek=value['Bartek'],
                                raport=self.new_raport)
                    self.new_raport_model.append(data)

    def save_raport_in_db(self) -> JSONResponse:
        '''Commiting raport into db'''
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
        '''Updating raport in db'''
        try:
            with get_session() as session:
                if 'id' in self.form:
                    exist_raport = session.query(Raport).filter(
                        Raport.id == self.form['id']).first()
                    exist_date = exist_raport.date_created
                    message = f"zaktualizowano raport z dnia {(exist_date).strftime('%Y-%m-%d')}"
                    self.new_raport.date_created = exist_date
                    session.delete(exist_raport)
                    session.add_all(self.new_raport_model)
                    session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": message})

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=e,
            ) from e
