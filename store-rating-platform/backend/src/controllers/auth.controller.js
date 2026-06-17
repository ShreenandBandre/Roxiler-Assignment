const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

exports.signup = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "Registration successful!",
    data: user
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json({
    success: true,
    message: "Login successful!",
    data: result
  });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
  res.status(200).json({
    success: true,
    message: "Password updated successfully!"
  });
});

exports.logout = asyncHandler(async (req, res) => {
  
  res.status(200).json({
    success: true,
    message: "Logged out successfully (Discard token on client)"
  });
});