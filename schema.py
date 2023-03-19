from pydantic import BaseModel, EmailStr
from datetime import date as date_type
from typing import List





class Unit(BaseModel):
    unit: str
    info: str
    region: str

    class Config:
        orm_mode = True


class Dekl(BaseModel):
    adam: str
    pawel: str
    bartek: str

    class Config:
        orm_mode = True


class Plexi(BaseModel):
    printed: int
    wrong: int
    factor: str

    class Config:
        orm_mode = True
        

class UserOut(BaseModel):
    username: str
    date_created: date_type
    id: int
    
class UserIn(BaseModel):
    username: str
    password: str



class User(BaseModel):
    email: str
    username: str
    password: str
    date_created: date_type
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


class EmailSchema(BaseModel):
    email: List[EmailStr]
