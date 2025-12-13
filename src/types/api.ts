// Authentication Request Types
// Type definitions for API requests and responses

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  id: string;
  newPassword: string;
}

export interface ResendConfirmationEmailRequest {
  email: string;
}

export interface ConfirmationEmailRequest {
  id: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Authentication Response Types
export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// API Error Types
export interface ValidationError {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]> | string[];
  traceId?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
  type?: string;
  title?: string;
  traceId?: string;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
  isEmailConfirmed?: boolean;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Query Keys
export const QUERY_KEYS = {
  auth: {
    user: ["auth", "user"] as const,
    profile: ["auth", "profile"] as const,
  },
} as const;
