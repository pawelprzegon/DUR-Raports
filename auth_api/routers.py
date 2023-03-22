from fastapi_sqlalchemy import db
from fastapi import APIRouter, Depends, HTTPException, status, Request, Security
from models import User
from sqlalchemy.exc import SQLAlchemyError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPAuthorizationCredentials, HTTPBearer
from starlette.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from schema import EmailSchema


from auth_api.auth import Auth

auth_handler = Auth()
security = HTTPBearer()
auth = APIRouter()

JWT_SECRET = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')



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
    print(access_token)
    print(refresh_token)
    return JSONResponse(status_code=status.HTTP_200_OK, content={
            'access_token': access_token, 
            'token_expire' : str(exp),
            'refresh_token': refresh_token,
            'user' : {
                'id': user.id,
                'username' : user.username
            }}
                        )
            


@auth.post('/register/')
async def register(request: Request):

    form_data = await request.form()
    
    if db.session.query(User).filter_by(username=form_data['username']).first() != None:
        return HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="User allready exists"
        )
    
    try:
        email = form_data['email']
        username = form_data['username']
        hashed_password = auth_handler.encode_password(form_data['password'])
        user_obj = User(email=email, username=username, password=hashed_password)
        db.session.add(user_obj)
        db.session.commit()
        return JSONResponse(status_code=status.HTTP_200_OK, 
                            content={"message": f"{username} registered"})

    except SQLAlchemyError as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"message":  e.orig.args})


@auth.get('/refresh_token')
def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security)):

    try:
        refresh_token = credentials.credentials
        new_token, exp = auth_handler.refresh_token(refresh_token)
        print(new_token, exp)
        return JSONResponse(status_code=status.HTTP_200_OK, content={
            'access_token': new_token, 
            'token_expire' : str(exp),
            })
    except BaseException as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"message":  e})



@auth.post('/reset_password_link')
async def resetPassword(email: EmailSchema):

    conf = ConnectionConfig(
        MAIL_USERNAME = "bedziezciebie",
        MAIL_PASSWORD = "ggtzwnhsbgcmwjaa",
        MAIL_FROM = "bedziezciebie@gmail.com",
        MAIL_PORT = 587,
        MAIL_SERVER = "smtp.gmail.com",
        MAIL_FROM_NAME="Raporty Artgeist",
        MAIL_STARTTLS = True,
        MAIL_SSL_TLS = False,
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True
    )
    try:
        if (
            user := db.session.query(User)
            .filter_by(email=email.dict().get("email")[0])
            .first()
        ):
            access_token, exp = auth_handler.encode_token({"username": user.username})
            reset_link = f"http://localhost:3000/reset-password?token={access_token}"
            html = f"<p>To jest link do resetowania hasła: {reset_link}</p> "
            
            mess = MessageSchema(
                subject="Reset password",
                recipients=email.dict().get("email"),
                body=html,
                subtype=MessageType.html)

            fm = FastMail(conf)
            await fm.send_message(mess)
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "email has been sent"})
        else:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail='Username not found'
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail='Sending email error'
            )
        
@auth.post('/reset_password')
async def resetPassword(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    form_data = await request.json()
    token_user = auth_handler.decode_token(credentials.credentials)
    print(form_data)
    hashed_new_password = auth_handler.encode_password(form_data['password'])
    print(token_user)
    try:
        user = db.session.query(User).filter_by(username=token_user).first()
        user.password = hashed_new_password
        db.session.commit()
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": f"password for {token_user} has been changed"})
    except SQLAlchemyError as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"message":  e.orig.args})
        
@auth.get('/auth')
async def authorize(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if(auth_handler.decode_token(token)):
        return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content={"detail":  'authenticated'})

    