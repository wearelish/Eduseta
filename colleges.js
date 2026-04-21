// Colleges page - fetches from backend API
const API = 'http://localhost:3000/api';

function renderList(colleges) {
  const list = document.getElementById('collegesList');
  if (!list) return;

  if (!colleges.length) {
    list.innerHTML = '<p>No colleges match your filters.</p>';
    return;
  }

  list.innerHTML = colleges.map(c => `
    <div class="college-card" onclick="location.href='college.html?id=${c.id}'">
      <h4>${c.name}</h4>
      <p>📍 ${c.city} | ${c.type}</p>
      <p>🎓 Placement: ${c.placement}</p>
      <p>📊 Avg Package: ${c.avg_package}</p>
      <p class="price">💰 ₹${Number(c.fees).toLocaleString()}/year</p>
    </div>
  `).join('');
}

async function applyFilters() {
  const cityBoxes = document.querySelectorAll('.filter-group input[type=checkbox][value]');
  const typeBoxes = document.querySelectorAll('.filter-group input[value="Government"], .filter-group input[value="Private"]');
  const budgetFilter = document.getElementById('budgetFilter');
  const budgetDisplay = document.getElementById('budgetDisplay');

  const selectedCities = Array.from(cityBoxes).filter(cb => cb.checked && !['Government','Private'].includes(cb.value)).map(cb => cb.value);
  const selectedTypes = Array.from(typeBoxes).filter(cb => cb.checked).map(cb => cb.value);
  const maxFees = parseInt(budgetFilter.value);

  budgetDisplay.textContent = `₹${maxFees.toLocaleString()}`;

  const params = { maxFees };
  if (selectedCities.length === 1) params.city = selectedCities[0];
  if (selectedTypes.length === 1) params.type = selectedTypes[0];

  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/colleges?${query}`);
  let colleges = await res.json();

  // Client-side multi-city filter if more than one selected
  if (selectedCities.length > 1) {
    colleges = colleges.filter(c => selectedCities.includes(c.city));
  }
  if (selectedTypes.length > 1) {
    colleges = colleges.filter(c => selectedTypes.includes(c.type));
  }

  renderList(colleges);
}

// Init
if (document.getElementById('collegesList')) {
  fetch(`${API}/colleges`).then(r => r.json()).then(renderList);
}
