// middleware/errorHandler.js - Központi hibakezelő
const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err);

  // Alapértelmezett hibaüzenet
  let error = { ...err };
  error.message = err.message;

  // Mongoose/MongoDB hibák kezelése
  if (err.name === 'CastError') {
    const message = 'Érvénytelen azonosító formátum';
    error = { message, statusCode: 400 };
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = 'Ez az adat már létezik';
    error = { message, statusCode: 400 };
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Szerver hiba',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
