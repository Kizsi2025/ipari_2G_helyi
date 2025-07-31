// routes/api.js - Fő API útvonalak
const express = require('express');
const router = express.Router();

// Middleware
const { validateApiKey } = require('../middleware/auth');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech API működik',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'healthy',
    services: {
      database: global.users ? 'connected' : 'disconnected',
      gameEngine: global.gameStates ? 'active' : 'inactive',
      sessions: global.sessions ? 'active' : 'inactive'
    }
  });
});

// API információk
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Future-Tech MI Küldetés API',
    version: '1.0.0',
    description: 'Gamifikált gépi tanulás oktatási platform',
    documentation: {
      endpoints: {
        health: 'GET /api/health - Szerver állapot',
        users: 'POST /api/users/* - Felhasználó műveletek',
        game: 'POST /api/game/* - Játék műveletek',
        data: 'GET /api/data/* - Adat lekérések'
      },
      authentication: 'API kulcs vagy session ID szükséges',
      rateLimit: '1000 kérés / 15 perc',
      contentType: 'application/json'
    },
    links: {
      github: 'https://github.com/future-tech/mi-kuldetés',
      docs: '/api/health',
      status: '/api/health'
    }
  });
});

// Szerver statisztikák (admin)
router.get('/stats', validateApiKey, (req, res) => {
  try {
    const stats = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      },
      users: {
        total: global.users ? global.users.size : 0,
        active: Array.from(global.sessions?.values() || []).length,
        registered: global.users ? Array.from(global.users.values()).length : 0
      },
      games: {
        totalSessions: global.gameStates ? global.gameStates.size : 0,
        activeSessions: global.gameStates ? 
          Array.from(global.gameStates.values()).filter(g => !g.customData.sessionEnded).length : 0,
        completedSessions: global.gameStates ? 
          Array.from(global.gameStates.values()).filter(g => g.currentPhase === 'completed').length : 0
      },
      analytics: {
        modelsUnlocked: global.gameStates ? 
          Array.from(global.gameStates.values()).reduce((sum, g) => sum + g.unlockedModels.length, 0) : 0,
        challengesCompleted: global.gameStates ? 
          Array.from(global.gameStates.values()).reduce((sum, g) => sum + g.completedChallenges.length, 0) : 0,
        averageCredits: global.gameStates && global.gameStates.size > 0 ? 
          Array.from(global.gameStates.values()).reduce((sum, g) => sum + g.credits, 0) / global.gameStates.size : 0
      }
    };

    res.json({
      success: true,
      message: 'Szerver statisztikák sikeresen lekérve',
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Statisztikák lekérési hiba',
      message: error.message
    });
  }
});

// Rendszer információk
router.get('/system', (req, res) => {
  res.json({
    success: true,
    message: 'Rendszer információk',
    data: {
      name: 'Future-Tech MI Küldetés Backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: [
        'Gamifikált tanulás',
        'MI modell szimuláció',
        'Rangsor rendszer',
        'Achievement rendszer',
        'Valós idejű feedback'
      ],
      supportedModels: ['classification', 'regression'],
      maxUsers: 1000,
      sessionTimeout: '24 óra',
      rateLimit: '1000 kérés / 15 perc'
    }
  });
});

// Konfiguráció lekérése
router.get('/config', (req, res) => {
  res.json({
    success: true,
    message: 'Konfiguráció sikeresen lekérve',
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
      },
      ui: {
        theme: 'dark',
        language: 'hu',
        animations: true,
        sounds: true
      },
      limits: {
        maxNameLength: 50,
        maxTeamNameLength: 50,
        sessionTimeout: 86400000, // 24 óra
        rateLimit: 1000
      }
    }
  });
});

module.exports = router;
