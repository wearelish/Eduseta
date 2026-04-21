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
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            city        TEXT NOT NULL,
            type        TEXT NOT NULL,
            category    TEXT NOT NULL,
            fees        INTEGER NOT NULL,
            placement   TEXT,
            avg_package TEXT,
            highest_package TEXT,
            seats       INTEGER,
            criteria    TEXT,
            description TEXT
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
    seed_data = [
        {"name": "NIT Kurukshetra", "city": "Kurukshetra", "type": "Government",
         "category": "engineering", "fees": 85000, "placement": "95%",
         "avg_package": "12 LPA", "highest_package": "45 LPA", "seats": 1200,
         "criteria": "JEE Main rank under 25000", "description": "Premier engineering institute in Haryana",
         "courses": ["btech", "mba"], "branches": ["CSE", "ECE", "ME", "CE", "EE"],
         "facilities": ["Library", "Hostel", "Sports Complex", "Labs"]},
        {"name": "YMCA University", "city": "Faridabad", "type": "Government",
         "category": "engineering", "fees": 65000, "placement": "85%",
         "avg_package": "6 LPA", "highest_package": "25 LPA", "seats": 800,
         "criteria": "JEE Main rank under 50000", "description": "Established engineering university",
         "courses": ["btech", "polytechnic"], "branches": ["CSE", "IT", "ECE", "ME"],
         "facilities": ["Library", "Hostel", "Cafeteria", "Labs"]},
        {"name": "Amity University Gurgaon", "city": "Gurgaon", "type": "Private",
         "category": "engineering", "fees": 180000, "placement": "80%",
         "avg_package": "5 LPA", "highest_package": "18 LPA", "seats": 2000,
         "criteria": "60% in 12th", "description": "Multi-disciplinary private university",
         "courses": ["btech", "mba", "arts"], "branches": ["CSE", "IT", "ECE", "ME", "MBA", "BA", "BCom"],
         "facilities": ["Library", "Hostel", "Sports", "Labs", "Auditorium"]},
        {"name": "Manav Rachna University", "city": "Faridabad", "type": "Private",
         "category": "engineering", "fees": 150000, "placement": "75%",
         "avg_package": "4.5 LPA", "highest_package": "15 LPA", "seats": 1500,
         "criteria": "55% in 12th", "description": "Well-known private university",
         "courses": ["btech", "mba", "arts"], "branches": ["CSE", "ECE", "ME", "MBA", "BBA"],
         "facilities": ["Library", "Hostel", "Sports", "Labs"]},
        {"name": "Government Polytechnic Karnal", "city": "Karnal", "type": "Government",
         "category": "polytechnic", "fees": 25000, "placement": "70%",
         "avg_package": "3 LPA", "highest_package": "8 LPA", "seats": 600,
         "criteria": "50% in 10th", "description": "Government polytechnic college",
         "courses": ["polytechnic"], "branches": ["Civil", "Mechanical", "Electrical", "Computer"],
         "facilities": ["Library", "Hostel", "Workshop", "Labs"]},
        {"name": "Kurukshetra University", "city": "Kurukshetra", "type": "Government",
         "category": "arts", "fees": 15000, "placement": "60%",
         "avg_package": "3.5 LPA", "highest_package": "10 LPA", "seats": 3000,
         "criteria": "50% in 12th", "description": "State university offering various programs",
         "courses": ["arts"], "branches": ["BA", "BSc", "BCom", "MA", "MSc"],
         "facilities": ["Library", "Hostel", "Sports", "Auditorium"]},
        {"name": "MDU Rohtak", "city": "Rohtak", "type": "Government",
         "category": "arts", "fees": 18000, "placement": "65%",
         "avg_package": "4 LPA", "highest_package": "12 LPA", "seats": 2500,
         "criteria": "50% in 12th", "description": "Maharshi Dayanand University",
         "courses": ["arts", "mba"], "branches": ["BA", "BSc", "BCom", "MBA", "MA"],
         "facilities": ["Library", "Hostel", "Sports", "Labs"]},
        {"name": "The NorthCap University", "city": "Gurgaon", "type": "Private",
         "category": "engineering", "fees": 165000, "placement": "82%",
         "avg_package": "6.5 LPA", "highest_package": "22 LPA", "seats": 1000,
         "criteria": "60% in 12th, JEE Main", "description": "Private engineering university",
         "courses": ["btech", "mba"], "branches": ["CSE", "IT", "ECE", "ME", "MBA"],
         "facilities": ["Library", "Hostel", "Sports", "Labs", "Cafeteria"]},
    ]

    for college in seed_data:
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
    print("Database seeded.")


def enrich(conn, college: dict) -> dict:
    cid = college["id"]
    college["courses"] = [r["course"] for r in
        conn.execute("SELECT course FROM college_courses WHERE college_id=?", (cid,)).fetchall()]
    college["branches"] = [r["branch"] for r in
        conn.execute("SELECT branch FROM college_branches WHERE college_id=?", (cid,)).fetchall()]
    college["facilities"] = [r["facility"] for r in
        conn.execute("SELECT facility FROM college_facilities WHERE college_id=?", (cid,)).fetchall()]
    return college
