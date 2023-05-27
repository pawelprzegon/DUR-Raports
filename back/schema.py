from pydantic import BaseModel, EmailStr
from datetime import date as date_type
from typing import List


class Unit(BaseModel):
    id = int
    unit: str
    info: str
    region: str

    class Config:
        orm_mode = True


class UnitSmall(Unit):
    unit: str
    info: str
    region: str

    class Config:
        fields = {'info': {'exclude': True}}


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
    id: int
    date_created: date_type
    author: User
    units: List[UnitSmall]

    class Config:
        fields = {'id': {'exclude': True},
                  #   'date_created': {'exclude': False},
                  'author': {'exclude': True}
                  }


class Register(BaseModel):
    email: str
    username: str
    password: str
    confirm: str


class Login(BaseModel):
    username: str
    password: str


class EmailSchema(BaseModel):
    email: List[EmailStr]


class ChangePassword(BaseModel):
    password: str
