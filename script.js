// Home page functionality
let currentBudget = 50000;
let currentCategory = 'all';

function displayColleges(filteredColleges) {
    const grid = document.getElementById('collegeGrid');
    if (!grid) return;
    
    grid.innerHTML = filteredColleges.map(college => `
        <div class="college-card" onclick="location.href='college.html?id=${college.id}'">
            <h4>${college.name}</h4>
            <p>📍 ${college.city} | ${college.type}</p>
            <p>🎓 Placement: ${college.placement}</p>
            <p class="price">💰 ₹${college.fees.toLocaleString()}/year</p>
        </div>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    applyHomeFilters();
}

function updateBudget(value) {
    currentBudget = parseInt(value);
    document.getElementById('budgetValue').textContent = currentBudget.toLocaleString();
    applyHomeFilters();
}

function applyHomeFilters() {
    let filtered = colleges.filter(c => c.fees <= currentBudget);
    if (currentCategory !== 'all') {
        filtered = filtered.filter(c => c.category === currentCategory);
    }
    displayColleges(filtered);
}

function searchColleges() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = colleges.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.city.toLowerCase().includes(query) ||
        c.courses.some(course => course.includes(query))
    );
    displayColleges(filtered);
}

// Initialize home page
if (document.getElementById('collegeGrid')) {
    displayColleges(colleges);
}
