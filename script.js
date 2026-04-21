// Home page - fetches from backend API
const API = 'http://localhost:3000/api';

let currentBudget = 200000;
let currentCategory = 'all';

async function fetchColleges(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/colleges?${query}`);
  return res.json();
}

function renderColleges(colleges) {
  const grid = document.getElementById('collegeGrid');
  if (!grid) return;

  if (!colleges.length) {
    grid.innerHTML = '<p>No colleges found.</p>';
    return;
  }

  grid.innerHTML = colleges.map(c => `
    <div class="college-card" onclick="location.href='college.html?id=${c.id}'">
      <h4>${c.name}</h4>
      <p>📍 ${c.city} | ${c.type}</p>
      <p>🎓 Placement: ${c.placement}</p>
      <p class="price">💰 ₹${Number(c.fees).toLocaleString()}/year</p>
    </div>
  `).join('');
}

async function filterByCategory(category) {
  currentCategory = category;
  await applyHomeFilters();
}

async function updateBudget(value) {
  currentBudget = parseInt(value);
  document.getElementById('budgetValue').textContent = Number(currentBudget).toLocaleString();
  await applyHomeFilters();
}

async function applyHomeFilters() {
  const params = { maxFees: currentBudget };
  if (currentCategory !== 'all') params.category = currentCategory;
  const colleges = await fetchColleges(params);
  renderColleges(colleges);
}

async function searchColleges() {
  const query = document.getElementById('searchInput').value.trim();
  const colleges = await fetchColleges(query ? { search: query } : {});
  renderColleges(colleges);
}

// Init
if (document.getElementById('collegeGrid')) {
  fetchColleges().then(renderColleges);
}
