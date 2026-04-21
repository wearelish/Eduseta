import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import get_conn, enrich

router = APIRouter(prefix="/api/compare", tags=["compare"])


class CompareRequest(BaseModel):
    ids: List[int]


FIELDS = [
    ("name",            "College Name"),
    ("city",            "City"),
    ("type",            "Type"),
    ("fees",            "Annual Fees (Rs)"),
    ("placement",       "Placement Rate"),
    ("avg_package",     "Average Package"),
    ("highest_package", "Highest Package"),
    ("seats",           "Total Seats"),
    ("criteria",        "Admission Criteria"),
]


@router.post("/")
def compare_colleges(body: CompareRequest):
    if len(body.ids) < 2 or len(body.ids) > 3:
        raise HTTPException(status_code=400, detail="Provide 2 to 3 college IDs")

    conn = get_conn()
    placeholders = ",".join("?" * len(body.ids))
    rows = conn.execute(
        f"SELECT * FROM colleges WHERE id IN ({placeholders})", body.ids
    ).fetchall()

    if len(rows) != len(body.ids):
        conn.close()
        raise HTTPException(status_code=404, detail="One or more colleges not found")

    colleges = [enrich(conn, dict(r)) for r in rows]
    conn.close()

    return {
        "colleges": colleges,
        "table": [
            {"parameter": label, "values": [c.get(key) for c in colleges]}
            for key, label in FIELDS
        ],
    }
