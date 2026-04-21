const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper: attach courses, branches, facilities to a college row
function enrichCollege(college) {
  college.courses = db.prepare('SELECT course FROM college_courses WHERE college_id = ?')
    .all(college.id).map(r => r.course);
  college.branches = db.prepare('SELECT branch FROM college_branches WHERE college_id = ?')
    .all(college.id).map(r => r.branch);
  college.facilities = db.prepare('SELECT facility FROM college_facilities WHERE college_id = ?')
    .all(college.id).map(r => r.facility);
  return college;
}

// GET /api/colleges - list all with optional filters
router.get('/', (req, res) => {
  const { city, type, category, maxFees, search } = req.query;

  let query = 'SELECT * FROM colleges WHERE 1=1';
  const params = [];

  if (city) { query += ' AND city = ?'; params.push(city); }
  if (type) { query += ' AND type = ?'; params.push(type); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (maxFees) { query += ' AND fees <= ?'; params.push(parseInt(maxFees)); }
  if (search) {
    query += ' AND (name LIKE ? OR city LIKE ? OR description LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  const colleges = db.prepare(query).all(...params).map(enrichCollege);
  res.json(colleges);
});

// GET /api/colleges/:id - single college detail
router.get('/:id', (req, res) => {
  const college = db.prepare('SELECT * FROM colleges WHERE id = ?').get(req.params.id);
  if (!college) return res.status(404).json({ error: 'College not found' });
  res.json(enrichCollege(college));
});

// POST /api/colleges - add a new college
router.post('/', (req, res) => {
  const { name, city, type, category, fees, placement, avg_package, highest_package, seats, criteria, description, courses = [], branches = [], facilities = [] } = req.body;

  if (!name || !city || !type || !category || !fees) {
    return res.status(400).json({ error: 'name, city, type, category, fees are required' });
  }

  const insert = db.transaction(() => {
    const { lastInsertRowid: cid } = db.prepare(`
      INSERT INTO colleges (name, city, type, category, fees, placement, avg_package, highest_package, seats, criteria, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, city, type, category, fees, placement, avg_package, highest_package, seats, criteria, description);

    courses.forEach(c => db.prepare('INSERT INTO college_courses (college_id, course) VALUES (?, ?)').run(cid, c));
    branches.forEach(b => db.prepare('INSERT INTO college_branches (college_id, branch) VALUES (?, ?)').run(cid, b));
    facilities.forEach(f => db.prepare('INSERT INTO college_facilities (college_id, facility) VALUES (?, ?)').run(cid, f));

    return db.prepare('SELECT * FROM colleges WHERE id = ?').get(cid);
  });

  const college = insert();
  res.status(201).json(enrichCollege(college));
});

// PUT /api/colleges/:id - update a college
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM colleges WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'College not found' });

  const { name, city, type, category, fees, placement, avg_package, highest_package, seats, criteria, description, courses, branches, facilities } = req.body;

  const update = db.transaction(() => {
    db.prepare(`
      UPDATE colleges SET
        name = COALESCE(?, name), city = COALESCE(?, city), type = COALESCE(?, type),
        category = COALESCE(?, category), fees = COALESCE(?, fees),
        placement = COALESCE(?, placement), avg_package = COALESCE(?, avg_package),
        highest_package = COALESCE(?, highest_package), seats = COALESCE(?, seats),
        criteria = COALESCE(?, criteria), description = COALESCE(?, description)
      WHERE id = ?
    `).run(name, city, type, category, fees, placement, avg_package, highest_package, seats, criteria, description, req.params.id);

    if (courses) {
      db.prepare('DELETE FROM college_courses WHERE college_id = ?').run(req.params.id);
      courses.forEach(c => db.prepare('INSERT INTO college_courses (college_id, course) VALUES (?, ?)').run(req.params.id, c));
    }
    if (branches) {
      db.prepare('DELETE FROM college_branches WHERE college_id = ?').run(req.params.id);
      branches.forEach(b => db.prepare('INSERT INTO college_branches (college_id, branch) VALUES (?, ?)').run(req.params.id, b));
    }
    if (facilities) {
      db.prepare('DELETE FROM college_facilities WHERE college_id = ?').run(req.params.id);
      facilities.forEach(f => db.prepare('INSERT INTO college_facilities (college_id, facility) VALUES (?, ?)').run(req.params.id, f));
    }

    return db.prepare('SELECT * FROM colleges WHERE id = ?').get(req.params.id);
  });

  res.json(enrichCollege(update()));
});

// DELETE /api/colleges/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM colleges WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'College not found' });

  db.transaction(() => {
    db.prepare('DELETE FROM college_courses WHERE college_id = ?').run(req.params.id);
    db.prepare('DELETE FROM college_branches WHERE college_id = ?').run(req.params.id);
    db.prepare('DELETE FROM college_facilities WHERE college_id = ?').run(req.params.id);
    db.prepare('DELETE FROM colleges WHERE id = ?').run(req.params.id);
  })();

  res.json({ message: 'College deleted successfully' });
});

module.exports = router;
