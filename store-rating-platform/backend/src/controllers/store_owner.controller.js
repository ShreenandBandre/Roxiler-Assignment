const storeOwnerService = require('../services/store_owner.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await storeOwnerService.getOwnerDashboard(req.user.id);
  res.status(200).json({ success: true, data: stats, message: "Store Owner dashboard statistics loaded" });
});