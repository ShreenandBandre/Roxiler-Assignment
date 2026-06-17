const AppError = require('../utils/error');

module.exports = (req, res, next) => {
  
  next(new AppError(`The requested endpoint (${req.method} ${req.originalUrl}) was not found on this server.`, 404));
};