const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/compare - compare 2-3 colleges by IDs
// Body: { ids: [1, 2, 3] }
router.post('/', (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
    return res.status(400).json({ error: 'Provide 2 to 3 college IDs in an array' });
  }

  const placeholders = ids.map(() => '?').join(', ');
  const colleges = db.prepare(`SELECT * FROM colleges WHERE id IN (${placeholders})`).all(...ids);

  if (colleges.length !== ids.length) {
    return res.status(404).json({ error: 'One or more colleges not found' });
  }

  const enriched = colleges.map(college => {
    college.courses = db.prepare('SELECT course FROM college_courses WHERE college_id = ?')
      .all(college.id).map(r => r.course);
    college.branches = db.prepare('SELECT branch FROM college_branches WHERE college_id = ?')
      .all(college.id).map(r => r.branch);
    college.facilities = db.prepare('SELECT facility FROM college_facilities WHERE college_id = ?')
      .all(college.id).map(r => r.facility);
    return college;
  });

  // Build comparison table structure
  const fields = [
    { key: 'name', label: 'College Name' },
    { key: 'city', label: 'City' },
    { key: 'type', label: 'Type' },
    { key: 'fees', label: 'Annual Fees (₹)' },
    { key: 'placement', label: 'Placement Rate' },
    { key: 'avg_package', label: 'Average Package' },
    { key: 'highest_package', label: 'Highest Package' },
    { key: 'seats', label: 'Total Seats' },
    { key: 'criteria', label: 'Admission Criteria' }
  ];

  const comparison = {
    colleges: enriched,
    table: fields.map(field => ({
      parameter: field.label,
      values: enriched.map(c => c[field.key])
    }))
  };

  res.json(comparison);
});

module.exports = router;
