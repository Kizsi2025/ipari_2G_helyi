// routes/game.js - Játék útvonalak
const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');

// Middleware
const { validateUserId, rateLimitStrict } = require('../middleware/auth');
const { validateGameStart, validateModelUnlock, validateChallengeComplete } = require('../middleware/validation');

// Új játék indítása
router.post('/session/start', rateLimitStrict, validateGameStart, GameController.startNewGame);

// Játékállapot lekérése
router.get('/session/:userId', validateUserId, GameController.getGameState);

// Játékállapot mentése
router.put('/session/:userId', validateUserId, GameController.saveGameState);

// Játék újraindítása
router.post('/session/:userId/reset', validateUserId, GameController.resetGame);

// Modell feloldása
router.post('/models/unlock', rateLimitStrict, validateModelUnlock, GameController.unlockModel);

// Kihívás teljesítése
router.post('/challenges/complete', rateLimitStrict, validateChallengeComplete, GameController.completeChallenge);

// Játék fázis frissítése
router.patch('/session/:userId/phase', validateUserId, GameController.updateGamePhase);

// Játék statisztikák
router.get('/session/:userId/statistics', validateUserId, GameController.getGameStatistics);

// Rangsor
router.get('/leaderboard', GameController.getLeaderboard);

module.exports = router;
