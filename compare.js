// Compare page functionality
let selectedColleges = [];

function displayCollegeSelector() {
    const selector = document.getElementById('collegeSelector');
    if (!selector) return;
    
    selector.innerHTML = colleges.map(college => `
        <label style="display: block; margin: 0.5rem 0;">
            <input type="checkbox" value="${college.id}" onchange="toggleCollege(${college.id})">
            ${college.name} - ${college.city}
        </label>
    `).join('');
}

function toggleCollege(id) {
    const index = selectedColleges.indexOf(id);
    if (index > -1) {
        selectedColleges.splice(index, 1);
    } else {
        if (selectedColleges.length >= 3) {
            alert('You can compare maximum 3 colleges');
            event.target.checked = false;
            return;
        }
        selectedColleges.push(id);
    }
}

function compareSelected() {
    if (selectedColleges.length < 2) {
        alert('Please select at least 2 colleges to compare');
        return;
    }
    
    const compareTable = document.getElementById('comparisonTable');
    const selectedData = selectedColleges.map(id => colleges.find(c => c.id === id));
    
    compareTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Parameter</th>
                    ${selectedData.map(c => `<th>${c.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>City</strong></td>
                    ${selectedData.map(c => `<td>${c.city}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Type</strong></td>
                    ${selectedData.map(c => `<td>${c.type}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Annual Fees</strong></td>
                    ${selectedData.map(c => `<td>₹${c.fees.toLocaleString()}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Placement Rate</strong></td>
                    ${selectedData.map(c => `<td>${c.placement}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Average Package</strong></td>
                    ${selectedData.map(c => `<td>${c.avgPackage}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Highest Package</strong></td>
                    ${selectedData.map(c => `<td>${c.highestPackage}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Total Seats</strong></td>
                    ${selectedData.map(c => `<td>${c.seats}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Admission Criteria</strong></td>
                    ${selectedData.map(c => `<td>${c.criteria}</td>`).join('')}
                </tr>
            </tbody>
        </table>
    `;
}

// Initialize compare page
if (document.getElementById('collegeSelector')) {
    displayCollegeSelector();
}
