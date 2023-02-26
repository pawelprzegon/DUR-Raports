import jwt # used for encoding and decoding jwt tokens
from datetime import timezone
from fastapi import HTTPException # used to handle error handling
from passlib.context import CryptContext # used for hashing the password 
from datetime import datetime, timedelta # used to handle expiry time for tokens

TIME_MIN = 1
class Auth():
    hasher= CryptContext(schemes=['bcrypt'])
    secret = "secretKey" #os.getenv("APP_SECRET_STRING")

    def encode_password(self, password):
        return self.hasher.hash(password)

    def verify_password(self, password, encoded_password):
        return self.hasher.verify(password, encoded_password)
    
    def encode_token(self, username):
        exp = datetime.now() + timedelta(days=0,hours=0, minutes=TIME_MIN)
        payload = {
            'exp': exp,
            'iat': datetime.now(timezone.utc),
            'scope': 'access_token',
            'sub': username['username'],
        }
        return jwt.encode(
            payload, 
            self.secret,
            algorithm='HS256'
        ), exp
    
    def decode_token(self, token):
        try:
            payload = jwt.decode(token, self.secret, algorithms=['HS256'])
            if (payload['scope'] == 'access_token'):
                return payload['sub']   
            raise HTTPException(status_code=401, detail='Scope for the token is invalid')
        except jwt.ExpiredSignatureError as e:
            raise HTTPException(status_code=401, detail='Token expired') from e
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail='Invalid token') from e
	    
    def encode_refresh_token(self, username):
        payload = {
            'exp': datetime.now(timezone.utc) + timedelta(days=0, hours=2),
            'iat': datetime.now(timezone.utc),
            'scope': 'refresh_token',
            'sub': username,
        }
        return jwt.encode(
            payload, 
            self.secret,
            algorithm='HS256'
        )
    def refresh_token(self, refresh_token):
        try:
            payload = jwt.decode(refresh_token, self.secret, algorithms=['HS256'])
            if (payload['scope'] == 'refresh_token'):
                username = payload['sub']
                return self.encode_token(username)
            raise HTTPException(status_code=401, detail='Invalid scope for token')
        except jwt.ExpiredSignatureError as e:
            raise HTTPException(status_code=401, detail='Refresh token expired') from e
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail='Invalid refresh token') from e