# Haryana College Finder

Frontend + Backend website to find colleges in Haryana.

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+

### Install & Run

```bash
cd backend
npm install
npm start
```

Server starts at `http://localhost:3000` — the backend also serves the frontend automatically.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List all colleges. Filters: `?city=`, `?type=`, `?category=`, `?maxFees=`, `?search=` |
| GET | `/api/colleges/:id` | Single college detail |
| POST | `/api/colleges` | Add a new college |
| PUT | `/api/colleges/:id` | Update a college |
| DELETE | `/api/colleges/:id` | Delete a college |
| GET | `/api/courses` | List all course types |
| GET | `/api/courses/:courseType/colleges` | Colleges for a course (`btech`, `mba`, `polytechnic`, `arts`) |
| POST | `/api/compare` | Compare 2-3 colleges — body: `{ "ids": [1, 2, 3] }` |
| GET | `/api/health` | Health check |
