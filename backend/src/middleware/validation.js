// middleware/validation.js - Validációs middleware
const validateUserRegistration = (req, res, next) => {
  const { name, teamName } = req.body;

  const errors = [];

  // Név validáció
  if (!name || typeof name !== 'string') {
    errors.push('Név megadása kötelező');
  } else if (name.length < 2) {
    errors.push('Név minimum 2 karakter hosszú kell legyen');
  } else if (name.length > 50) {
    errors.push('Név maximum 50 karakter hosszú lehet');
  }

  // Csapatnév validáció
  if (!teamName || typeof teamName !== 'string') {
    errors.push('Csapatnév megadása kötelező');
  } else if (teamName.length < 2) {
    errors.push('Csapatnév minimum 2 karakter hosszú kell legyen');
  } else if (teamName.length > 50) {
    errors.push('Csapatnév maximum 50 karakter hosszú lehet');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validációs hiba',
      details: errors
    });
  }

  next();
};

const validateGameAction = (req, res, next) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      error: 'Action mező kötelező'
    });
  }

  const validActions = [
    'unlock_model',
    'complete_challenge',
    'update_progress',
    'save_state'
  ];

  if (!validActions.includes(action)) {
    return res.status(400).json({
      success: false,
      error: 'Ismeretlen action típus',
      validActions
    });
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validateGameAction
};
