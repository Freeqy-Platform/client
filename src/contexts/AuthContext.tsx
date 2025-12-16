import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { User } from "../types/api";
import { QUERY_KEYS } from "../types/api";
import { useRefreshToken } from "../hooks/auth/useAuthMutations";
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

const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem("auth_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem("auth_refresh_token");
};

/**
 * AuthProvider component that manages authentication state
 * Provides user, token, and auth methods to children via context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getStoredRefreshToken()
  );
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const queryClient = useQueryClient();
  const refreshTokenMutation = useRefreshToken();

  // Logout function - defined early so it can be used in useQuery
  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expires_in");
    localStorage.removeItem("auth_refresh_token_expiry");

    queryClient.clear();
  }, [queryClient]);

  // Validate session on mount/reload using GET /Users/me
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: [QUERY_KEYS.auth.user, "me"],
    queryFn: async () => {
      // Only validate if we have a token
      if (!token) {
        return null;
      }
      try {
        const userData = await userService.getMe();
        // Update stored user data
        localStorage.setItem("auth_user", JSON.stringify(userData));
        return userData;
      } catch (error) {
        // If 401, session is invalid
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Clear auth data
          logout();
          return null;
        }
        throw error;
      }
    },
    enabled: !!token && isValidatingSession,
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Also sync with query cache
  useEffect(() => {
    if (user) {
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, queryClient]);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedRefreshToken = getStoredRefreshToken();

    if (storedToken) {
      setToken(storedToken);
      // Session validation will happen via useQuery above
    } else {
      // No token, skip validation
      setIsValidatingSession(false);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  // Mark validation as complete once user data is loaded or error occurs
  useEffect(() => {
    if (!isLoadingUser) {
      setIsValidatingSession(false);
    }
    // If we get a 401 error, session is invalid
    if (userError && axios.isAxiosError(userError) && userError.response?.status === 401) {
      logout();
      setIsValidatingSession(false);
    }
  }, [isLoadingUser, userError, logout]);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const currentToken = getStoredToken();
        if (currentToken && config.headers) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh on 401
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const storedToken = getStoredToken();
          const storedRefreshToken = getStoredRefreshToken();
          if (storedToken && storedRefreshToken) {
            try {
              const response = await refreshTokenMutation.mutateAsync({
                token: storedToken,
                refreshToken: storedRefreshToken,
              });

              // Update tokens and user data
              setToken(response.token);
              setRefreshToken(response.refreshToken);
              localStorage.setItem("auth_token", response.token);
              localStorage.setItem("auth_refresh_token", response.refreshToken);
              localStorage.setItem(
                "auth_expires_in",
                response.expiresIn.toString()
              );
              localStorage.setItem(
                "auth_refresh_token_expiry",
                response.refreshTokenExpiryDate
              );
              localStorage.setItem(
                "auth_user",
                JSON.stringify({
                  id: response.id,
                  firstName: response.firstName,
                  lastName: response.lastName,
                  email: response.email,
                })
              );

              // Update query cache
              queryClient.setQueryData(QUERY_KEYS.auth.user, {
                id: response.id,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
              });

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.token}`;
              }
              return axios(originalRequest);
            } catch (refreshError) {
              // Refresh failed, logout user
              logout();
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token, logout
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshTokenMutation, logout, queryClient]);

  // Login function
  const login = useCallback(
    (
      user: User,
      token: string,
      refreshTokenValue: string,
      expiresIn: number,
      refreshTokenExpiryDate?: string
    ) => {
      setToken(token);
      setRefreshToken(refreshTokenValue);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_refresh_token", refreshTokenValue);
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_expires_in", expiresIn.toString());
      if (refreshTokenExpiryDate) {
        localStorage.setItem(
          "auth_refresh_token_expiry",
          refreshTokenExpiryDate
        );
      }

      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      // Also update the me query for full user profile
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
    },
    [queryClient]
  );

  const value: AuthContextType = {
    user: user || null,
    token,
    refreshToken,
    isAuthenticated: !!(token && user && !isValidatingSession),
    isLoading: isLoadingUser || isValidatingSession,
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
