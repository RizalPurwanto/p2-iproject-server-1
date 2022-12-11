# YouFlix API Documentation
## Endpoints:
List of available endpoints:
- `POST /register
- `POST /login
- `GET /movies
- `GET /movies/:imdbId
- `GET /movies/search
- `GET /movies/price/:imdbId
- `GET /movies/purchased/all
- `POST /movies/purchased/:imdbId
- `GET /movies/purchased/:imdbId
- `GET /genres/
- `POST /payment/:imdbId


&nbsp;

## 1. POST /register

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "username required"
}
OR
{
  "message": "email required"
}
OR
{
  "message": "invalid email format"
}
OR
{
  "message": "email must be unique"
}
OR
{
  "message": "password required"
}

```

&nbsp;