import { useAuth } from "@/hooks/auth/useAuth";

/**
 * Hook to check authentication status and get user info
 * Useful for conditional rendering in components
 */
export const useAuthGuard = (requireVerification: boolean = false) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  return {
    isAuthenticated,
    user,
    isLoading,
    isVerified: user?.isEmailConfirmed ?? false,
    canAccess:
      isAuthenticated && (!requireVerification || user?.isEmailConfirmed),
  };
};
