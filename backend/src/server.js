const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    error: 'Túl sok kérés',
    message: 'Próbáld újra 15 perc múlva'
  }
});

app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Initialize global storage
global.users = new Map();
global.gameStates = new Map();
global.sessions = new Map();

console.log('🚀 Future-Tech Backend inicializálása...');

// Import routes
const apiRoutes = require('./routes/api');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/game');

// Use routes
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech MI Küldetés Backend API',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      health: '/api/health',
      users: '/api/users',
      game: '/api/game'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend működik',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint nem található',
    message: `${req.method} ${req.originalUrl} nem létezik`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Szerver hiba:', error);
  res.status(error.status || 500).json({
    success: false,
    error: 'Szerver hiba',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎯 Future-Tech Backend sikeresen elindult!');
  console.log(`🌐 Szerver: http://localhost:${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log('=' .repeat(50));
});

module.exports = app;
