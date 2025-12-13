import axios, { AxiosError } from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgetPasswordRequest,
  ResetPasswordRequest,
  ResendConfirmationEmailRequest,
  ConfirmationEmailRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidationError,
} from "../types/api";
import { env } from "./env";

// Create axios instance for auth endpoints
const authClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Authentication API client
 * All endpoints return typed responses and handle errors consistently
 */
export const authApi = {
  /**
   * Login endpoint
   * POST /api/v1/Auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authClient.post<LoginResponse>(
      "/Auth/login",
      data
    );
    return response.data;
  },

  /**
   * Register endpoint
   * POST /api/v1/Auth/register
   */
  register: async (data: RegisterRequest): Promise<void> => {
    await authClient.post("/Auth/register", data);
  },

  /**
   * Forgot password endpoint
   * POST /api/v1/Auth/forgot-password
   */
  forgotPassword: async (data: ForgetPasswordRequest): Promise<void> => {
    await authClient.post("/Auth/forgot-password", data);
  },

  /**
   * Reset password endpoint
   * POST /api/v1/Auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await authClient.post("/Auth/reset-password", data);
  },

  /**
   * Resend confirmation code endpoint
   * POST /api/v1/Auth/resend-confirmation-code
   */
  resendConfirmationCode: async (
    data: ResendConfirmationEmailRequest
  ): Promise<void> => {
    await authClient.post("/Auth/resend-confirmation-code", data);
  },

  /**
   * Confirm email endpoint
   * POST /api/v1/Auth/confirm-email
   */
  confirmEmail: async (data: ConfirmationEmailRequest): Promise<void> => {
    await authClient.post("/Auth/confirm-email", data);
  },

  /**
   * Refresh token endpoint
   * POST /api/v1/Auth/refresh
   */
  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const response = await authClient.post<RefreshTokenResponse>(
      "/Auth/refresh",
      data
    );
    return response.data;
  },
};

/**
 * Type guard to check if error is a ValidationError
 */
export const isValidationError = (
  error: unknown
): error is AxiosError<ValidationError> => {
  return (
    axios.isAxiosError(error) &&
    error.response?.data !== undefined &&
    typeof error.response.data === "object" &&
    "errors" in error.response.data &&
    "status" in error.response.data &&
    "title" in error.response.data
  );
};

/**
 * Check if a string is an error code (not a descriptive message)
 */
const isErrorCode = (str: string): boolean => {
  if (!str || typeof str !== "string") return false;
  
  // Error codes are typically:
  // - Contain dots (e.g., "User.InvalidCredentials")
  // - Or are PascalCase without spaces and short
  // - Don't contain lowercase words that indicate it's a message
  
  // If it contains a dot, it's likely a code (e.g., "User.InvalidCredentials")
  if (str.includes(".")) {
    return true;
  }
  
  // Check if it's PascalCase (starts with uppercase, no spaces, short)
  const isPascalCase = /^[A-Z][a-zA-Z]*$/.test(str);
  const isShort = str.length < 30;
  
  // If it's PascalCase and short, it might be a code
  // But exclude if it contains common message words
  if (isPascalCase && isShort) {
    const lowerStr = str.toLowerCase();
    // If it contains message-like words, it's probably a message
    const hasMessageWords = 
      lowerStr.includes("invalid") ||
      lowerStr.includes("already") ||
      lowerStr.includes("taken") ||
      lowerStr.includes("required") ||
      lowerStr.includes("must") ||
      lowerStr.includes("should");
    
    return !hasMessageWords;
  }
  
  return false;
};

/**
 * Get default error message for error codes when no message is provided
 */
const getDefaultErrorMessage = (errorCode: string): string => {
  // Handle codes with dots (e.g., "User.InvalidCredentials")
  const code = errorCode.includes(".") ? errorCode.split(".").pop() : errorCode;
  
  const defaultMessages: Record<string, string> = {
    DuplicateUserName: "This username is already taken",
    DuplicateEmail: "This email is already registered",
    InvalidEmail: "Please enter a valid email address",
    InvalidPassword: "Invalid password",
    PasswordTooShort: "Password is too short",
    PasswordRequiresDigit: "Password must contain at least one digit",
    PasswordRequiresLower: "Password must contain at least one lowercase letter",
    PasswordRequiresUpper: "Password must contain at least one uppercase letter",
    PasswordRequiresNonAlphanumeric: "Password must contain at least one special character",
    InvalidLogin: "Invalid email or username",
    InvalidCredentials: "Invalid email/password",
    UserNotFound: "User not found",
    EmailNotConfirmed: "Email not confirmed",
    InvalidToken: "Invalid token",
    ExpiredToken: "Token has expired",
    InvalidCode: "Invalid verification code",
  };

  return defaultMessages[code || ""] || errorCode;
};

/**
 * Map server error codes to form field names
 */
const mapErrorCodeToField = (errorCode: string): string | null => {
  // Handle codes with dots (e.g., "User.InvalidCredentials")
  const code = errorCode.includes(".") ? errorCode.split(".").pop() : errorCode;
  
  const errorCodeMap: Record<string, string> = {
    DuplicateUserName: "userName",
    DuplicateEmail: "email",
    InvalidEmail: "email",
    InvalidPassword: "password",
    PasswordTooShort: "password",
    PasswordRequiresDigit: "password",
    PasswordRequiresLower: "password",
    PasswordRequiresUpper: "password",
    PasswordRequiresNonAlphanumeric: "password",
    InvalidLogin: "emailOrUsername",
    InvalidCredentials: "emailOrUsername",
    UserNotFound: "email",
    EmailNotConfirmed: "email",
    InvalidToken: "code",
    ExpiredToken: "code",
    InvalidCode: "code",
  };

  return errorCodeMap[code || ""] || null;
};

/**
 * Extract error message from API error
 * Handles both validation errors and standard API errors
 * Always prefers descriptive messages over error codes
 */
export const extractErrorMessage = (error: unknown): string => {
  if (isValidationError(error)) {
    const validationError = error.response?.data;
    if (validationError?.errors) {
      // Handle array format errors
      if (Array.isArray(validationError.errors)) {
        // Find the first descriptive error message (not an error code)
        const descriptiveError = validationError.errors.find(
          (err) => typeof err === "string" && !isErrorCode(err)
        );
        if (descriptiveError) {
          return descriptiveError;
        }
        // If no descriptive error found, return the first one
        if (validationError.errors.length > 0) {
          return validationError.errors[0];
        }
      }
      // Handle object format errors
      else if (typeof validationError.errors === "object") {
        const firstErrorKey = Object.keys(validationError.errors)[0];
        const firstErrorMessages = validationError.errors[firstErrorKey];
        if (firstErrorMessages && firstErrorMessages.length > 0) {
          // Prefer descriptive messages over codes
          const descriptiveMsg = firstErrorMessages.find((msg) => !isErrorCode(msg));
          return descriptiveMsg || firstErrorMessages[0];
        }
      }
    }
    return validationError?.title || "Validation error occurred";
  }

  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === "object" && "message" in data) {
        return (data as { message: string }).message;
      }
      if (typeof data === "string") {
        return data;
      }
    }
    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Extract all validation error messages grouped by field
 * Handles both array and object format errors
 */
export const extractValidationErrors = (
  error: unknown
): Record<string, string[]> => {
  if (isValidationError(error)) {
    const validationError = error.response?.data;
    if (!validationError?.errors) {
      return {};
    }

    // Handle array format errors
    if (Array.isArray(validationError.errors)) {
      const fieldErrors: Record<string, string[]> = {};
      
      // Process errors in pairs: code and message
      // The pattern is typically: [code, message, code, message, ...]
      for (let i = 0; i < validationError.errors.length; i++) {
        const errorItem = validationError.errors[i];
        if (typeof errorItem !== "string") continue;
        
        // Check if this is an error code
        if (isErrorCode(errorItem)) {
          // Try to find the corresponding message (next item in array)
          const message = 
            i + 1 < validationError.errors.length &&
            typeof validationError.errors[i + 1] === "string" &&
            !isErrorCode(validationError.errors[i + 1])
              ? validationError.errors[i + 1]
              : null;
          
          // Map error code to field name
          const fieldName = mapErrorCodeToField(errorItem);
          
          if (fieldName) {
            // Use the message if available, otherwise use a default
            const errorMessage = message || getDefaultErrorMessage(errorItem);
            fieldErrors[fieldName] = fieldErrors[fieldName] || [];
            fieldErrors[fieldName].push(errorMessage);
          } else {
            // Unknown error code, use message if available
            const errorMessage = message || errorItem;
            fieldErrors["root"] = fieldErrors["root"] || [];
            fieldErrors["root"].push(errorMessage);
          }
          
          // Skip the next item if we used it as a message
          if (message) i++;
        } else {
          // This is a descriptive message without a code
          // Try to determine the field from the message content
          const lowerError = errorItem.toLowerCase();
          let fieldName: string | null = null;
          
          if (lowerError.includes("username") || lowerError.includes("user name")) {
            fieldName = "userName";
          } else if (lowerError.includes("email")) {
            fieldName = "email";
          } else if (lowerError.includes("password")) {
            fieldName = "password";
          } else if (lowerError.includes("code") || lowerError.includes("verification")) {
            fieldName = "code";
          }
          
          if (fieldName) {
            fieldErrors[fieldName] = fieldErrors[fieldName] || [];
            fieldErrors[fieldName].push(errorItem);
          } else {
            fieldErrors["root"] = fieldErrors["root"] || [];
            fieldErrors["root"].push(errorItem);
          }
        }
      }
      
      return fieldErrors;
    }
    
    // Handle object format errors
    if (typeof validationError.errors === "object") {
      return validationError.errors as Record<string, string[]>;
    }
  }
  
  return {};
};

/**
 * Extract all validation error messages as a flat array
 */
export const extractAllErrorMessages = (error: unknown): string[] => {
  const validationErrors = extractValidationErrors(error);
  const messages: string[] = [];
  Object.values(validationErrors).forEach((fieldErrors) => {
    messages.push(...fieldErrors);
  });
  return messages.length > 0 ? messages : [extractErrorMessage(error)];
};

