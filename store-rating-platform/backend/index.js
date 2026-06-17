const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const logger = require('./src/config/logger');
const reqMiddleware = require('./src/middlewares/req.middleware');
const apiRouter = require('./src/routes');
const notFoundMiddleware = require('./src/middlewares/notFound.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();


app.use(cors());
app.use(express.json());
app.use(reqMiddleware); 


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});


app.use('/api', apiRouter);


app.use(notFoundMiddleware);


app.use(errorMiddleware);


app.listen(config.PORT, () => {
  logger.info(`🚀 Store Rating Engine online on port ${config.PORT} [Env: ${config.NODE_ENV}]`);
});