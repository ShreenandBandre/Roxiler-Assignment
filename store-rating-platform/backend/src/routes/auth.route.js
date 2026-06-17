const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema, updatePasswordSchema } = require('../validators/auth.schema');
const { protect } = require('../middlewares/auth.middleware');

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.put('/update-password', protect, validate(updatePasswordSchema), authController.updatePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;