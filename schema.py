from pydantic import BaseModel
from datetime import date as date_type
from typing import List


class Unit(BaseModel):
    unit: str
    info: str
    region: str

    class Config:
        orm_mode = True


class Dekl(BaseModel):
    name: str
    dekl: str

    class Config:
        orm_mode = True


class Plexi(BaseModel):
    plexi: str

    class Config:
        orm_mode = True


class User(BaseModel):
    username: str
    id: int

    class Config:
        orm_mode = True


class Raport(BaseModel):
    id: int
    date_created: date_type
    author: User

    class Config:
        orm_mode = True


class RaportsOut(Raport):
    units: List[Unit]
    dekl: List[Dekl]
    plexi: List[Plexi]


class RaportsSmall(Raport):
    units: List[Unit]
