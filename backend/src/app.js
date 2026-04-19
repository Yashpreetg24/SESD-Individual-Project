const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize DB (Singleton) on startup
require('./config/database');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const foodRoutes = require('./routes/food');
const mealRoutes = require('./routes/meal');
const analyticsRoutes = require('./routes/analytics');
const suggestionRoutes = require('./routes/suggestions');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NutriTrack API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
