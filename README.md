# Games API

A simple REST API for managing video games, built with **Flask** and **SQLite**.

This project exposes CRUD endpoints for a `games` resource, returns proper HTTP status codes, validates required fields on create/update, and is documented with an OpenAPI 3.0 spec (`gamesAPI.yaml`).

## Features

- List all games, get one game, create, update, and delete
- SQLite database seeded with 15 realistic video games
- Request validation on `POST` and `PUT` (required fields)
- OpenAPI specification in `gamesAPI.yaml`

### Endpoints overview

| Method | Path | Description | Success |
|--------|------|-------------|---------|
| GET | `/` | Health check | 200 |
| GET | `/games` | List all games | 200 |
| GET | `/games/<id>` | Get one game | 200 |
| POST | `/games` | Create a game | 201 |
| PUT | `/games/<id>` | Update a game | 200 |
| DELETE | `/games/<id>` | Delete a game | 200 |

### Game fields

| Field | Required | Notes |
|-------|----------|--------|
| `title` | yes | |
| `genre` | yes | |
| `platform` | yes | |
| `release_year` | yes | integer |
| `developer` | yes | |
| `rating` | no | number (e.g. 9.6) |

## API reference (sample request & response)

Base URL (local): `http://127.0.0.1:5000`

### GET `/` — Health check

**Request:** none (no body)

**Response `200`:**

```json
{
  "message": "Games API is running"
}
```

### GET `/games` — List all games

**Request:** none (no body)

**Response `200`:**

```json
[
  {
    "id": 1,
    "title": "The Legend of Zelda: Breath of the Wild",
    "genre": "Action-Adventure",
    "platform": "Nintendo Switch",
    "release_year": 2017,
    "developer": "Nintendo EPD",
    "rating": 9.7
  },
  {
    "id": 2,
    "title": "Elden Ring",
    "genre": "Action RPG",
    "platform": "PC",
    "release_year": 2022,
    "developer": "FromSoftware",
    "rating": 9.6
  }
]
```

### GET `/games/<id>` — Get one game

**Request:** path param `id` (example: `1`)

**Response `200`:**

```json
{
  "id": 1,
  "title": "The Legend of Zelda: Breath of the Wild",
  "genre": "Action-Adventure",
  "platform": "Nintendo Switch",
  "release_year": 2017,
  "developer": "Nintendo EPD",
  "rating": 9.7
}
```

**Response `404`:**

```json
{
  "error": "Game not found"
}
```

### POST `/games` — Create a game

**Request body:**

```json
{
  "title": "Baldurs Gate 3",
  "genre": "RPG",
  "platform": "PC",
  "release_year": 2023,
  "developer": "Larian Studios",
  "rating": 9.6
}
```

**Response `201`:**

```json
{
  "id": 16,
  "title": "Baldurs Gate 3",
  "genre": "RPG",
  "platform": "PC",
  "release_year": 2023,
  "developer": "Larian Studios",
  "rating": 9.6
}
```

**Request body (missing fields):**

```json
{
  "title": "Incomplete Game"
}
```

**Response `400`:**

```json
{
  "error": "Missing required fields: genre, platform, release_year, developer"
}
```

### PUT `/games/<id>` — Update a game

**Request:** path param `id` (example: `1`)

**Request body:**

```json
{
  "title": "Zelda BOTW",
  "genre": "Action-Adventure",
  "platform": "Nintendo Switch",
  "release_year": 2017,
  "developer": "Nintendo EPD",
  "rating": 9.8
}
```

**Response `200`:**

```json
{
  "id": 1,
  "title": "Zelda BOTW",
  "genre": "Action-Adventure",
  "platform": "Nintendo Switch",
  "release_year": 2017,
  "developer": "Nintendo EPD",
  "rating": 9.8
}
```

**Response `404`:**

```json
{
  "error": "Game not found"
}
```

**Response `400`:** same shape as POST when required fields are missing.

### DELETE `/games/<id>` — Delete a game

**Request:** path param `id` (example: `15`), no body

**Response `200`:**

```json
{
  "message": "Game deleted: id=15, title=Among Us"
}
```

**Response `404`:**

```json
{
  "error": "Game not found"
}
```

## Project structure

```
├── app.py              # Flask app and routes
├── seed.py             # Creates tables and inserts seed data
├── games.db            # SQLite database (created by seed.py)
├── gamesAPI.yaml       # OpenAPI 3.0 specification
├── requirements.txt    # Python dependencies
└── README.md
```

## Run locally

### 1. Prerequisites

- Python 3.10+ recommended
- PowerShell (Windows) or a terminal

### 2. Create and activate a virtual environment

```powershell
python -m venv env
.\env\Scripts\activate
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Seed the database

Run once (or after deleting `games.db` if you want a fresh seed):

```powershell
python seed.py
```

### 5. Start the server

```powershell
python app.py
```

The API will be available at: `http://127.0.0.1:5000`

Quick check:

```powershell
curl.exe http://127.0.0.1:5000/
```

Expected:

```json
{"message": "Games API is running"}
```


## How to test (local)

Keep the server running (`python app.py`). Use **`curl.exe`** on Windows PowerShell (plain `curl` is an alias for `Invoke-WebRequest`).

### 1. List all games — expect 200

```powershell
curl.exe -i http://127.0.0.1:5000/games
```

### 2. Get one game — expect 200

```powershell
curl.exe -i http://127.0.0.1:5000/games/1
```

### 3. Get missing game — expect 404

```powershell
curl.exe -i http://127.0.0.1:5000/games/999
```

### 4. Create a game — expect 201

```powershell
curl.exe --% -i -X POST http://127.0.0.1:5000/games -H "Content-Type: application/json" -d "{\"title\":\"Baldurs Gate 3\",\"genre\":\"RPG\",\"platform\":\"PC\",\"release_year\":2023,\"developer\":\"Larian Studios\",\"rating\":9.6}"
```

### 5. Create with missing field — expect 400

```powershell
curl.exe --% -i -X POST http://127.0.0.1:5000/games -H "Content-Type: application/json" -d "{\"title\":\"Incomplete Game\"}"
```

### 6. Update a game — expect 200

```powershell
curl.exe --% -i -X PUT http://127.0.0.1:5000/games/1 -H "Content-Type: application/json" -d "{\"title\":\"Zelda BOTW\",\"genre\":\"Action-Adventure\",\"platform\":\"Nintendo Switch\",\"release_year\":2017,\"developer\":\"Nintendo EPD\",\"rating\":9.8}"
```

### 7. Delete a game — expect 200

```powershell
curl.exe -i -X DELETE http://127.0.0.1:5000/games/15
```

### Expected status codes checklist

| Test | Status |
|------|--------|
| List / get / update / delete success | 200 |
| Create success | 201 |
| Missing required field | 400 |
| Unknown id | 404 |

## API documentation

See [`gamesAPI.yaml`](gamesAPI.yaml) for the full OpenAPI 3.0 specification. You can paste it into [Swagger Editor](https://editor.swagger.io/) to browse the endpoints visually.