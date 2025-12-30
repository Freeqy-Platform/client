import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  authApi,
  extractErrorMessage,
  extractValidationErrors,
} from "../../lib/authApi";
import { QUERY_KEYS } from "../../types/api";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Store tokens first using authService
      const basicUser = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };
      authService.setAuthData(
        basicUser,
        data.token,
        data.refreshToken,
        data.expiresIn,
        data.refreshTokenExpiryDate
      );

      // Fetch full user profile from /me endpoint
      try {
        const fullUser = await userService.getMe();

        // Update auth data with full user profile
        authService.updateUser(fullUser);

        // Update query cache with full user data
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: fullUser.id,
          firstName: fullUser.firstName,
          lastName: fullUser.lastName,
          email: fullUser.email,
        });
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], fullUser);

        toast.success("Login successful!");
        navigate("/dashboard");
      } catch (error) {
        // If /me fails, still proceed with basic user data
        console.error("Failed to fetch user profile:", error);
        queryClient.setQueryData(QUERY_KEYS.auth.user, basicUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], basicUser);
        toast.success("Login successful!");
        navigate("/dashboard");
      }
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
      navigate("/emailConfirmation");
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
 * Note: This is mainly used by the authService internally.
 * The interceptor handles automatic token refresh.
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // Update stored tokens and user data using authService
      authService.updateTokens(data);

      // Update query cache
      const user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };
      queryClient.setQueryData(QUERY_KEYS.auth.user, user);
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
    },
    onError: (error) => {
      // If refresh fails, clear auth data
      authService.clearAuthData();
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
      // Clear stored auth data using authService
      authService.clearAuthData();
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
    // Clear stored data using authService
    authService.clearAuthData();

    // Clear query cache
    queryClient.clear();

    toast.success("Logged out successfully");
    navigate("/login");
  };
};
