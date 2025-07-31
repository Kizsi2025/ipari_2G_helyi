// middleware/validation.js - Adatvalidációs middleware
const { body, param, query, validationResult } = require('express-validator');

// Validációs hibák kezelése
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validációs hiba',
      details: errors.array(),
      message: 'Kérlek javítsd ki a hibás adatokat'
    });
  }
  next();
};

// Felhasználó validáció
const validateUser = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('A név 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('teamName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('A csapat neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Érvényes email cím szükséges')
    .normalizeEmail(),
  handleValidationErrors
];

// Felhasználó regisztráció validáció
const validateUserRegistration = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('A név 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('teamName')
    .isLength({ min: 2, max: 50 })
    .withMessage('A csapat neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Érvényes email cím szükséges')
    .normalizeEmail(),
  handleValidationErrors
];

// Felhasználó bejelentkezés validáció
const validateUserLogin = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('A név 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('teamName')
    .isLength({ min: 2, max: 50 })
    .withMessage('A csapat neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  handleValidationErrors
];

// Felhasználó frissítés validáció
const validateUserUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('A név 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('teamName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('A csapat neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Érvényes email cím szükséges')
    .normalizeEmail(),
  handleValidationErrors
];

// Játék indítás validáció
const validateGameStart = [
  body('userId')
    .isLength({ min: 5 })
    .withMessage('Érvényes felhasználó ID szükséges')
    .trim(),
  body('playerName')
    .isLength({ min: 2, max: 50 })
    .withMessage('A játékos neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('teamName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('A csapat neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  handleValidationErrors
];

// Játékállapot validáció
const validateGameState = [
  body('credits')
    .isInt({ min: 0, max: 100 })
    .withMessage('A kreditek 0-100 között legyenek'),
  body('unlockedModels')
    .isArray()
    .withMessage('A feloldott modellek tömb legyen'),
  body('unlockedModels.*')
    .isIn(['classification', 'regression'])
    .withMessage('Érvénytelen modell típus'),
  body('completedChallenges')
    .isArray()
    .withMessage('A teljesített kihívások tömb legyen'),
  body('currentPhase')
    .optional()
    .isIn(['start', 'dashboard', 'models', 'events', 'data', 'presentation', 'completed'])
    .withMessage('Érvénytelen játék fázis'),
  body('playerName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('A játékos neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  body('teamName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('A csapat neve 2-50 karakter között legyen')
    .trim()
    .escape(),
  handleValidationErrors
];

// Modell feloldás validáció
const validateModelUnlock = [
  body('userId')
    .isLength({ min: 5 })
    .withMessage('Érvényes felhasználó ID szükséges'),
  body('modelType')
    .isIn(['classification', 'regression'])
    .withMessage('Érvényes modell típus szükséges (classification/regression)'),
  body('cost')
    .isInt({ min: 1, max: 50 })
    .withMessage('A költség 1-50 között legyen'),
  handleValidationErrors
];

// Kihívás teljesítés validáció
const validateChallengeComplete = [
  body('userId')
    .isLength({ min: 5 })
    .withMessage('Érvényes felhasználó ID szükséges'),
  body('challengeId')
    .isIn(['production_forecast', 'energy_optimization', 'predictive_maintenance', 'inventory_management'])
    .withMessage('Érvényes kihívás ID szükséges'),
  body('cost')
    .isInt({ min: 1, max: 50 })
    .withMessage('A költség 1-50 között legyen'),
  body('reward')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('A jutalom 0-20 között legyen'),
  handleValidationErrors
];

// Achievement validáció
const validateAchievement = [
  body('achievement')
    .isObject()
    .withMessage('Achievement objektum szükséges'),
  body('achievement.id')
    .isLength({ min: 3, max: 50 })
    .withMessage('Achievement ID 3-50 karakter között legyen')
    .trim(),
  body('achievement.name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Achievement név 3-100 karakter között legyen')
    .trim()
    .escape(),
  body('achievement.description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Achievement leírás maximum 500 karakter legyen')
    .trim()
    .escape(),
  body('achievement.points')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Achievement pontok 1-100 között legyenek'),
  handleValidationErrors
];

// Statisztikák validáció
const validateStatistics = [
  body('statistics')
    .isObject()
    .withMessage('Statisztikák objektum szükséges'),
  body('statistics.totalSessions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Összes munkamenet nem negatív szám legyen'),
  body('statistics.totalTimeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Összes idő nem negatív szám legyen'),
  body('statistics.highestScore')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Legmagasabb pontszám nem negatív szám legyen'),
  body('statistics.modelsUnlocked')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Feloldott modellek 0-10 között legyenek'),
  body('statistics.challengesCompleted')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Teljesített kihívások 0-50 között legyenek'),
  handleValidationErrors
];

// Termék validáció
const validateProduct = [
  body('id')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Termék ID 1-1000 között legyen'),
  body('weight')
    .isInt({ min: 50, max: 500 })
    .withMessage('Súly 50-500 gramm között legyen'),
  body('color')
    .isIn(['Piros', 'Kék', 'Zöld'])
    .withMessage('Szín Piros, Kék vagy Zöld lehet'),
  body('size')
    .isIn(['Kicsi', 'Közepes', 'Nagy'])
    .withMessage('Méret Kicsi, Közepes vagy Nagy lehet'),
  body('category')
    .isIn(['Megfelelő', 'Selejt'])
    .withMessage('Kategória Megfelelő vagy Selejt lehet'),
  body('package')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Csomag száma 1-4 között legyen'),
  handleValidationErrors
];

// Query paraméter validációk
const validateProductQuery = [
  query('category')
    .optional()
    .isIn(['Megfelelő', 'Selejt'])
    .withMessage('Kategória Megfelelő vagy Selejt lehet'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 között legyen'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset nem negatív szám legyen'),
  query('sortBy')
    .optional()
    .isIn(['id', 'weight', 'color', 'size', 'category'])
    .withMessage('Rendezés csak megadott mezők alapján lehetséges'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Rendezési irány asc vagy desc lehet'),
  handleValidationErrors
];

// Eseménykártya query validáció
const validateEventCardQuery = [
  query('category')
    .optional()
    .isIn(['production', 'energy', 'maintenance', 'logistics'])
    .withMessage('Kategória production, energy, maintenance vagy logistics lehet'),
  query('difficulty')
    .optional()
    .isIn(['könnyű', 'közepes', 'nehéz'])
    .withMessage('Nehézség könnyű, közepes vagy nehéz lehet'),
  query('type')
    .optional()
    .isIn(['classification', 'regression'])
    .withMessage('Típus classification vagy regression lehet'),
  handleValidationErrors
];

// Keresési validáció
const validateSearch = [
  query('query')
    .isLength({ min: 2, max: 100 })
    .withMessage('Keresési kifejezés 2-100 karakter között legyen')
    .trim()
    .escape(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit 1-50 között legyen'),
  handleValidationErrors
];

// Egyedi validációs middleware-ek
const validateUserId = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;

  if (!userId || typeof userId !== 'string' || userId.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Érvényes felhasználó ID szükséges',
      message: 'A felhasználó ID legalább 5 karakter hosszú legyen'
    });
  }

  next();
};

const validatePagination = (req, res, next) => {
  const { limit, offset } = req.query;

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Érvénytelen limit érték',
      message: 'A limit 1-100 között legyen'
    });
  }

  if (offset && (isNaN(offset) || parseInt(offset) < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Érvénytelen offset érték',
      message: 'Az offset nem lehet negatív'
    });
  }

  req.pagination = {
    limit: limit ? parseInt(limit) : 10,
    offset: offset ? parseInt(offset) : 0
  };

  next();
};

module.exports = {
  validateUser,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateGameStart,
  validateGameState,
  validateModelUnlock,
  validateChallengeComplete,
  validateAchievement,
  validateStatistics,
  validateProduct,
  validateProductQuery,
  validateEventCardQuery,
  validateSearch,
  validateUserId,
  validatePagination,
  handleValidationErrors
};
