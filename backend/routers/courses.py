import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import APIRouter, HTTPException
from database import get_conn, enrich

router = APIRouter(prefix="/api/courses", tags=["courses"])

VALID_COURSES = {"btech", "mba", "polytechnic", "arts"}

COURSE_META = [
    {"id": "btech",       "name": "B.Tech",     "description": "Engineering programs in various specializations"},
    {"id": "mba",         "name": "MBA",         "description": "Management and business administration"},
    {"id": "polytechnic", "name": "Polytechnic", "description": "Diploma courses in engineering"},
    {"id": "arts",        "name": "BA/BSc/BCom", "description": "Arts, Science, and Commerce programs"},
]


@router.get("/")
def list_courses():
    return COURSE_META


@router.get("/{course_type}/colleges")
def colleges_by_course(course_type: str):
    if course_type not in VALID_COURSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid course. Valid options: {', '.join(VALID_COURSES)}"
        )
    conn = get_conn()
    rows = conn.execute("""
        SELECT c.* FROM colleges c
        INNER JOIN college_courses cc ON c.id = cc.college_id
        WHERE cc.course = ?
    """, (course_type,)).fetchall()
    result = [enrich(conn, dict(r)) for r in rows]
    conn.close()
    return result
