import sys
import os

# Ensure backend/ is on the path so routers can import database
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import init_db
from routers import colleges, courses, compare

# Init DB + seed on startup
init_db()

app = FastAPI(title="Haryana College Finder API", version="1.0.0")

# Allow frontend (file:// or localhost) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(colleges.router)
app.include_router(courses.router)
app.include_router(compare.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Haryana College Finder API is running"}


# Serve frontend static files from parent directory
frontend_dir = os.path.join(os.path.dirname(__file__), "..")
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
