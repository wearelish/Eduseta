// Colleges page functionality
function displayAllColleges(filteredColleges) {
    const list = document.getElementById('collegesList');
    if (!list) return;
    
    list.innerHTML = filteredColleges.map(college => `
        <div class="college-card" onclick="location.href='college.html?id=${college.id}'">
            <h4>${college.name}</h4>
            <p>📍 ${college.city} | ${college.type}</p>
            <p>🎓 Placement: ${college.placement}</p>
            <p>📊 Avg Package: ${college.avgPackage}</p>
            <p class="price">💰 ₹${college.fees.toLocaleString()}/year</p>
        </div>
    `).join('');
}

function applyFilters() {
    const cityCheckboxes = document.querySelectorAll('.filter-group input[value="Gurgaon"], .filter-group input[value="Faridabad"], .filter-group input[value="Karnal"], .filter-group input[value="Rohtak"]');
    const typeCheckboxes = document.querySelectorAll('.filter-group input[value="Government"], .filter-group input[value="Private"]');
    const budgetFilter = document.getElementById('budgetFilter');
    const budgetDisplay = document.getElementById('budgetDisplay');
    
    const selectedCities = Array.from(cityCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedTypes = Array.from(typeCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const maxBudget = parseInt(budgetFilter.value);
    
    budgetDisplay.textContent = `₹${maxBudget.toLocaleString()}`;
    
    let filtered = colleges.filter(c => c.fees <= maxBudget);
    
    if (selectedCities.length > 0) {
        filtered = filtered.filter(c => selectedCities.includes(c.city));
    }
    
    if (selectedTypes.length > 0) {
        filtered = filtered.filter(c => selectedTypes.includes(c.type));
    }
    
    displayAllColleges(filtered);
}

// Initialize colleges page
if (document.getElementById('collegesList')) {
    displayAllColleges(colleges);
}
