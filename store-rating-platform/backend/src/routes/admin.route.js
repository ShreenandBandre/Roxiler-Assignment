const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const validate = require('../middlewares/validate.middleware');
const { adminCreateUserSchema, adminCreateStoreSchema } = require('../validators/admin.schema');
const { protect, requireRole } = require('../middlewares/auth.middleware');


router.use(protect, requireRole(['ADMIN']));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', validate(adminCreateUserSchema), adminController.createUser);
router.post('/stores', validate(adminCreateStoreSchema), adminController.createStore);
router.get('/users', adminController.getUsers);
router.get('/stores', adminController.getStores);
router.get('/users/:id', adminController.getUserById);

module.exports = router;