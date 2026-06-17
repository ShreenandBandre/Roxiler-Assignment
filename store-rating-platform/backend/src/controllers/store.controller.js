const storeService = require('../services/store.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getStoresForUser = asyncHandler(async (req, res) => {
  const stores = await storeService.listStoresForUser(req.user.id, req.query);
  res.status(200).json({ success: true, data: stores, message: "Stores fetched successfully" });
});

exports.submitRating = asyncHandler(async (req, res) => {
  const { storeId, value } = req.body;
  const rating = await storeService.upsertRating(req.user.id, storeId, value);
  res.status(200).json({ success: true, data: rating, message: "Rating submitted successfully" });
});