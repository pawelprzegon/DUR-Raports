from back.raporty_api.raports import Raports
from back.models import User
from unittest.mock import patch
from unittest import TestCase
import pytest
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

class TestRaports(TestCase):

    @pytest.fixture(scope="module")
    def db_session(self):
        url = URL.create(
            drivername="postgresql",
            username="coderpad",
            host="/tmp/postgresql/socket",
            database="coderpad"
        )

        engine = create_engine(url)
        Session = sessionmaker(bind=engine)

        Base = declarative_base()
        Base.metadata.create_all(engine)
        session = Session()
        yield session
        session.rollback()
        session.close()

    @pytest.fixture(scope="module")
    def valid_author(self):
        valid_author = User(
            email="aybak_email@gmail.com",
            username="testUser",
            password="password",
            date_created='2023-01-01'
        )
        return valid_author


    def test_get_author(self, db_session, ):
        form_data = {'username': 'testuser'}
        raports = Raports(form_data)

        db_session.add(valid_author)
        db_session.commit()
        aybak = db_session.query(Author).filter_by(lastname="Aybak").first()
        assert aybak.firstname == "Ezzeddin"
        assert aybak.lastname != "Abdullah"
        assert aybak.email == "aybak_email@gmail.com"


        result = raports.get_author()
        self.assertEqual(result, mock_user)