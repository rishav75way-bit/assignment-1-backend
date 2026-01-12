import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character");

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: passwordSchema,
  }),
});
