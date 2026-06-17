const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  address: z.string().max(400).optional(),
  role: z.enum(['ADMIN', 'NORMAL_USER', 'STORE_OWNER']).optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(4),
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema
};