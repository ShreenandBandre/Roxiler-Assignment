const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/error');
const prisma = require('../config/prisma');


const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication failed. Token missing.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return next(new AppError('The token holder user no longer exists', 401));
    }

    req.user = user; 
    next();
  } catch (error) {
    return next(new AppError('Authentication failed. Token invalid or expired.', 401));
  }
};


const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`Access Denied. Forbidden for role: ${req.user?.role || 'Guest'}`, 403));
    }
    next();
  };
};

module.exports = { protect, requireRole };