import urllib.parse
from fastapi_sqlalchemy import db
from fastapi import APIRouter
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
auth = APIRouter()


@auth.get("/login/{data}", include_in_schema=False)
async def root(data):
    dec = urllib.parse.parse_qs(data, keep_blank_values=True)
    login = dec['login'][0]
    password = dec['password'][0]

    try:
        if user := db.session.query(User).filter_by(username=login).first():
            if check_password_hash(user.password, password):
                return {'category': 'success',
                        'user': user
                        }
            else:
                {'category': 'error',
                 'message': 'nieprawidłowe hasło'
                 }
        return {'category': 'error',
                'message': 'nieprawidłowy login'
                }
    except SQLAlchemyError as e:
        return {'category': 'error',
                'message': e
                }


@auth.put('/newuser/{data}')
async def create_user(data):
    try:
        dec = urllib.parse.parse_qs(data, keep_blank_values=True)
        email = dec['email'][0]
        username = dec['email'][0].split('@')[0]
        password = dec['password'][0]
        user = User(email=email, username=username, password=generate_password_hash(
                    password, method='sha256'))
        db.session.add(user)
        db.session.commit()
        return 'succesfully added'

    except SQLAlchemyError as e:
        return e
