const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const storeRoutes = require('./store.route');      
const storeOwnerRoutes = require('./store_owner.route'); 
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stores',storeRoutes);                
router.use('/store-owner', storeOwnerRoutes);
router.use('/users', userRoutes);

module.exports = router;