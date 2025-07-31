// middleware/errorHandler.js - Hibakezelő middleware
// Általános hibakezelő middleware
const handleError = (err, req, res, next) => {
  console.error('Hiba történt:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // Alapértelmezett hiba státusz és üzenet
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Belső szerver hiba';
  let errorType = err.name || 'UnknownError';

  // Specifikus hibatípusok kezelése
  switch (errorType) {
    case 'ValidationError':
      statusCode = 400;
      message = 'Érvénytelen adatok';
      break;

    case 'CastError':
      statusCode = 400;
      message = 'Érvénytelen adat formátum';
      break;

    case 'UnauthorizedError':
      statusCode = 401;
      message = 'Hitelesítés szükséges';
      break;

    case 'ForbiddenError':
      statusCode = 403;
      message = 'Hozzáférés megtagadva';
      break;

    case 'NotFoundError':
      statusCode = 404;
      message = 'Az erőforrás nem található';
      break;

    case 'ConflictError':
      statusCode = 409;
      message = 'Konfliktus a kérésben';
      break;

    case 'RateLimitError':
      statusCode = 429;
      message = 'Túl sok kérés';
      break;
  }

  // Fejlesztői környezetben részletesebb hibainformáció
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    success: false,
    error: message,
    type: errorType,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Fejlesztői információk hozzáadása
  if (isDevelopment) {
    errorResponse.details = {
      stack: err.stack,
      originalMessage: err.message,
      requestBody: req.body,
      requestParams: req.params,
      requestQuery: req.query
    };
  }

  // Speciális hibák esetén további információk
  if (err.code === 'ENOENT') {
    errorResponse.error = 'Fájl nem található';
    statusCode = 404;
  }

  if (err.code === 'EACCES') {
    errorResponse.error = 'Hozzáférés megtagadva a fájlhoz';
    statusCode = 403;
  }

  res.status(statusCode).json(errorResponse);
};

// 404 hibakezelő
const handle404 = (req, res, next) => {
  const error = {
    success: false,
    error: 'Endpoint nem található',
    message: `A kért útvonal (${req.method} ${req.path}) nem létezik`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/health - Rendszer állapot',
      'GET /api/products - Termék adatok',
      'GET /api/event-cards - Eseménykártyák',
      'GET /api/models - Modell információk',
      'POST /api/users - Felhasználó létrehozás',
      'GET /api/users/:userId - Felhasználó lekérés',
      'POST /api/game/start - Játék indítás',
      'GET /api/game/:userId - Játékállapot lekérés',
      'POST /api/game/unlock-model - Modell feloldás',
      'POST /api/game/complete-challenge - Kihívás teljesítés',
      'GET /api/leaderboard - Rangsor'
    ]
  };

  res.status(404).json(error);
};

// Aszinkron hibakezelő wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Speciális hibakezelők
const handleDatabaseError = (err, req, res, next) => {
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    console.error('Adatbázis hiba:', err);
    return res.status(500).json({
      success: false,
      error: 'Adatbázis hiba történt',
      message: 'Kérlek próbáld újra később',
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

const handleFileError = (err, req, res, next) => {
  if (err.code === 'ENOENT' || err.code === 'EACCES') {
    console.error('Fájl hiba:', err);
    return res.status(500).json({
      success: false,
      error: 'Fájl hiba történt',
      message: 'A kért fájl nem elérhető',
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

const handleNetworkError = (err, req, res, next) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    console.error('Hálózati hiba:', err);
    return res.status(503).json({
      success: false,
      error: 'Szolgáltatás nem elérhető',
      message: 'Külső szolgáltatás nem elérhető',
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

// Validációs hibakezelő
const handleValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));

    return res.status(400).json({
      success: false,
      error: 'Validációs hiba',
      details: errors,
      message: 'Kérlek javítsd ki a hibás adatokat',
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

// Request timeout kezelő
const handleTimeout = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: 'Kérés időtúllépés',
          message: 'A kérés feldolgozása túl sokáig tartott',
          timestamp: new Date().toISOString(),
          timeout: timeout
        });
      }
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    next();
  };
};

// Hiba naplózó middleware
const logError = (err, req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    message: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  };

  // Érzékeny adatok eltávolítása
  if (logData.request.headers.authorization) {
    logData.request.headers.authorization = '[REDACTED]';
  }
  if (logData.request.headers['x-api-key']) {
    logData.request.headers['x-api-key'] = '[REDACTED]';
  }

  console.error('ERROR LOG:', JSON.stringify(logData, null, 2));
  next(err);
};

// Szerver hiba monitor
const monitorServerHealth = () => {
  const startTime = Date.now();
  let errorCount = 0;
  let requestCount = 0;

  return (req, res, next) => {
    requestCount++;

    const originalSend = res.send;
    res.send = function(data) {
      if (res.statusCode >= 500) {
        errorCount++;
      }
      return originalSend.call(this, data);
    };

    // Egészségügyi metrikák
    req.serverHealth = {
      uptime: Date.now() - startTime,
      errorCount,
      requestCount,
      errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0
    };

    next();
  };
};

module.exports = {
  handleError,
  handle404,
  asyncHandler,
  handleDatabaseError,
  handleFileError,
  handleNetworkError,
  handleValidationError,
  handleTimeout,
  logError,
  monitorServerHealth
};
