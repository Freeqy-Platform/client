import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  authApi,
  extractErrorMessage,
  extractValidationErrors,
} from "../../lib/authApi";
import { QUERY_KEYS } from "../../types/api";

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store tokens and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_refresh_token", data.refreshToken);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        })
      );
      localStorage.setItem("auth_expires_in", data.expiresIn.toString());
      localStorage.setItem(
        "auth_refresh_token_expiry",
        data.refreshTokenExpiryDate
      );

      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      // Error handling is done in the form component via setFormErrors
      // Only show toast for non-validation errors
      const validationErrors = extractValidationErrors(error);
      if (Object.keys(validationErrors).length === 0) {
        const message = extractErrorMessage(error);
        toast.error(message);
      }
    },
  });
};

/**
 * Hook for register mutation
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email for verification."
      );
      navigate("/auth/verify-email");
    },
    onError: (error) => {
      // Error handling is done in the form component via setFormErrors
      // Only show toast for non-validation errors
      const validationErrors = extractValidationErrors(error);
      if (Object.keys(validationErrors).length === 0) {
        const message = extractErrorMessage(error);
        toast.error(message);
      }
    },
  });
};

/**
 * Hook for forgot password mutation
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for reset password mutation
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success(
        "Password reset successful! Please login with your new password."
      );
      navigate("/login");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for resend confirmation code mutation
 */
export const useResendConfirmationCode = () => {
  return useMutation({
    mutationFn: authApi.resendConfirmationCode,
    onSuccess: () => {
      toast.success("Confirmation code sent! Please check your email.");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for confirm email mutation
 */
export const useConfirmEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.confirmEmail,
    onSuccess: () => {
      toast.success("Email confirmed successfully!");
      navigate("/login");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for refresh token mutation
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // Update stored tokens and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_refresh_token", data.refreshToken);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        })
      );
      localStorage.setItem("auth_expires_in", data.expiresIn.toString());
      localStorage.setItem(
        "auth_refresh_token_expiry",
        data.refreshTokenExpiryDate
      );

      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    },
    onError: (error) => {
      // If refresh fails, clear auth data and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_expires_in");
      localStorage.removeItem("auth_refresh_token_expiry");
      queryClient.clear();
      const message = extractErrorMessage(error);
      toast.error(message || "Session expired. Please login again.");
    },
  });
};

/**
 * Hook for revoke refresh token mutation
 */
export const useRevokeRefreshToken = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.revokeRefreshToken,
    onSuccess: () => {
      // Clear stored auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_expires_in");
      localStorage.removeItem("auth_refresh_token_expiry");
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to revoke token");
    },
  });
};

/**
 * Hook for logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    // Clear stored data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expires_in");
    localStorage.removeItem("auth_refresh_token_expiry");

    // Clear query cache
    queryClient.clear();

    toast.success("Logged out successfully");
    navigate("/login");
  };
};
