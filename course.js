// Course results page - fetches from backend API
const API = 'http://localhost:3000/api';

const courseNames = {
  btech: 'B.Tech Engineering',
  mba: 'MBA - Master of Business Administration',
  polytechnic: 'Polytechnic Diploma',
  arts: 'BA/BSc/BCom - Arts, Science & Commerce'
};

async function displayCourseResults() {
  const courseType = new URLSearchParams(window.location.search).get('course');
  const title = document.getElementById('courseTitle');
  const grid = document.getElementById('courseColleges');

  if (!courseType || !courseNames[courseType]) {
    title.textContent = 'Invalid Course';
    grid.innerHTML = '<p>Please select a valid course.</p>';
    return;
  }

  title.textContent = courseNames[courseType];

  const res = await fetch(`${API}/courses/${courseType}/colleges`);
  const colleges = await res.json();

  if (!colleges.length) {
    grid.innerHTML = '<p>No colleges found for this course.</p>';
    return;
  }

  grid.innerHTML = colleges.map(c => `
    <div class="college-card" onclick="location.href='college.html?id=${c.id}'">
      <h4>${c.name}</h4>
      <p>📍 ${c.city} | ${c.type}</p>
      <p>🎓 Placement: ${c.placement}</p>
      <p>📊 Avg Package: ${c.avg_package}</p>
      <p class="price">💰 ₹${Number(c.fees).toLocaleString()}/year</p>
    </div>
  `).join('');
}

if (document.getElementById('courseColleges')) {
  displayCourseResults();
}
