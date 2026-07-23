const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pantry', require('./routes/pantry.routes'));
app.use('/api/grocery', require('./routes/grocery.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Loop Kitchen API Server',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Loop Kitchen Backend Server running on http://localhost:${PORT}`);
});

module.exports = app;
