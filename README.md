# Raports app

## Description

Report management project.\
Created to create new reports, save them in the [database](https://github.com/pawelprzegon/DUR-DB.git) and create statistics for generated reports.\
Database is a separated repository to build it independent

## Technologies

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

## Documentation

Project based on docker containers.

- database container:\
   external repository [database](https://github.com/pawelprzegon/DUR-DB.git)
- API container:\
   build with [FastAPI](https://fastapi.tiangolo.com/).
  API got authorization and endpoints to call. User first needs to register to get access into API.
  After login with response we got:\
   -- access token (30 minutes)\
   -- refresh token (120 minutes)\
   With access to API we have several options to manipulate with raports:\
   [FastAPI/docs](https://dur-raports-back.onrender.com/docs) - patience is required to enter (free server)

- Frontend container:\
   build with JavaScript and Node Express. \
   The case was to create one page app with dynamicly created content. \
   Web have login and register start page.
  After login we can see (if some allready created) raports on slider created using [swiperjs](https://swiperjs.com/swiper-api)
  Using options inside menubar we can crate, update, delete raports and see some statistics about all raports. In menubar we have also search section.\
   Working DEMO [Raport-app](https://dur-raports-front.onrender.com/) - patience is required to enter (free server)

## How to use

To run project localy we have to install [docker](https://www.docker.com/products/docker-desktop/) first.

Now clone repositories:

- for database

```
git clone https://github.com/pawelprzegon/DUR-DB.git
```

- for app

```
git clone https://github.com/pawelprzegon/DUR-Raports.git
```

### Default configuration

With current docker-compose.yml file:

- front runs on port: 3000
- back rins on port: 8000
- adminer for db runs on port: 8080
- app uses network created by database container named "database-net"
</p>

### Custom configuration

If you like to change ports:
change ports forwarding in docker-compose.yml file:

- if changed port for front, change "CORS_URL" environment url
- if changed port for back, change url variable inside "url.js" file
  (.\front\frontend\src\common\data\url.js)

If you like to use external database change "networks" section

```
version: "3.8"

services:
  back:
    container_name: raport_BACK
    build: ./back
    restart: on-failure:10
    environment:
      - DATABASE_URL=postgresql+psycopg2://docker:docker@postgres:5432/Artgeist_API
      - CORS_URL=http://localhost:3000
      - DB_TIMEOUT=30
    ports:
      - 8000:8000
    networks:
      - app-network
    volumes:
      - ./back:/back/

  front:
    container_name: raport_FRONT
    build: ./front
    ports:
      - 3000:3000
    networks:
      - app-network
    volumes:
      - ./front:/front/

networks:
  app-network:
    external:
      name: database-net
```

## Build and release

After configuration to run app:

if you don't allready runs Docker Desktop - do it now.

- Database:\
database default backup timing is every hour. For change that edit "crontab" file inside localization "./cron/crontab". For more details visit [supercronic](https://github.com/aptible/supercronic).
</p> 
To build database container use command inside copied repository:

```
docker-compose up -d
```

- App:\
  go to app cloned repository location:\
  To build database container use command inside copied repository:

```
docker-compose up -d
```
