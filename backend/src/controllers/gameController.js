// controllers/gameController.js - Játék állapot kezelés
const GameState = require('../models/GameState');

class GameController {

  // Új játék indítása
  static async startNewGame(req, res) {
    try {
      const { userId, playerName, teamName } = req.body;

      if (!userId || !playerName) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID és játékos név szükséges'
        });
      }

      // Új játékállapot létrehozása
      const gameState = new GameState({
        userId,
        playerName: playerName.trim(),
        teamName: teamName?.trim() || 'Mintázatdekódolók',
        credits: 50,
        unlockedModels: [],
        completedChallenges: [],
        currentPhase: 'start',
        sessionStartTime: new Date().toISOString()
      });

      // Játékállapot mentése
      if (!global.gameStates) {
        global.gameStates = new Map();
      }
      global.gameStates.set(userId, gameState);

      res.status(201).json({
        success: true,
        message: 'Új játék sikeresen elindítva',
        data: gameState.toJSON()
      });

    } catch (error) {
      console.error('Hiba az új játék indítása során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba az új játék indítása során',
        message: error.message
      });
    }
  }

  // Játékállapot lekérése
  static async getGameState(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Játékállapot keresése (memóriából vagy adatbázisból)
      let gameState = global.gameStates?.get(userId);

      if (!gameState) {
        // Ha nincs mentett állapot, alapértelmezett létrehozása
        gameState = GameState.getDefault(userId);

        if (!global.gameStates) {
          global.gameStates = new Map();
        }
        global.gameStates.set(userId, gameState);
      }

      res.json({
        success: true,
        message: 'Játékállapot sikeresen lekérve',
        data: gameState.toJSON()
      });

    } catch (error) {
      console.error('Hiba a játékállapot lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a játékállapot lekérése során',
        message: error.message
      });
    }
  }

  // Játékállapot mentése
  static async saveGameState(req, res) {
    try {
      const { userId } = req.params;
      const gameStateData = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Játékállapot validálása
      if (!GameState.validate(gameStateData)) {
        return res.status(400).json({
          success: false,
          error: 'Érvénytelen játékállapot adatok'
        });
      }

      // Játékállapot frissítése
      const gameState = new GameState({
        ...gameStateData,
        userId,
        lastUpdated: new Date().toISOString()
      });

      // Mentés
      if (!global.gameStates) {
        global.gameStates = new Map();
      }
      global.gameStates.set(userId, gameState);

      res.json({
        success: true,
        message: 'Játékállapot sikeresen mentve',
        data: gameState.toJSON()
      });

    } catch (error) {
      console.error('Hiba a játékállapot mentése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a játékállapot mentése során',
        message: error.message
      });
    }
  }

  // Modell feloldása
  static async unlockModel(req, res) {
    try {
      const { userId, modelType, cost } = req.body;

      if (!userId || !modelType || cost === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID, modell típus és költség szükséges'
        });
      }

      // Játékállapot lekérése
      const gameState = global.gameStates?.get(userId);
      if (!gameState) {
        return res.status(404).json({
          success: false,
          error: 'Játékállapot nem található'
        });
      }

      // Modell feloldása
      try {
        gameState.unlockModel(modelType, cost);
        global.gameStates.set(userId, gameState);

        res.json({
          success: true,
          message: `${modelType} modell sikeresen feloldva`,
          data: {
            modelUnlocked: modelType,
            creditsSpent: cost,
            remainingCredits: gameState.credits,
            unlockedModels: gameState.unlockedModels,
            gameState: gameState.toJSON()
          }
        });

      } catch (unlockError) {
        return res.status(400).json({
          success: false,
          error: unlockError.message,
          currentCredits: gameState.credits,
          requiredCredits: cost
        });
      }

    } catch (error) {
      console.error('Hiba a modell feloldása során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a modell feloldása során',
        message: error.message
      });
    }
  }

  // Küldetés teljesítése
  static async completeChallenge(req, res) {
    try {
      const { userId, challengeId, cost, reward } = req.body;

      if (!userId || !challengeId || cost === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID, küldetés ID és költség szükséges'
        });
      }

      // Játékállapot lekérése
      const gameState = global.gameStates?.get(userId);
      if (!gameState) {
        return res.status(404).json({
          success: false,
          error: 'Játékállapot nem található'
        });
      }

      // Küldetés teljesítése
      try {
        gameState.completeChallenge(challengeId, cost, reward || 5);
        global.gameStates.set(userId, gameState);

        res.json({
          success: true,
          message: 'Küldetés sikeresen teljesítve',
          data: {
            challengeCompleted: challengeId,
            creditsSpent: cost,
            creditsEarned: reward || 5,
            netCredits: (reward || 5) - cost,
            remainingCredits: gameState.credits,
            completedChallenges: gameState.completedChallenges,
            gameState: gameState.toJSON()
          }
        });

      } catch (challengeError) {
        return res.status(400).json({
          success: false,
          error: challengeError.message,
          currentCredits: gameState.credits,
          requiredCredits: cost
        });
      }

    } catch (error) {
      console.error('Hiba a küldetés teljesítése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a küldetés teljesítése során',
        message: error.message
      });
    }
  }

  // Játék statisztikák lekérése
  static async getGameStatistics(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Játékállapot lekérése
      const gameState = global.gameStates?.get(userId);
      if (!gameState) {
        return res.status(404).json({
          success: false,
          error: 'Játékállapot nem található'
        });
      }

      // Statisztikák számítása
      const statistics = gameState.getStatistics();

      res.json({
        success: true,
        message: 'Játék statisztikák sikeresen lekérve',
        data: statistics
      });

    } catch (error) {
      console.error('Hiba a statisztikák lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a statisztikák lekérése során',
        message: error.message
      });
    }
  }

  // Játék újraindítása
  static async resetGame(req, res) {
    try {
      const { userId } = req.params;
      const { playerName, teamName } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Játékállapot alaphelyzetbe állítása
      const gameState = GameState.getDefault(userId);

      if (playerName) {
        gameState.playerName = playerName.trim();
      }
      if (teamName) {
        gameState.teamName = teamName.trim();
      }

      // Mentés
      if (!global.gameStates) {
        global.gameStates = new Map();
      }
      global.gameStates.set(userId, gameState);

      res.json({
        success: true,
        message: 'Játék sikeresen újraindítva',
        data: gameState.toJSON()
      });

    } catch (error) {
      console.error('Hiba a játék újraindítása során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a játék újraindítása során',
        message: error.message
      });
    }
  }

  // Rangsor lekérése
  static async getLeaderboard(req, res) {
    try {
      const { limit = 10 } = req.query;

      if (!global.gameStates) {
        return res.json({
          success: true,
          message: 'Nincs játékállapot',
          data: { leaderboard: [] }
        });
      }

      // Rangsor számítása
      const leaderboard = Array.from(global.gameStates.entries())
        .map(([userId, gameState]) => {
          const stats = gameState.getStatistics();
          return {
            userId: userId.substring(0, 8) + '...',
            playerName: gameState.playerName,
            teamName: gameState.teamName,
            credits: gameState.credits,
            unlockedModels: stats.unlockedModelsCount,
            completedChallenges: stats.completedChallengesCount,
            efficiency: stats.efficiency,
            progress: stats.progress,
            achievements: stats.achievements.length,
            score: stats.efficiency + stats.progress + (stats.achievements.length * 5)
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, parseInt(limit));

      res.json({
        success: true,
        message: 'Rangsor sikeresen lekérve',
        data: {
          leaderboard,
          total: global.gameStates.size,
          limit: parseInt(limit)
        }
      });

    } catch (error) {
      console.error('Hiba a rangsor lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a rangsor lekérése során',
        message: error.message
      });
    }
  }

  // Játék fázis frissítése
  static async updateGamePhase(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Játékállapot lekérése
      const gameState = global.gameStates?.get(userId);
      if (!gameState) {
        return res.status(404).json({
          success: false,
          error: 'Játékállapot nem található'
        });
      }

      // Fázis frissítése
      const newPhase = gameState.updatePhase();
      global.gameStates.set(userId, gameState);

      res.json({
        success: true,
        message: 'Játék fázis sikeresen frissítve',
        data: {
          newPhase,
          gameState: gameState.toJSON()
        }
      });

    } catch (error) {
      console.error('Hiba a fázis frissítése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a fázis frissítése során',
        message: error.message
      });
    }
  }
}

module.exports = GameController;
