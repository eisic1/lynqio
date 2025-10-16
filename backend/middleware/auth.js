const jwt = require('jsonwebtoken');

// Middleware za zaštitu ruta
const authenticateToken = (req, res, next) => {
  try {
    // Uzmi token iz header-a
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    // Verifikuj token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          success: false,
          message: 'Invalid or expired token.' 
        });
      }

      // Dodaj user info u request
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error.' 
    });
  }
};

// Middleware za admin only rute
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin only.' 
    });
  }
  next();
};

module.exports = { 
  authenticateToken, 
  requireAdmin 
};