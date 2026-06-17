const { v4: uuidv4 } = require('uuid'); 


module.exports = (req, res, next) => {
  req.id = req.headers['x-request-id'] || require('crypto').randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
};