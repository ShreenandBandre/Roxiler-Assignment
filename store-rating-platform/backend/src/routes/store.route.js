const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const validate = require('../middlewares/validate.middleware');
const { submitRatingSchema } = require('../validators/rating.schema');
const { protect, requireRole } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', requireRole(['NORMAL_USER']), storeController.getStoresForUser);
router.post('/rate', requireRole(['NORMAL_USER']), validate(submitRatingSchema), storeController.submitRating);


module.exports = router;