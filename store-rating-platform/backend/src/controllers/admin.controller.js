const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json({ success: true, data: stats, message: "Dashboard metrics fetched successfully" });
});

exports.createUser = asyncHandler(async (req, res) => {
  const newUser = await adminService.createUser(req.body);
  res.status(201).json({ success: true, data: newUser, message: "User account created successfully" });
});


exports.createStore = asyncHandler(async (req, res) => {
  const newStore = await adminService.createStore(req.body);
  res.status(201).json({ success: true, data: newStore, message: "Store and automated owner registered successfully" });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listUsers(req.query);
  res.status(200).json({ success: true, data: users, message: "Users list retrieved successfully" });
});

exports.getStores = asyncHandler(async (req, res) => {
  const stores = await adminService.listStores(req.query);
  res.status(200).json({ success: true, data: stores, message: "Stores list retrieved successfully" });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const userDetails = await adminService.getUserDetail(req.params.id);
  res.status(200).json({ success: true, data: userDetails, message: "User detailed insights loaded" });
});