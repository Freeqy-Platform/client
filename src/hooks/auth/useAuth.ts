import { useAuthContext } from "../../contexts/AuthContext";
import {
  useLogin,
  useRegister,
  useForgotPassword,
  useResetPassword,
  useResendConfirmationCode,
  useConfirmEmail,
  useLogout,
} from "./useAuthMutations";
import type { LoginRequest } from "../../types/api";

/**
 * Main auth hook that combines AuthContext and mutation hooks
 * Provides a unified interface for authentication operations
 */
export const useAuth = () => {
  const authContext = useAuthContext();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const resendConfirmationMutation = useResendConfirmationCode();
  const confirmEmailMutation = useConfirmEmail();
  const logoutFn = useLogout();

  // Wrapper for login that updates context
  const login = (
    data: LoginRequest,
    options?: { onError?: (error: unknown) => void }
  ) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        // Update context with user and tokens
        authContext.login(
          {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
          },
          response.token,
          response.refreshToken,
          response.expiresIn
        );
      },
      onError: options?.onError,
    });
  };

  return {
    // State from context
    user: authContext.user,
    token: authContext.token,
    isAuthenticated: authContext.isAuthenticated,
    isLoading: authContext.isLoading,

    // Actions
    login,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    resendConfirmationCode: resendConfirmationMutation.mutate,
    confirmEmail: confirmEmailMutation.mutate,
    logout: logoutFn,

    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isResendConfirmationLoading: resendConfirmationMutation.isPending,
    isConfirmEmailLoading: confirmEmailMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    resendConfirmationError: resendConfirmationMutation.error,
    confirmEmailError: confirmEmailMutation.error,
  };
};
