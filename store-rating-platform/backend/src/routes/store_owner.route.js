const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/store_owner.controller'); 
const { protect, requireRole } = require('../middlewares/auth.middleware');

router.get('/dashboard', protect, requireRole(['STORE_OWNER']), storeOwnerController.getDashboard);

module.exports = router;