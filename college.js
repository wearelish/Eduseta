// College detail page functionality
function getCollegeById(id) {
    return colleges.find(c => c.id === parseInt(id));
}

function displayCollegeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const collegeId = urlParams.get('id');
    const college = getCollegeById(collegeId);
    
    if (!college) {
        document.getElementById('collegeInfo').innerHTML = '<p>College not found</p>';
        return;
    }
    
    document.getElementById('collegeInfo').innerHTML = `
        <div class="detail-header">
            <h2>${college.name}</h2>
            <p>📍 ${college.city}, Haryana | ${college.type}</p>
        </div>
        
        <div class="detail-section">
            <h3>Overview</h3>
            <p>${college.description}</p>
        </div>
        
        <div class="detail-section">
            <h3>Fee Structure</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Annual Fees:</strong> ₹${college.fees.toLocaleString()}
                </div>
                <div class="info-item">
                    <strong>Type:</strong> ${college.type}
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Placement Statistics</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Placement Rate:</strong> ${college.placement}
                </div>
                <div class="info-item">
                    <strong>Average Package:</strong> ${college.avgPackage}
                </div>
                <div class="info-item">
                    <strong>Highest Package:</strong> ${college.highestPackage}
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Courses & Branches</h3>
            <table>
                <thead>
                    <tr>
                        <th>Branch/Course</th>
                        <th>Available</th>
                    </tr>
                </thead>
                <tbody>
                    ${college.branches.map(branch => `
                        <tr>
                            <td>${branch}</td>
                            <td>✓</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="detail-section">
            <h3>Seats & Admission</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Total Seats:</strong> ${college.seats}
                </div>
                <div class="info-item">
                    <strong>Admission Criteria:</strong> ${college.criteria}
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Facilities</h3>
            <ul>
                ${college.facilities.map(facility => `<li>${facility}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Initialize college detail page
if (document.getElementById('collegeInfo')) {
    displayCollegeDetail();
}
