// Simple API key validation
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Development mode - allow all
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'API kulcs szükséges'
    });
  }
  
  next();
};

module.exports = {
  validateApiKey
};
