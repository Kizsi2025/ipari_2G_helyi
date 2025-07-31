// routes/users.js - Felhasználói útvonalak
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Middleware
const { validateUserId, rateLimitStrict } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, validateUserUpdate } = require('../middleware/validation');

// Felhasználó regisztráció
router.post('/register', rateLimitStrict, validateUserRegistration, UserController.register);

// Felhasználó bejelentkezés
router.post('/login', rateLimitStrict, validateUserLogin, UserController.login);

// Felhasználó lekérése
router.get('/:userId', validateUserId, UserController.getUser);

// Felhasználó frissítése
router.put('/:userId', validateUserId, validateUserUpdate, UserController.updateUser);

// Felhasználó törlése
router.delete('/:userId', validateUserId, UserController.deleteUser);

// Felhasználói statisztikák frissítése
router.patch('/:userId/statistics', validateUserId, UserController.updateUserStatistics);

// Achievement hozzáadása
router.post('/:userId/achievements', validateUserId, UserController.addAchievement);

// Felhasználó rangsor pozíciója
router.get('/:userId/rank', validateUserId, UserController.getUserRank);

// Összes felhasználó listázása (admin)
router.get('/', UserController.getAllUsers);

module.exports = router;
