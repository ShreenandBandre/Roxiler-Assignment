const AppError = require('../utils/error');

const validate = (schema) => {
  return (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError('Request body is missing or empty', 400));
    }

    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      
      console.log("❌ ZOD FULL ERROR DETAILS:", JSON.stringify(result.error, null, 2));

      const errorsArray = result.error?.errors || [];
      if (errorsArray.length === 0) {
        
        return next(new AppError(`Validation failed parsing error: ${result.error.message}`, 400));
      }

      const errorMessages = errorsArray
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
        
      return next(new AppError(errorMessages, 400));
    }
    
    req.body = result.data;
    next();
  };
};

module.exports = validate;