import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type EmailVerificationFormData,
  type AuthResponse,
} from "../lib/validation";
import { env } from "../lib/env";
// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Custom hook for authentication
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Invalid stored data, clear it
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Generic API request function
  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${env.API_BASE_URL}${endpoint}`;
    const token = authState.token;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  };

  // Login function
  const login = useCallback(
    async (credentials: LoginFormData): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });

        if (response.success && response.data?.user && response.data?.token) {
          const { user, token } = response.data;

          // Store in localStorage
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_user", JSON.stringify(user));

          // Update state
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });

          toast.success("Login successful!");
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        toast.error(errorMessage);
        throw error;
      }
    },
    [authState.token]
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterFormData): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await apiRequest<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify(userData),
        });

        if (response.success) {
          toast.success(
            "Registration successful! Please check your email to verify your account."
          );
        } else {
          throw new Error(response.message || "Registration failed");
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  // Forgot password function
  const forgotPassword = useCallback(
    async (emailData: ForgotPasswordFormData): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await apiRequest<AuthResponse>(
          "/auth/request-reset-password",
          {
            method: "POST",
            body: JSON.stringify(emailData),
          }
        );

        if (response.success) {
          toast.success("Password reset email sent! Please check your inbox.");
        } else {
          throw new Error(response.message || "Failed to send reset email");
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send reset email";
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  // Reset password function
  const resetPassword = useCallback(
    async (passwordData: ResetPasswordFormData): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await apiRequest<AuthResponse>(
          "/auth/reset-password",
          {
            method: "POST",
            body: JSON.stringify(passwordData),
          }
        );

        if (response.success) {
          toast.success(
            "Password reset successful! You can now log in with your new password."
          );
        } else {
          throw new Error(response.message || "Password reset failed");
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Password reset failed";
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  // Verify email function
  const verifyEmail = useCallback(
    async (tokenData: EmailVerificationFormData): Promise<void> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await apiRequest<AuthResponse>("/auth/verify-email", {
          method: "POST",
          body: JSON.stringify(tokenData),
        });

        if (response.success) {
          toast.success("Email verified successfully!");

          // Update user verification status if logged in
          if (authState.user) {
            const updatedUser = { ...authState.user, isVerified: true };
            localStorage.setItem("auth_user", JSON.stringify(updatedUser));
            setAuthState((prev) => ({
              ...prev,
              user: updatedUser,
            }));
          }
        } else {
          throw new Error(response.message || "Email verification failed");
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        const errorMessage =
          error instanceof Error ? error.message : "Email verification failed";
        toast.error(errorMessage);
        throw error;
      }
    },
    [authState.user]
  );

  // Logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    // Reset state
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });

    toast.success("Logged out successfully!");
  }, []);

  return {
    // State
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,

    // Actions
    login,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    logout,
  };
};
