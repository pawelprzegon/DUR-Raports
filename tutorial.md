docker-compose up -d

update nextval in db after importing data
use adminer "Zapytanie SQL"
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"dekl"', 'id')), (SELECT (MAX("id") + 1) FROM "dekl"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"plexi"', 'id')), (SELECT (MAX("id") + 1) FROM "plexi"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"raport"', 'id')), (SELECT (MAX("id") + 1) FROM "raport"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"unit"', 'id')), (SELECT (MAX("id") + 1) FROM "unit"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"user"', 'id')), (SELECT (MAX("id") + 1) FROM "user"), FALSE);
