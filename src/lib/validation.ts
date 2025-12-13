import { z } from "zod";

// Base email validation schema
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

// Base password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

// Name validation schema
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must be less than 50 characters");

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Register form validation schema
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Forgot password form validation schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password form validation schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    token: z.string().min(1, "Reset token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Email verification form validation schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

// API Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      name: string;
      email: string;
      isVerified: boolean;
    };
    token?: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
