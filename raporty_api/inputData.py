from fastapi_sqlalchemy import db
from models import Raport, Unit, Plexi, Dekl, User
from starlette.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status

class InputData:
    def __init__(self, form) -> None:
        self.form = form
        
    def fillFormAndRelpaceDb(self):
        try:
            if 'id' in self.form:
                raport = db.session.query(Raport).filter(
                    Raport.id == self.form['id']).first()
            author = db.session.query(User).filter_by(
                username=self.form['username']).first()
            rap = Raport(author=author)
            to_update = [rap]
            for key, value in self.form.items():
                print(key, value)
                if value:
                    match key:
                        case 'Stolarnia' | 'Drukarnia' | 'Bibeloty':
                            if 'units' in value and 'text' in value:
                                for each in value['units']:
                                    data = Unit(unit=each, info=value['text'], region=key, raport=rap)
                                to_update.append(data)
                                
                        case 'plexi':
                            printed, wrong, factor = self.getPlexiData(value)
                            data = Plexi(
                                printed=printed, wrong=wrong, factor=factor,  raport=rap)
                            to_update.append(data)
                            
                        case 'dekl':
                            adam, pawel, bartek = self.getDeklData(value)
                            data = Dekl(adam=adam, pawel=pawel, bartek=bartek, 
                                        raport=rap)
                            to_update.append(data)
                            
                        
                        
            print(to_update)
            
            if 'id' in self.form:
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
    
    
    def getPlexiData(self, data):
        for each in data:
            for key,value in each.items():
                match key:
                    case 'printed':
                        printed = value
                    case 'wrong':
                        wrong = value
                    case 'factor':
                        factor = value
        return printed, wrong, factor

    def getDeklData(self, data):
        adam, pawel, bartek = '', '', ''
        for each in data:
            for key,value in each.items():
                match key:
                    case 'Adam':
                        adam = value
                    case 'Pawel':
                        pawel = value
                    case 'Bartek':
                        bartek = value
        return adam, pawel, bartek
    
    


    