// middleware/auth.js - Authentication Middleware
const verifySession = (req, res, next) => {
  const sessionId = req.header('x-session-id');
  
  if (!sessionId || !global.sessions?.has(sessionId)) {
    return res.status(401).json({
      success: false,
      error: 'Érvénytelen session',
      message: 'Session lejárt vagy nem létezik'
    });
  }

  const session = global.sessions.get(sessionId);
  req.session = session;
  req.user = session.user;
  next();
};

module.exports = {
  verifySession
};
