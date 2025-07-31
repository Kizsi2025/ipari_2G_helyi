const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  teamName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().optional().allow('')
});

// POST /api/users/register
router.post('/register', (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Érvénytelen adatok',
        message: error.details[0].message
      });
    }

    const { name, teamName, email } = value;

    // Check if user exists
    const existingUser = Array.from(global.users.values())
      .find(user => user.name.toLowerCase() === name.toLowerCase() && 
                   user.teamName.toLowerCase() === teamName.toLowerCase());

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Felhasználó már létezik',
        message: 'Ez a név és csapat kombináció már foglalt'
      });
    }

    // Create user
    const userId = uuidv4();
    const sessionId = uuidv4();
    
    const user = {
      id: userId,
      name: name.trim(),
      teamName: teamName.trim(),
      email: email ? email.trim() : null,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    // Create session
    const session = {
      id: sessionId,
      userId: userId,
      createdAt: new Date().toISOString(),
      active: true
    };

    // Create game state
    const gameState = {
      userId: userId,
      credits: 50,
      unlockedModels: [],
      completedChallenges: [],
      currentPhase: 'registration',
      score: 0,
      achievements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in memory
    global.users.set(userId, user);
    global.sessions.set(sessionId, session);
    global.gameStates.set(userId, gameState);

    console.log(`✅ Új felhasználó: ${name} (${teamName})`);

    res.status(201).json({
      success: true,
      message: 'Sikeres regisztráció',
      data: {
        user: user,
        session: session,
        gameState: gameState
      }
    });

  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    res.status(500).json({
      success: false,
      error: 'Regisztrációs hiba',
      message: error.message
    });
  }
});

// GET /api/users/profile/:userId
router.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = global.users.get(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Felhasználó nem található'
      });
    }

    const gameState = global.gameStates.get(userId);

    res.json({
      success: true,
      message: 'Profil lekérve',
      data: { user, gameState }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Profil lekérési hiba',
      message: error.message
    });
  }
});

module.exports = router;
