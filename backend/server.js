const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Lynqio Backend API is running!',
    status: 'success'
  });
});

// Test database route
app.get('/api/test', async (req, res) => {
  const pool = require('./config/database');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: '✅ Database connection successful!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      message: '❌ Database connection failed',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});