import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = os.environ["DATABASE_URL"]
DB_TIMEOUT = os.environ["DB_TIMEOUT"]
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                       'connect_timeout': DB_TIMEOUT})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
SessionLocal.configure(bind=engine)
