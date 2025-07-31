// routes/api.js - API útvonalak
const express = require('express');
const router = express.Router();

// Import modellek
const User = require('../models/User');
const GameState = require('../models/GameState');

// Termék adatok (a PDF-ből)
const products = [
  // 1. Címkézett adatcsomag
  { id: 1, weight: 150, color: 'Piros', size: 'Kicsi', category: 'Megfelelő' },
  { id: 2, weight: 200, color: 'Kék', size: 'Nagy', category: 'Selejt' },
  { id: 3, weight: 180, color: 'Zöld', size: 'Közepes', category: 'Megfelelő' },
  { id: 4, weight: 220, color: 'Piros', size: 'Nagy', category: 'Selejt' },
  { id: 5, weight: 160, color: 'Kék', size: 'Kicsi', category: 'Megfelelő' },

  // 2. Címkézett adatcsomag
  { id: 6, weight: 300, color: 'Zöld', size: 'Nagy', category: 'Selejt' },
  { id: 7, weight: 250, color: 'Piros', size: 'Közepes', category: 'Megfelelő' },
  { id: 8, weight: 270, color: 'Kék', size: 'Kicsi', category: 'Selejt' },
  { id: 9, weight: 290, color: 'Zöld', size: 'Nagy', category: 'Megfelelő' },
  { id: 10, weight: 310, color: 'Piros', size: 'Közepes', category: 'Megfelelő' },

  // 3. Címkézett adatcsomag
  { id: 11, weight: 120, color: 'Kék', size: 'Kicsi', category: 'Megfelelő' },
  { id: 12, weight: 140, color: 'Zöld', size: 'Közepes', category: 'Megfelelő' },
  { id: 13, weight: 130, color: 'Piros', size: 'Nagy', category: 'Selejt' },
  { id: 14, weight: 160, color: 'Kék', size: 'Kicsi', category: 'Megfelelő' },
  { id: 15, weight: 150, color: 'Zöld', size: 'Közepes', category: 'Selejt' },

  // 4. Címkézett adatcsomag
  { id: 16, weight: 210, color: 'Piros', size: 'Nagy', category: 'Selejt' },
  { id: 17, weight: 230, color: 'Kék', size: 'Nagy', category: 'Megfelelő' },
  { id: 18, weight: 220, color: 'Zöld', size: 'Közepes', category: 'Megfelelő' },
  { id: 19, weight: 240, color: 'Piros', size: 'Kicsi', category: 'Selejt' },
  { id: 20, weight: 200, color: 'Kék', size: 'Közepes', category: 'Megfelelő' }
];

// Eseménykártyák
const eventCards = [
  {
    id: 1,
    title: "Termelési előrejelzés",
    type: "regression",
    cost: 10,
    message: "A selejt-felismerő rendszer lenyűgöző, de most a jövőbe akarunk látni! Pontos előrejelzést kérünk a következő heti termelési darabszámra a kapacitástervezéshez. A siker kulcsa egy új, prediktív modell!",
    task: "Fektessetek be -10 Tanulási kreditet (TK) egy 'Regressziós modellbe', hogy teljesítsétek a kérést! Enélkül a projekt hatékonysága jelentősen csökken.",
    icon: "📈",
    difficulty: "medium"
  },
  {
    id: 2,
    title: "Energiahatékonysági optimalizálás",
    type: "regression", 
    cost: 10,
    message: "A pénzügyi osztály riadót fújt a növekvő energiaköltségek miatt! Előrejelzést kell készítenetek a gépsorok várható energiafogyasztásáról, hogy optimalizálni tudjuk a felhasználást. Csak egy numerikus becslésre képes modell segíthet!",
    task: "A kihívás teljesítéséhez aktiváljátok a 'Regressziós modellt' -10 Tanulási kredit (TK) befektetésével! Enélkül a gyár működése veszteséges marad.",
    icon: "⚡",
    difficulty: "hard"
  },
  {
    id: 3,
    title: "Prediktív karbantartás",
    type: "regression",
    cost: 10,
    message: "Váratlan géphiba állította le a teljes 3-as gyártósort! A vezetés megelőző megoldást követel. Készítsetek egy modellt, ami előre jelzi a kulcsfontosságú alkatrészek hátralévő élettartamát órában kifejezve!",
    task: "Oldjátok fel a 'Regressziós modell' képességet -10 Tanulási kreditért (TK), hogy megelőzzétek a jövőbeli leállásokat! A gyár termelése és a hírnevünk múlik rajta.",
    icon: "🔧",
    difficulty: "hard"
  },
  {
    id: 4,
    title: "Készletgazdálkodási kihívás",
    type: "regression",
    cost: 10,
    message: "Az alapanyag-készlet kritikusan alacsony, ami a termelés leállásával fenyeget! A beszerzési osztálynak pontos előrejelzésre van szüksége a következő havi alapanyag-szükségletről. Az adatokban rejlik a megoldás!",
    task: "Fektessetek be -10 Tanulási kreditet (TK) egy 'Regressziós modellbe' a pontos becsléshez! Ha kifogytok az alapanyagból, a küldetés elbukik.",
    icon: "📦",
    difficulty: "medium"
  }
];

// Memória alapú adattárolás (éles környezetben adatbázis lenne)
let gameStates = new Map();

// GET /api/products - Termékadatok lekérése
router.get('/products', (req, res) => {
  try {
    const stats = {
      total: products.length,
      megfelelő: products.filter(p => p.category === 'Megfelelő').length,
      selejt: products.filter(p => p.category === 'Selejt').length
    };
    stats.selejtArány = ((stats.selejt / stats.total) * 100).toFixed(1);

    res.json({
      success: true,
      data: {
        products,
        stats
      },
      message: 'Termékadatok sikeresen lekérve'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a termékadatok lekérése során',
      message: error.message
    });
  }
});

// GET /api/event-cards - Eseménykártyák lekérése
router.get('/event-cards', (req, res) => {
  try {
    res.json({
      success: true,
      data: eventCards,
      message: 'Eseménykártyák sikeresen lekérve'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba az eseménykártyák lekérése során',
      message: error.message
    });
  }
});

// GET /api/game-state/:userId - Játékállapot lekérése
router.get('/game-state/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó userId paraméter'
      });
    }

    const gameState = gameStates.get(userId) || GameState.getDefault();

    res.json({
      success: true,
      data: gameState,
      message: 'Játékállapot sikeresen lekérve'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a játékállapot lekérése során',
      message: error.message
    });
  }
});

// POST /api/game-state/:userId - Játékállapot mentése
router.post('/game-state/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const gameState = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó userId paraméter'
      });
    }

    if (!GameState.validate(gameState)) {
      return res.status(400).json({
        success: false,
        error: 'Érvénytelen játékállapot adatok'
      });
    }

    gameStates.set(userId, {
      ...gameState,
      lastUpdated: new Date().toISOString()
    });

    res.json({
      success: true,
      data: gameStates.get(userId),
      message: 'Játékállapot sikeresen mentve'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a játékállapot mentése során',
      message: error.message
    });
  }
});

// POST /api/unlock-model - Modell feloldása
router.post('/unlock-model', (req, res) => {
  try {
    const { userId, modelType, cost } = req.body;

    if (!userId || !modelType || !cost) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó adatok: userId, modelType, cost szükséges'
      });
    }

    const gameState = gameStates.get(userId) || GameState.getDefault();

    // Ellenőrzések
    if (gameState.unlockedModels.includes(modelType)) {
      return res.status(400).json({
        success: false,
        error: 'Ez a modell már fel van oldva'
      });
    }

    if (gameState.credits < cost) {
      return res.status(400).json({
        success: false,
        error: 'Nincs elegendő Tanulási kredit',
        required: cost,
        available: gameState.credits
      });
    }

    // Előfeltétel ellenőrzése (regresszió csak klasszifikáció után)
    if (modelType === 'regression' && !gameState.unlockedModels.includes('classification')) {
      return res.status(400).json({
        success: false,
        error: 'Előbb a klasszifikációs modellt kell feloldani'
      });
    }

    // Modell feloldása
    gameState.credits -= cost;
    gameState.unlockedModels.push(modelType);
    gameState.lastUpdated = new Date().toISOString();

    gameStates.set(userId, gameState);

    res.json({
      success: true,
      data: gameState,
      message: `${modelType} modell sikeresen feloldva`,
      modelUnlocked: modelType,
      creditsSpent: cost,
      remainingCredits: gameState.credits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a modell feloldása során',
      message: error.message
    });
  }
});

// POST /api/complete-challenge - Küldetés teljesítése
router.post('/complete-challenge', (req, res) => {
  try {
    const { userId, challengeId, cost, reward = 5 } = req.body;

    if (!userId || !challengeId || !cost) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó adatok: userId, challengeId, cost szükséges'
      });
    }

    const gameState = gameStates.get(userId) || GameState.getDefault();

    // Ellenőrzések
    if (gameState.completedChallenges.includes(challengeId)) {
      return res.status(400).json({
        success: false,
        error: 'Ez a küldetés már teljesítve van'
      });
    }

    if (!gameState.unlockedModels.includes('regression')) {
      return res.status(400).json({
        success: false,
        error: 'A regressziós modell szükséges a küldetések teljesítéséhez'
      });
    }

    if (gameState.credits < cost) {
      return res.status(400).json({
        success: false,
        error: 'Nincs elegendő Tanulási kredit',
        required: cost,
        available: gameState.credits
      });
    }

    // Küldetés teljesítése
    gameState.credits -= cost;
    gameState.credits += reward;
    gameState.completedChallenges.push(challengeId);
    gameState.lastUpdated = new Date().toISOString();

    gameStates.set(userId, gameState);

    res.json({
      success: true,
      data: gameState,
      message: 'Küldetés sikeresen teljesítve',
      challengeCompleted: challengeId,
      creditsSpent: cost,
      creditsEarned: reward,
      netCredits: reward - cost,
      remainingCredits: gameState.credits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a küldetés teljesítése során',
      message: error.message
    });
  }
});

// GET /api/leaderboard - Rangsor (opcionális)
router.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = Array.from(gameStates.entries()).map(([userId, state]) => ({
      userId: userId.substring(0, 8) + '...', // Részleges anonimizálás
      teamName: state.teamName,
      credits: state.credits,
      unlockedModels: state.unlockedModels.length,
      completedChallenges: state.completedChallenges.length,
      score: state.credits + (state.unlockedModels.length * 20) + (state.completedChallenges.length * 10)
    })).sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      data: leaderboard,
      message: 'Rangsor sikeresen lekérve'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a rangsor lekérése során',
      message: error.message
    });
  }
});

// DELETE /api/game-state/:userId - Játékállapot törlése (újraindítás)
router.delete('/game-state/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Hiányzó userId paraméter'
      });
    }

    gameStates.delete(userId);

    res.json({
      success: true,
      message: 'Játékállapot sikeresen törölve',
      data: GameState.getDefault()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hiba a játékállapot törlése során',
      message: error.message
    });
  }
});

module.exports = router;
