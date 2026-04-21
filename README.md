# Haryana College Finder

Frontend + Python backend for finding colleges in Haryana.

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS
- Backend: Python, FastAPI, SQLite (built-in, no extra DB needed)

---

## Setup & Run

### 1. Install Python
Download from https://python.org (v3.10 or higher)

### 2. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the server

```bash
cd backend
uvicorn main:app --reload --port 3000
```

Open http://localhost:3000 in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/colleges` | List colleges. Filters: `?city=` `?type=` `?category=` `?maxFees=` `?search=` |
| GET | `/api/colleges/{id}` | Single college detail |
| POST | `/api/colleges` | Add a college |
| PUT | `/api/colleges/{id}` | Update a college |
| DELETE | `/api/colleges/{id}` | Delete a college |
| GET | `/api/courses` | List course types |
| GET | `/api/courses/{type}/colleges` | Colleges for a course (`btech` `mba` `polytechnic` `arts`) |
| POST | `/api/compare` | Compare 2-3 colleges — body: `{"ids": [1, 2, 3]}` |

Interactive API docs available at http://localhost:3000/docs
