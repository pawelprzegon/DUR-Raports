from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime
Base = declarative_base()


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    email = Column(String(100), unique=True)
    username = Column(String(100), unique=True)
    password = Column(String(100))
    date_created = Column(DateTime(timezone=True),
                          default=datetime.date.today())
    raport = relationship('Raport', backref='author', lazy=True)

    def __repr__(self) -> str:
        return f"User('{self.username}', '{self.email}', '{self.date_created}', '{self.password}')"


class Raport(Base):
    __tablename__ = "raport"
    id = Column(Integer, primary_key=True)
    date_created = Column(DateTime(timezone=True),
                          default=datetime.date.today())
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    units = relationship('Unit', backref='raport', order_by="desc(Unit.region)",
                         lazy='joined', cascade="all, delete-orphan")
    dekl = relationship('Dekl', backref='raport',
                        lazy='joined', cascade="all, delete-orphan")
    plexi = relationship('Plexi', backref='raport',
                         lazy='joined', cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"Raport('{self.id}, {self.date_created}', '{self.author}', '{self.units}', '{self.dekl}', '{self.plexi}')"


class Unit(Base):
    __tablename__ = "unit"
    id = Column(Integer, primary_key=True)
    unit = Column(String(20), nullable=False)
    info = Column(String, nullable=False)
    region = Column(String(20), nullable=False)
    date_created = Column(DateTime(timezone=True),
                          default=datetime.datetime.utcnow)
    raport_id = Column(Integer, ForeignKey(
        'raport.id'), nullable=False)

    def __repr__(self) -> str:
        return f"Unit('{self.id}, {self.unit}', '{self.region}', '{self.date_created}')"


class Dekl(Base):
    __tablename__ = "dekl"
    id = Column(Integer, primary_key=True)
    adam = Column(String, nullable=False)
    pawel = Column(String, nullable=False)
    bartek = Column(String, nullable=False)
    date_created = Column(DateTime(timezone=True),
                          default=datetime.datetime.utcnow)
    raport_id = Column(Integer, ForeignKey(
        'raport.id'), nullable=False)

    def __repr__(self) -> str:
        return f"Dekl('{self.adam}, {self.pawel}, {self.bartek}')"


class Plexi(Base):
    __tablename__ = "plexi"
    id = Column(Integer, primary_key=True)
    printed = Column(Integer, nullable=False)
    wrong = Column(Integer, nullable=False)
    factor = Column(String, nullable=False)
    # plexi = Column(String, nullable=False)
    date_created = Column(DateTime(timezone=True),
                          default=datetime.datetime.utcnow)
    raport_id = Column(Integer, ForeignKey(
        'raport.id'), nullable=False)

    def __repr__(self) -> str:
        return f"Plexi('{self.printed}, {self.wrong}, {self.factor}')"
