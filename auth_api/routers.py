from fastapi_sqlalchemy import db
from fastapi import APIRouter, Depends, HTTPException, status, Request, Security
from models import User
from sqlalchemy.exc import SQLAlchemyError
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPAuthorizationCredentials, HTTPBearer


from auth_api.auth import Auth

auth_handler = Auth()
security = HTTPBearer()
auth = APIRouter()

JWT_SECRET = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 1

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


# async def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     print(data)
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#     to_encode["exp"] = expire
#     return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

# async def authenticate_user(username: str, password: str):
    
#     if user := db.session.query(User).filter_by(username=username).first():
#         return user if check_password_hash(user.password, password) else False
#     else:
#         return False 


@auth.post('/login')
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    
    print(form_data)
    user = db.session.query(User).filter_by(username=form_data.username).first()
    if (user is None):
        return HTTPException(status_code=401, detail='Invalid username')
    if (not auth_handler.verify_password(form_data.password, user.password)):
        return HTTPException(status_code=401, detail='Invalid password')
    
    user_obj = dict(username=user.username, password=user.password)
    access_token, exp = auth_handler.encode_token(user_obj)
    refresh_token = auth_handler.encode_refresh_token(user_obj)
    
    # access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # token = await create_access_token(user_obj, expires_delta=access_token_expires)
    return {'access_token': access_token, 
            'token_expire' : exp,
            'refresh_token': refresh_token,
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
    
    if db.session.query(User).filter_by(username=form_data['username']).first() != None:
        return {'status' : 'Account already exists'}
    
    try:
        email = form_data['email']
        username = form_data['username']
        hashed_password = auth_handler.encode_password(form_data['password'])
        user_obj = User(email=email, username=username, password=hashed_password)
        db.session.add(user_obj)
        db.session.commit()
        print('SUCCESS')
        return {'status': 'success'}

    except SQLAlchemyError as e:
        return {'status':  e.orig.args}


@auth.get('/refresh_token')
def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    print(credentials.credentials)
    refresh_token = credentials.credentials
    new_token, exp = auth_handler.refresh_token(refresh_token)
    return {'access_token': new_token, 
            'token_expire' : exp,}