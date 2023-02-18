import os
import uvicorn
from dotenv import load_dotenv
from fastapi_sqlalchemy import DBSessionMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from raporty_api.routers import raporty
from auth_api.routers import auth

from fastapi import FastAPI
from models import Base
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(".env")
SQLALCHEMY_DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
SessionLocal.configure(bind=engine)
session_local = SessionLocal()
app = FastAPI()

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(DBSessionMiddleware, db_url=os.environ["DATABASE_URL"])
Base.metadata.create_all(bind=engine)
app.include_router(raporty)
app.include_router(auth)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)



