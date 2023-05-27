import os
import uvicorn
from fastapi_sqlalchemy import DBSessionMiddleware
from raporty_api.routers import raporty
from auth_api.routers import auth
from fastapi import FastAPI
from models import Base
from fastapi.middleware.cors import CORSMiddleware
from db import engine
from descriptions import description, tags_metadata


def include_routers(app):
    app.include_router(raporty)
    app.include_router(auth)


def include_middlewares(app):
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
    Base.metadata.create_all(bind=engine)


def start_application():
    app = FastAPI(
        openapi_tags=tags_metadata,
        title="Artgeist RAPORTS",
        description=description,
        version="0.1.0",
        contact={
            "name": "Paweł Przegoń",
            "email": "p.przegon@artgeist.com",
        }
    )
    include_routers(app)
    include_middlewares(app)
    create_tables()
    return app


app = start_application()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
