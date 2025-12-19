import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/api";
import { QUERY_KEYS } from "../types/api";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    user: User,
    token: string,
    refreshToken: string,
    expiresIn: number,
    refreshTokenExpiryDate?: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Logout function
  const logout = useCallback(() => {
    authService.clearAuthData();
    queryClient.clear();
  }, [queryClient]);

  // Validate session on mount/reload using GET /Users/me
  // This will automatically use the refresh token if the access token is expired
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [QUERY_KEYS.auth.user, "me"],
    queryFn: async () => {
      // Check if we have tokens
      if (!authService.isAuthenticated()) {
        return null;
      }

      try {
        // Try to get user data
        // The apiClient interceptor will handle token refresh if needed
        const userData = await userService.getMe();

        // Update stored user data (preserve existing tokens)
        authService.updateUser(userData);

        return userData;
      } catch {
        // If we get a 401, try to refresh the token first
        // The interceptor should have handled this, but if it didn't,
        // we'll try one more time here
        const refreshToken = authService.getRefreshToken();
        if (refreshToken && !authService.isRefreshTokenExpired()) {
          try {
            await authService.refreshToken();
            // Retry getting user data
            const userData = await userService.getMe();
            authService.updateUser(userData);
            return userData;
          } catch {
            // Refresh failed, logout
            logout();
            return null;
          }
        } else {
          // No refresh token or expired, logout
          logout();
          return null;
        }
      }
    },
    enabled: authService.isAuthenticated() && !isInitialized,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    // Check if we have stored tokens
    const hasTokens = authService.isAuthenticated();

    if (hasTokens) {
      // Session validation will happen via useQuery above
      setIsInitialized(true);
    } else {
      // No tokens, mark as initialized
      setIsInitialized(true);
    }
  }, []);

  // Mark as initialized once user data is loaded or error occurs
  useEffect(() => {
    if (!isLoadingUser) {
      setIsInitialized(true);
    }
  }, [isLoadingUser]);

  // Sync user data with query cache
  useEffect(() => {
    if (user) {
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
    }
  }, [user, queryClient]);

  // Login function
  const login = useCallback(
    (
      user: User,
      token: string,
      refreshTokenValue: string,
      expiresIn: number,
      refreshTokenExpiryDate?: string
    ) => {
      authService.setAuthData(
        user,
        token,
        refreshTokenValue,
        expiresIn,
        refreshTokenExpiryDate
      );

      // Check if we already have full user data in cache (from /me call)
      const cachedFullUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      if (cachedFullUser) {
        // Use the full user data from cache
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: cachedFullUser.id,
          firstName: cachedFullUser.firstName,
          lastName: cachedFullUser.lastName,
          email: cachedFullUser.email,
        });
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], cachedFullUser);
      } else {
        // Fallback to basic user data if cache doesn't have full user yet
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
      }
    },
    [queryClient]
  );

  const token = authService.getToken();
  const refreshToken = authService.getRefreshToken();
  const isAuthenticated = !!(
    token &&
    refreshToken &&
    user &&
    !isLoadingUser &&
    isInitialized
  );

  const value: AuthContextType = {
    user: user || null,
    token,
    refreshToken,
    isAuthenticated,
    isLoading: isLoadingUser || !isInitialized,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
