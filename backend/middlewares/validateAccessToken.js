const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

// Middleware to validate Access Token from Authorization header
function validateAccessToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: 'Access token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Attach decoded token payload to request object for downstream handlers
      req.user = { userId: decoded.userId, email: decoded.email };
      next();
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { validateAccessToken };
