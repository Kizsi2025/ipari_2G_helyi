const express = require('express');
const { getProducts, getEventCards } = require('../controllers/dataController');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech API működik',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: global.users ? 'connected' : 'disconnected',
      gameEngine: global.gameStates ? 'active' : 'inactive',
      sessions: global.sessions ? 'active' : 'inactive'
    }
  });
});

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech MI Küldetés API',
    version: '1.0.0',
    description: 'Gamifikált gépi tanulás oktatási platform',
    endpoints: {
      health: 'GET /api/health - Szerver állapot',
      users: 'POST /api/users/* - Felhasználó műveletek',
      game: 'POST /api/game/* - Játék műveletek',
      data: 'GET /api/data/* - Adat lekérések'
    }
  });
});

// Data endpoints
router.get('/data/products', getProducts);
router.get('/data/event-cards', getEventCards);

// Config endpoint
router.get('/config', (req, res) => {
  res.json({
    success: true,
    message: 'Konfiguráció lekérve',
    data: {
      game: {
        startingCredits: 50,
        models: {
          classification: { cost: 15, name: 'Klasszifikációs modell' },
          regression: { cost: 15, name: 'Regressziós modell' }
        },
        challenges: {
          count: 4,
          cost: 10,
          reward: 5
        }
      }
    }
  });
});

module.exports = router;
