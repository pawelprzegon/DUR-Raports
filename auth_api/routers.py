from datetime import timezone
from fastapi_sqlalchemy import db
from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
auth = APIRouter()

JWT_SECRET = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


async def create_access_token(data: dict, expires_delta: timedelta | None = None):
    print(data)
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

async def authenticate_user(username: str, password: str):
    
    if user := db.session.query(User).filter_by(username=username).first():
        return user if check_password_hash(user.password, password) else False
    else:
        return False 


@auth.post('/token')
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Invalid username or password'
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    user_obj = dict(username=user.username, password=user.password)

    token = await create_access_token(user_obj, expires_delta=access_token_expires)


    return {'access_token' : token, 
            'token_type' : 'bearer',
            'token_expire' : access_token_expires,
            'user' : {
                'id': user.id,
                'username' : user.username
            }}


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user = db.session.query(User).filter_by(username=payload.get('username')).first()
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail='Invalid username or password'
        )

    return user


# @auth.post("/user",  response_model=schema.User) #include_in_schema=False,
# async def root(user: schema.UserOut = Depends(get_current_user)):
#     return user

@auth.post('/register/')
async def register(request: Request):

    form_data = await request.form()
    
    try:
        email = form_data['email']
        username = form_data['username']
        password = form_data['password']
        user_obj = User(email=email, username=username, password=generate_password_hash(
                    password, method='sha256'))
        db.session.add(user_obj)
        db.session.commit()
        print('SUCCESS')
        return {'status': 'success'}

    except SQLAlchemyError as e:
        return {'status':  e.orig.args}
