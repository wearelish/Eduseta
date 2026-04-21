// College detail page - fetches from backend API
const API = 'http://localhost:3000/api';

async function displayCollegeDetail() {
  const id = new URLSearchParams(window.location.search).get('id');
  const container = document.getElementById('collegeInfo');

  if (!id) {
    container.innerHTML = '<p>No college ID provided.</p>';
    return;
  }

  const res = await fetch(`${API}/colleges/${id}`);
  if (!res.ok) {
    container.innerHTML = '<p>College not found.</p>';
    return;
  }

  const c = await res.json();

  container.innerHTML = `
    <div class="detail-header">
      <h2>${c.name}</h2>
      <p>📍 ${c.city}, Haryana | ${c.type}</p>
    </div>

    <div class="detail-section">
      <h3>Overview</h3>
      <p>${c.description}</p>
    </div>

    <div class="detail-section">
      <h3>Fee Structure</h3>
      <div class="info-grid">
        <div class="info-item"><strong>Annual Fees:</strong> ₹${Number(c.fees).toLocaleString()}</div>
        <div class="info-item"><strong>Type:</strong> ${c.type}</div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Placement Statistics</h3>
      <div class="info-grid">
        <div class="info-item"><strong>Placement Rate:</strong> ${c.placement}</div>
        <div class="info-item"><strong>Average Package:</strong> ${c.avg_package}</div>
        <div class="info-item"><strong>Highest Package:</strong> ${c.highest_package}</div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Courses & Branches</h3>
      <table>
        <thead><tr><th>Branch/Course</th><th>Available</th></tr></thead>
        <tbody>
          ${c.branches.map(b => `<tr><td>${b}</td><td>✓</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="detail-section">
      <h3>Seats & Admission</h3>
      <div class="info-grid">
        <div class="info-item"><strong>Total Seats:</strong> ${c.seats}</div>
        <div class="info-item"><strong>Admission Criteria:</strong> ${c.criteria}</div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Facilities</h3>
      <ul>${c.facilities.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>
  `;
}

if (document.getElementById('collegeInfo')) {
  displayCollegeDetail();
}
