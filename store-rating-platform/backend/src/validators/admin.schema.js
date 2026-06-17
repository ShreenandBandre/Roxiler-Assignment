const { z } = require('zod');

const adminCreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  address: z.string().max(400).optional(),
  role: z.enum(['ADMIN', 'NORMAL_USER', 'STORE_OWNER'], { message: "Invalid role assigned" })
});

const adminCreateStoreSchema = z.object({
  name: z.string().min(1, { message: "Store name is required" }),
  email: z.string().email({ message: "Invalid store email format" }),
  address: z.string().min(1, { message: "Store address is required" }),
  ownerName: z.string().min(1, { message: "Owner name is required for automation" }),
  ownerEmail: z.string().email({ message: "Invalid owner email format" })
});

module.exports = {
  adminCreateUserSchema,
  adminCreateStoreSchema
};