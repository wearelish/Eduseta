import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel
from database import get_conn, enrich

router = APIRouter(prefix="/api/colleges", tags=["colleges"])


class CollegeIn(BaseModel):
    name: str
    city: str
    type: str
    category: str
    fees: int
    placement: Optional[str] = None
    avg_package: Optional[str] = None
    highest_package: Optional[str] = None
    seats: Optional[int] = None
    criteria: Optional[str] = None
    description: Optional[str] = None
    courses: List[str] = []
    branches: List[str] = []
    facilities: List[str] = []


class CollegeUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    fees: Optional[int] = None
    placement: Optional[str] = None
    avg_package: Optional[str] = None
    highest_package: Optional[str] = None
    seats: Optional[int] = None
    criteria: Optional[str] = None
    description: Optional[str] = None
    courses: Optional[List[str]] = None
    branches: Optional[List[str]] = None
    facilities: Optional[List[str]] = None


@router.get("/")
def list_colleges(
    city: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    maxFees: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
):
    conn = get_conn()
    sql = "SELECT * FROM colleges WHERE 1=1"
    params = []
    if city:
        sql += " AND city = ?"; params.append(city)
    if type:
        sql += " AND type = ?"; params.append(type)
    if category:
        sql += " AND category = ?"; params.append(category)
    if maxFees:
        sql += " AND fees <= ?"; params.append(maxFees)
    if search:
        sql += " AND (name LIKE ? OR city LIKE ? OR description LIKE ?)"
        like = f"%{search}%"
        params.extend([like, like, like])
    rows = [dict(r) for r in conn.execute(sql, params).fetchall()]
    result = [enrich(conn, r) for r in rows]
    conn.close()
    return result


@router.get("/{college_id}")
def get_college(college_id: int):
    conn = get_conn()
    row = conn.execute("SELECT * FROM colleges WHERE id = ?", (college_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="College not found")
    result = enrich(conn, dict(row))
    conn.close()
    return result


@router.post("/", status_code=201)
def create_college(data: CollegeIn):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO colleges (name, city, type, category, fees, placement,
            avg_package, highest_package, seats, criteria, description)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    """, (data.name, data.city, data.type, data.category, data.fees,
          data.placement, data.avg_package, data.highest_package,
          data.seats, data.criteria, data.description))
    cid = cur.lastrowid
    for c in data.courses:
        cur.execute("INSERT INTO college_courses (college_id, course) VALUES (?,?)", (cid, c))
    for b in data.branches:
        cur.execute("INSERT INTO college_branches (college_id, branch) VALUES (?,?)", (cid, b))
    for f in data.facilities:
        cur.execute("INSERT INTO college_facilities (college_id, facility) VALUES (?,?)", (cid, f))
    conn.commit()
    row = conn.execute("SELECT * FROM colleges WHERE id = ?", (cid,)).fetchone()
    result = enrich(conn, dict(row))
    conn.close()
    return result


@router.put("/{college_id}")
def update_college(college_id: int, data: CollegeUpdate):
    conn = get_conn()
    if not conn.execute("SELECT id FROM colleges WHERE id = ?", (college_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="College not found")
    fields = {k: v for k, v in data.model_dump().items()
              if v is not None and k not in ("courses", "branches", "facilities")}
    if fields:
        set_clause = ", ".join(f"{k} = ?" for k in fields)
        conn.execute(f"UPDATE colleges SET {set_clause} WHERE id = ?",
                     list(fields.values()) + [college_id])
    if data.courses is not None:
        conn.execute("DELETE FROM college_courses WHERE college_id = ?", (college_id,))
        for c in data.courses:
            conn.execute("INSERT INTO college_courses (college_id, course) VALUES (?,?)", (college_id, c))
    if data.branches is not None:
        conn.execute("DELETE FROM college_branches WHERE college_id = ?", (college_id,))
        for b in data.branches:
            conn.execute("INSERT INTO college_branches (college_id, branch) VALUES (?,?)", (college_id, b))
    if data.facilities is not None:
        conn.execute("DELETE FROM college_facilities WHERE college_id = ?", (college_id,))
        for f in data.facilities:
            conn.execute("INSERT INTO college_facilities (college_id, facility) VALUES (?,?)", (college_id, f))
    conn.commit()
    row = conn.execute("SELECT * FROM colleges WHERE id = ?", (college_id,)).fetchone()
    result = enrich(conn, dict(row))
    conn.close()
    return result


@router.delete("/{college_id}")
def delete_college(college_id: int):
    conn = get_conn()
    if not conn.execute("SELECT id FROM colleges WHERE id = ?", (college_id,)).fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="College not found")
    conn.execute("DELETE FROM college_courses WHERE college_id = ?", (college_id,))
    conn.execute("DELETE FROM college_branches WHERE college_id = ?", (college_id,))
    conn.execute("DELETE FROM college_facilities WHERE college_id = ?", (college_id,))
    conn.execute("DELETE FROM colleges WHERE id = ?", (college_id,))
    conn.commit()
    conn.close()
    return {"message": "College deleted successfully"}
