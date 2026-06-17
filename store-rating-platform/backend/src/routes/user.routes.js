const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.put('/update-password', async (req, res) => {
  try {
   
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized link. Access Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Identity node not found in system matrix.' });
    }

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password authentication failed.' });
    }

    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Security key length must be at least 8 characters.' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    
    console.log(`[SECURITY MATRIX] Password updated successfully for [Role: ${user.role}] (ID: ${user.id})`);

    return res.status(200).json({ message: 'Matrix credentials synchronized successfully.' });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token structure.' });
    }
    console.error('Unified Password Reset Error:', error);
    return res.status(500).json({ message: 'Internal operational failure during patch script.' });
  }
});

module.exports = router;