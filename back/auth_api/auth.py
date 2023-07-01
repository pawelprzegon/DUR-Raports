import jwt
from fastapi import HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pytz import timezone
ACCESS_TOKEN_TIME = 30
REFRESH_TOKEN_TIME = 120


class Auth():
    hasher = CryptContext(schemes=['bcrypt'])
    secret = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

    def encode_password(self, password: str) -> str:
        '''Hashing password'''
        return self.hasher.hash(password)

    def verify_password(self, password: str, encoded_password: str) -> bool:
        '''Returns true or false if password equals with db'''
        return self.hasher.verify(password, encoded_password)

    def encode_token(self, username: dict) -> str:
        '''Hashing token'''
        payload = {
            'exp': datetime.now(timezone('Europe/Berlin')) + timedelta(days=0, hours=0, minutes=ACCESS_TOKEN_TIME),
            'iat': datetime.now(timezone('Europe/Berlin')),
            'scope': 'access_token',
            'sub': username['username'],
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        ), datetime.now(timezone('Europe/Berlin')) + timedelta(days=0, hours=0, minutes=ACCESS_TOKEN_TIME)

    def decode_token(self, token: str) -> dict:
        '''Decodes token'''
        try:
            payload = jwt.decode(token, self.secret, algorithms=['HS256'])
            if (payload['scope'] == 'access_token'):
                return payload['sub']
            raise HTTPException(
                status_code=401, detail='Scope for the token is invalid')
        except jwt.ExpiredSignatureError as e:
            raise HTTPException(status_code=401, detail='Token expired') from e
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail='Invalid token') from e

    def encode_refresh_token(self, username: dict) -> str:
        '''Hashing refresh token if oldone expired after valid credentials login/password'''
        payload = {
            'exp': datetime.now(timezone('Europe/Berlin')) + timedelta(days=0, hours=0, minutes=REFRESH_TOKEN_TIME),
            'iat': datetime.now(timezone('Europe/Berlin')),
            'scope': 'refresh_token',
            'sub': username,
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        )

    def refresh_token(self, refresh_token: str) -> str:
        '''Refresh access token'''
        try:
            payload = jwt.decode(
                refresh_token, self.secret, algorithms=['HS256'])
            if (payload['scope'] == 'refresh_token'):
                username = payload['sub']
                return self.encode_token(username)
            raise HTTPException(
                status_code=401, detail='Invalid scope for token')
        except jwt.ExpiredSignatureError as e:
            raise HTTPException(
                status_code=401, detail='Refresh token expired') from e
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=401, detail='Invalid refresh token') from e
