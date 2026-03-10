// Course results page functionality
const courseNames = {
    'btech': 'B.Tech Engineering',
    'mba': 'MBA - Master of Business Administration',
    'polytechnic': 'Polytechnic Diploma',
    'arts': 'BA/BSc/BCom - Arts, Science & Commerce'
};

function displayCourseResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseType = urlParams.get('course');
    
    const title = document.getElementById('courseTitle');
    const grid = document.getElementById('courseColleges');
    
    if (!courseType || !courseNames[courseType]) {
        title.textContent = 'Course Not Found';
        grid.innerHTML = '<p>Invalid course selection</p>';
        return;
    }
    
    title.textContent = courseNames[courseType];
    
    const filteredColleges = colleges.filter(c => c.courses.includes(courseType));
    
    if (filteredColleges.length === 0) {
        grid.innerHTML = '<p>No colleges found for this course</p>';
        return;
    }
    
    grid.innerHTML = filteredColleges.map(college => `
        <div class="college-card" onclick="location.href='college.html?id=${college.id}'">
            <h4>${college.name}</h4>
            <p>📍 ${college.city} | ${college.type}</p>
            <p>🎓 Placement: ${college.placement}</p>
            <p>📊 Avg Package: ${college.avgPackage}</p>
            <p class="price">💰 ₹${college.fees.toLocaleString()}/year</p>
        </div>
    `).join('');
}

// Initialize course results page
if (document.getElementById('courseColleges')) {
    displayCourseResults();
}
