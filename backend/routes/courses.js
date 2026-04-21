const express = require('express');
const router = express.Router();
const db = require('../db');

const VALID_COURSES = ['btech', 'mba', 'polytechnic', 'arts'];

// GET /api/courses - list all available course types
router.get('/', (req, res) => {
  const courses = [
    { id: 'btech', name: 'B.Tech', description: 'Engineering programs in various specializations' },
    { id: 'mba', name: 'MBA', description: 'Management and business administration' },
    { id: 'polytechnic', name: 'Polytechnic', description: 'Diploma courses in engineering' },
    { id: 'arts', name: 'BA/BSc/BCom', description: 'Arts, Science, and Commerce programs' }
  ];
  res.json(courses);
});

// GET /api/courses/:courseType/colleges - colleges offering a specific course
router.get('/:courseType/colleges', (req, res) => {
  const { courseType } = req.params;

  if (!VALID_COURSES.includes(courseType)) {
    return res.status(400).json({ error: `Invalid course type. Valid types: ${VALID_COURSES.join(', ')}` });
  }

  const colleges = db.prepare(`
    SELECT c.* FROM colleges c
    INNER JOIN college_courses cc ON c.id = cc.college_id
    WHERE cc.course = ?
  `).all(courseType);

  const enriched = colleges.map(college => {
    college.courses = db.prepare('SELECT course FROM college_courses WHERE college_id = ?')
      .all(college.id).map(r => r.course);
    college.branches = db.prepare('SELECT branch FROM college_branches WHERE college_id = ?')
      .all(college.id).map(r => r.branch);
    college.facilities = db.prepare('SELECT facility FROM college_facilities WHERE college_id = ?')
      .all(college.id).map(r => r.facility);
    return college;
  });

  res.json(enriched);
});

module.exports = router;
