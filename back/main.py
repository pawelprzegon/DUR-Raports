import os
import uvicorn
from sqlalchemy import inspect
from fastapi_sqlalchemy import DBSessionMiddleware
from raporty_api.routers import raporty
from auth_api.routers import auth
from fastapi import FastAPI
from models import Base, User, Raport, Unit, Dekl, Plexi
from fastapi.middleware.cors import CORSMiddleware
from db import engine
from descriptions import description, tags_metadata

table_names = [User.__tablename__, Raport.__tablename__,
               Unit.__tablename__, Dekl.__tablename__, Plexi.__tablename__]


def include_routers(app):
    '''Including routes form different modules into app'''
    app.include_router(raporty)
    app.include_router(auth)


def include_middlewares(app):
    '''Include middlewares Session and CORS'''
    app.add_middleware(DBSessionMiddleware, db_url=os.environ["DATABASE_URL"])
    CORS_URL = os.environ["CORS_URL"]
    origins = [CORS_URL]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["POST", "GET", "PUT", "DELETE"],
        allow_headers=["*"],
    )


def create_tables():
    '''Creating tables in db'''
    Base.metadata.create_all(bind=engine)


def check_tables_exist():
    '''Checking if db have any tables'''
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return not (lacking_table := list(set(table_names) - set(tables)))


def create_tables_if_not_exists():
    '''Creates tables if there is no tables in db'''
    if not check_tables_exist():
        create_tables()


def start_application():
    '''Creating Fastapi app with configuration'''
    app = FastAPI(
        openapi_tags=tags_metadata,
        title="Artgeist RAPORTS",
        description=description,
        version="0.1.0",
        swagger_ui_parameters={"defaultModelsExpandDepth": -1},
        contact={
            "name": "Paweł Przegoń",
            "email": "p.przegon@artgeist.com",
        }
    )
    include_routers(app)
    include_middlewares(app)
    create_tables_if_not_exists()
    return app


app = start_application()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
