import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "colleges.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS colleges (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT NOT NULL,
            city            TEXT NOT NULL,
            type            TEXT NOT NULL,
            category        TEXT NOT NULL,
            fees            INTEGER NOT NULL,
            placement       TEXT,
            avg_package     TEXT,
            highest_package TEXT,
            seats           INTEGER,
            criteria        TEXT,
            description     TEXT
        );
        CREATE TABLE IF NOT EXISTS college_courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            college_id INTEGER NOT NULL REFERENCES colleges(id),
            course TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS college_branches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            college_id INTEGER NOT NULL REFERENCES colleges(id),
            branch TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS college_facilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            college_id INTEGER NOT NULL REFERENCES colleges(id),
            facility TEXT NOT NULL
        );
    """)
    if cur.execute("SELECT COUNT(*) FROM colleges").fetchone()[0] == 0:
        _seed(cur)
    conn.commit()
    conn.close()


def _seed(cur):
    from colleges_data import HARYANA_COLLEGES
    for college in HARYANA_COLLEGES:
        cur.execute("""
            INSERT INTO colleges (name, city, type, category, fees, placement,
                avg_package, highest_package, seats, criteria, description)
            VALUES (:name, :city, :type, :category, :fees, :placement,
                :avg_package, :highest_package, :seats, :criteria, :description)
        """, college)
        cid = cur.lastrowid
        for c in college["courses"]:
            cur.execute("INSERT INTO college_courses (college_id, course) VALUES (?,?)", (cid, c))
        for b in college["branches"]:
            cur.execute("INSERT INTO college_branches (college_id, branch) VALUES (?,?)", (cid, b))
        for f in college["facilities"]:
            cur.execute("INSERT INTO college_facilities (college_id, facility) VALUES (?,?)", (cid, f))
    print(f"Database seeded with {len(HARYANA_COLLEGES)} Haryana colleges.")


def enrich(conn, college: dict) -> dict:
    cid = college["id"]
    college["courses"] = [r["course"] for r in
        conn.execute("SELECT course FROM college_courses WHERE college_id=?", (cid,)).fetchall()]
    college["branches"] = [r["branch"] for r in
        conn.execute("SELECT branch FROM college_branches WHERE college_id=?", (cid,)).fetchall()]
    college["facilities"] = [r["facility"] for r in
        conn.execute("SELECT facility FROM college_facilities WHERE college_id=?", (cid,)).fetchall()]
    return college
