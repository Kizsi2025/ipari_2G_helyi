// server.js - Future-Tech MI Küldetés Backend Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const apiRoutes  = require('./src/routes/api');
const userRoutes = require('./src/routes/users');
const gameRoutes = require('./src/routes/game');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

// Import utils
const { db } = require('./src/utils/database');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Biztonsági middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS beállítás
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-session-id', 'x-admin-key']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 perc
  max: 1000, // Maximum 1000 kérés ablakontként
  message: {
    success: false,
    error: 'Túl sok kérés',
    message: 'Kérlek próbáld újra később'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Általános middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// GLOBAL VARIABLES INITIALIZATION
// ============================================

// Memória alapú adattárolás inicializálása
if (!global.users) {
  global.users = new Map();
  console.log('✅ Felhasználók Map inicializálva');
}

if (!global.gameStates) {
  global.gameStates = new Map();
  console.log('✅ Játékállapotok Map inicializálva');
}

if (!global.sessions) {
  global.sessions = new Map();
  console.log('✅ Session Map inicializálva');
}

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech Backend működik',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech MI Küldetés API',
    version: '1.0.0',
    docs: '/api/health',
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
      game: '/api/game'
    }
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint nem található',
    message: `A kért útvonal (${req.method} ${req.originalUrl}) nem létezik`,
    timestamp: new Date().toISOString()
  });
});

// Globális hibakezelő
app.use(errorHandler.logError);
app.use(errorHandler.handleError);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Adatbázis kapcsolat inicializálása
    await db.connect();
    console.log('✅ Adatbázis kapcsolat létrehozva');

    // Szerver indítása
    const server = app.listen(PORT, () => {
      console.log('🚀 FUTURE-TECH BACKEND SZERVER ELINDULT!');
      console.log('='*50);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Indítás időpontja: ${new Date().toISOString()}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API dokumentáció: http://localhost:${PORT}/api`);
      console.log('='*50);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM jel érkezett, szerver leállítása...');
      server.close(() => {
        console.log('✅ Szerver leállítva');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT jel érkezett, szerver leállítása...');
      server.close(() => {
        console.log('✅ Szerver leállítva');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Szerver indítási hiba:', error);
    process.exit(1);
  }
}

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Szerver indítás
startServer();

module.exports = app;
