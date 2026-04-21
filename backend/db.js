const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'colleges.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS colleges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    fees INTEGER NOT NULL,
    placement TEXT,
    avg_package TEXT,
    highest_package TEXT,
    seats INTEGER,
    criteria TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS college_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    course TEXT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
  );

  CREATE TABLE IF NOT EXISTS college_branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    branch TEXT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
  );

  CREATE TABLE IF NOT EXISTS college_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    facility TEXT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
  );
`);

// Seed data only if colleges table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM colleges').get();

if (count.count === 0) {
  const insertCollege = db.prepare(`
    INSERT INTO colleges (name, city, type, category, fees, placement, avg_package, highest_package, seats, criteria, description)
    VALUES (@name, @city, @type, @category, @fees, @placement, @avg_package, @highest_package, @seats, @criteria, @description)
  `);

  const insertCourse = db.prepare('INSERT INTO college_courses (college_id, course) VALUES (?, ?)');
  const insertBranch = db.prepare('INSERT INTO college_branches (college_id, branch) VALUES (?, ?)');
  const insertFacility = db.prepare('INSERT INTO college_facilities (college_id, facility) VALUES (?, ?)');

  const seedData = [
    {
      name: 'NIT Kurukshetra', city: 'Kurukshetra', type: 'Government', category: 'engineering',
      fees: 85000, placement: '95%', avg_package: '12 LPA', highest_package: '45 LPA',
      seats: 1200, criteria: 'JEE Main rank under 25000',
      description: 'Premier engineering institute in Haryana',
      courses: ['btech', 'mba'], branches: ['CSE', 'ECE', 'ME', 'CE', 'EE'],
      facilities: ['Library', 'Hostel', 'Sports Complex', 'Labs']
    },
    {
      name: 'YMCA University', city: 'Faridabad', type: 'Government', category: 'engineering',
      fees: 65000, placement: '85%', avg_package: '6 LPA', highest_package: '25 LPA',
      seats: 800, criteria: 'JEE Main rank under 50000',
      description: 'Established engineering university',
      courses: ['btech', 'polytechnic'], branches: ['CSE', 'IT', 'ECE', 'ME'],
      facilities: ['Library', 'Hostel', 'Cafeteria', 'Labs']
    },
    {
      name: 'Amity University Gurgaon', city: 'Gurgaon', type: 'Private', category: 'engineering',
      fees: 180000, placement: '80%', avg_package: '5 LPA', highest_package: '18 LPA',
      seats: 2000, criteria: '60% in 12th',
      description: 'Multi-disciplinary private university',
      courses: ['btech', 'mba', 'arts'], branches: ['CSE', 'IT', 'ECE', 'ME', 'MBA', 'BA', 'BCom'],
      facilities: ['Library', 'Hostel', 'Sports', 'Labs', 'Auditorium']
    },
    {
      name: 'Manav Rachna University', city: 'Faridabad', type: 'Private', category: 'engineering',
      fees: 150000, placement: '75%', avg_package: '4.5 LPA', highest_package: '15 LPA',
      seats: 1500, criteria: '55% in 12th',
      description: 'Well-known private university',
      courses: ['btech', 'mba', 'arts'], branches: ['CSE', 'ECE', 'ME', 'MBA', 'BBA'],
      facilities: ['Library', 'Hostel', 'Sports', 'Labs']
    },
    {
      name: 'Government Polytechnic Karnal', city: 'Karnal', type: 'Government', category: 'polytechnic',
      fees: 25000, placement: '70%', avg_package: '3 LPA', highest_package: '8 LPA',
      seats: 600, criteria: '50% in 10th',
      description: 'Government polytechnic college',
      courses: ['polytechnic'], branches: ['Civil', 'Mechanical', 'Electrical', 'Computer'],
      facilities: ['Library', 'Hostel', 'Workshop', 'Labs']
    },
    {
      name: 'Kurukshetra University', city: 'Kurukshetra', type: 'Government', category: 'arts',
      fees: 15000, placement: '60%', avg_package: '3.5 LPA', highest_package: '10 LPA',
      seats: 3000, criteria: '50% in 12th',
      description: 'State university offering various programs',
      courses: ['arts'], branches: ['BA', 'BSc', 'BCom', 'MA', 'MSc'],
      facilities: ['Library', 'Hostel', 'Sports', 'Auditorium']
    },
    {
      name: 'MDU Rohtak', city: 'Rohtak', type: 'Government', category: 'arts',
      fees: 18000, placement: '65%', avg_package: '4 LPA', highest_package: '12 LPA',
      seats: 2500, criteria: '50% in 12th',
      description: 'Maharshi Dayanand University',
      courses: ['arts', 'mba'], branches: ['BA', 'BSc', 'BCom', 'MBA', 'MA'],
      facilities: ['Library', 'Hostel', 'Sports', 'Labs']
    },
    {
      name: 'The NorthCap University', city: 'Gurgaon', type: 'Private', category: 'engineering',
      fees: 165000, placement: '82%', avg_package: '6.5 LPA', highest_package: '22 LPA',
      seats: 1000, criteria: '60% in 12th, JEE Main',
      description: 'Private engineering university',
      courses: ['btech', 'mba'], branches: ['CSE', 'IT', 'ECE', 'ME', 'MBA'],
      facilities: ['Library', 'Hostel', 'Sports', 'Labs', 'Cafeteria']
    }
  ];

  const seedAll = db.transaction((data) => {
    for (const college of data) {
      const { lastInsertRowid: cid } = insertCollege.run(college);
      college.courses.forEach(c => insertCourse.run(cid, c));
      college.branches.forEach(b => insertBranch.run(cid, b));
      college.facilities.forEach(f => insertFacility.run(cid, f));
    }
  });

  seedAll(seedData);
  console.log('Database seeded successfully');
}

module.exports = db;
