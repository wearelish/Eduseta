const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/compare', require('./routes/compare'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Haryana College Finder API is running' });
});

// Fallback: serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
