const express = require('express');
const router = express.Router();

// GET /api/game/state/:userId
router.get('/state/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const gameState = global.gameStates.get(userId);
    
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Játékállapot nem található'
      });
    }

    res.json({
      success: true,
      message: 'Játékállapot lekérve',
      data: gameState
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Játékállapot hiba',
      message: error.message
    });
  }
});

// POST /api/game/unlock-model
router.post('/unlock-model', (req, res) => {
  try {
    const { userId, modelType } = req.body;

    if (!userId || !modelType) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó adatok',
        message: 'userId és modelType szükséges'
      });
    }

    const gameState = global.gameStates.get(userId);
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Játékállapot nem található'
      });
    }

    // Check if already unlocked
    if (gameState.unlockedModels.includes(modelType)) {
      return res.status(400).json({
        success: false,
        error: 'Modell már feloldva'
      });
    }

    // Check cost
    const cost = 15;
    if (gameState.credits < cost) {
      return res.status(400).json({
        success: false,
        error: 'Nincs elég kredit',
        message: `${cost} TK szükséges`
      });
    }

    // Unlock model
    gameState.credits -= cost;
    gameState.unlockedModels.push(modelType);
    gameState.score += 10;
    gameState.updatedAt = new Date().toISOString();

    // Update phase
    if (gameState.unlockedModels.length === 1) {
      gameState.currentPhase = 'classification-unlocked';
    } else if (gameState.unlockedModels.length === 2) {
      gameState.currentPhase = 'both-models-unlocked';
    }

    global.gameStates.set(userId, gameState);

    console.log(`🔓 ${modelType} modell feloldva: ${global.users.get(userId)?.name}`);

    res.json({
      success: true,
      message: 'Modell feloldva',
      data: {
        modelType,
        remainingCredits: gameState.credits,
        unlockedModels: gameState.unlockedModels,
        currentPhase: gameState.currentPhase,
        newScore: gameState.score
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Modell feloldási hiba',
      message: error.message
    });
  }
});

// POST /api/game/complete-challenge
router.post('/complete-challenge', (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    if (!userId || challengeId === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó adatok'
      });
    }

    const gameState = global.gameStates.get(userId);
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Játékállapot nem található'
      });
    }

    // Check if already completed
    if (gameState.completedChallenges.includes(challengeId)) {
      return res.status(400).json({
        success: false,
        error: 'Kihívás már teljesítve'
      });
    }

    const cost = 10;
    const reward = 5;

    if (gameState.credits < cost) {
      return res.status(400).json({
        success: false,
        error: 'Nincs elég kredit'
      });
    }

    // Complete challenge
    gameState.credits = gameState.credits - cost + reward;
    gameState.completedChallenges.push(challengeId);
    gameState.score += 15;
    gameState.updatedAt = new Date().toISOString();

    // Check completion
    if (gameState.completedChallenges.length === 4) {
      gameState.currentPhase = 'completed';
      gameState.score += 50;
    }

    global.gameStates.set(userId, gameState);

    console.log(`🎯 Kihívás teljesítve (#${challengeId}): ${global.users.get(userId)?.name}`);

    res.json({
      success: true,
      message: 'Kihívás teljesítve',
      data: {
        challengeId,
        remainingCredits: gameState.credits,
        completedChallenges: gameState.completedChallenges,
        currentPhase: gameState.currentPhase,
        newScore: gameState.score
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Kihívás hiba',
      message: error.message
    });
  }
});

// GET /api/game/leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = Array.from(global.gameStates.values())
      .map(gameState => {
        const user = global.users.get(gameState.userId);
        return {
          userId: gameState.userId,
          name: user?.name || 'Unknown',
          teamName: user?.teamName || 'Unknown Team',
          score: gameState.score,
          credits: gameState.credits,
          modelsUnlocked: gameState.unlockedModels.length,
          challengesCompleted: gameState.completedChallenges.length,
          currentPhase: gameState.currentPhase,
          createdAt: gameState.createdAt
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

    res.json({
      success: true,
      message: 'Rangsor lekérve',
      data: leaderboard,
      totalPlayers: leaderboard.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Rangsor hiba',
      message: error.message
    });
  }
});

module.exports = router;
