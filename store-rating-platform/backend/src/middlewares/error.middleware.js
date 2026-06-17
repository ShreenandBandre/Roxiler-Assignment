const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let status = err.status || 'error';

  
  if (err.code === 'P2002') {
    
    statusCode = 400;
    status = 'fail';
    const fields = err.meta?.target ? err.meta.target.join(', ') : 'field';
    message = `A record with this ${fields} already exists inside the system.`;
  }

  if (err.code === 'P2025') {
    
    statusCode = 404;
    status = 'fail';
    message = 'The target record operation failed because it does not exist.';
  }

  
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    status = 'fail';
    message = 'Invalid authentication session token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    status = 'fail';
    message = 'Your authentication session token has expired. Please log in again.';
  }

  
  logger.error({
    message,
    statusCode,
    requestId: req.id,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  
  res.status(statusCode).json({
    success: false,
    status: status,
    message: message,
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};