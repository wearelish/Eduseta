// Compare page - fetches from backend API
const API = 'http://localhost:3000/api';

let selectedIds = [];
let allColleges = [];

async function loadCollegeSelector() {
  const res = await fetch(`${API}/colleges`);
  allColleges = await res.json();

  const selector = document.getElementById('collegeSelector');
  if (!selector) return;

  selector.innerHTML = allColleges.map(c => `
    <label style="display:block; margin:0.5rem 0;">
      <input type="checkbox" value="${c.id}" onchange="toggleCollege(${c.id}, this)">
      ${c.name} — ${c.city}
    </label>
  `).join('');
}

function toggleCollege(id, checkbox) {
  if (checkbox.checked) {
    if (selectedIds.length >= 3) {
      alert('You can compare maximum 3 colleges');
      checkbox.checked = false;
      return;
    }
    selectedIds.push(id);
  } else {
    selectedIds = selectedIds.filter(i => i !== id);
  }
}

async function compareSelected() {
  if (selectedIds.length < 2) {
    alert('Please select at least 2 colleges to compare');
    return;
  }

  const res = await fetch(`${API}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: selectedIds })
  });

  const data = await res.json();
  const tableDiv = document.getElementById('comparisonTable');

  tableDiv.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          ${data.colleges.map(c => `<th>${c.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.table.map(row => `
          <tr>
            <td><strong>${row.parameter}</strong></td>
            ${row.values.map(v => `<td>${v !== null && v !== undefined ? v : '—'}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

if (document.getElementById('collegeSelector')) {
  loadCollegeSelector();
}
