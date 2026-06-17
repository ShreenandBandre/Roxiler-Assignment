const { z } = require('zod');

const submitRatingSchema = z.object({
  storeId: z.string().uuid({ message: "Valid storeId (UUID) is required" }),
  value: z.number()
    .int({ message: "Rating must be an integer value" })
    .min(1, { message: "Rating cannot be less than 1" })
    .max(5, { message: "Rating cannot be more than 5" })
});

module.exports = { submitRatingSchema };