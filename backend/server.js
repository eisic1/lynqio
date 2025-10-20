const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🚀 Lynqio Backend API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Test database route
app.get('/api/test', async (req, res) => {
  const pool = require('./config/database');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true,
      message: '✅ Database connection successful!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: '❌ Database connection failed',
      error: error.message 
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/links', require('./routes/link'));

// 404 handler - mora biti nakon svih ruta
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
  console.log('📚 Available Routes:');
  console.log('   Auth:    /api/auth');
  console.log('   Profile: /api/profile');
  console.log('   Links:   /api/links');
  console.log('=================================');
  console.log('');
});