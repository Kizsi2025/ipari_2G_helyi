// server.js - BACKEND mappából futtatva
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// JAVÍTOTT ÚTVONALAK - backend mappából
const apiRoutes = require('./routes/api');        // ✅ ./routes/api
const userRoutes = require('./routes/users');      // ✅ ./routes/users  
const gameRoutes = require('./routes/game');       // ✅ ./routes/game
const dataRoutes = require('./routes/data');       // ✅ ./routes/data
const errorHandler = require('./middleware/errorHandler');
const { db } = require('./utils/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup...
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global variables
if (!global.users) global.users = new Map();
if (!global.gameStates) global.gameStates = new Map();
if (!global.sessions) global.sessions = new Map();

// Routes
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech Backend működik',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/data', dataRoutes);

// Server startup
async function startServer() {
  try {
    await db.connect();
    const server = app.listen(PORT, () => {
      console.log(`🚀 FUTURE-TECH BACKEND INDULT - PORT: ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Szerver indítási hiba:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
