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
    expiresIn: number
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
  const queryClient = useQueryClient();
  const refreshTokenMutation = useRefreshToken();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY_KEYS.auth.user,
    queryFn: () => Promise.resolve(getStoredUser()),
    enabled: !!token,
    staleTime: Infinity,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedRefreshToken = getStoredRefreshToken();
    // const storedUser = getStoredUser();

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

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

          const storedRefreshToken = getStoredRefreshToken();
          if (storedRefreshToken) {
            try {
              const response = await refreshTokenMutation.mutateAsync({
                refreshToken: storedRefreshToken,
              });

              // Update tokens
              setToken(response.token);
              setRefreshToken(response.refreshToken);
              localStorage.setItem("auth_token", response.token);
              localStorage.setItem("auth_refresh_token", response.refreshToken);
              localStorage.setItem(
                "auth_expires_in",
                response.expiresIn.toString()
              );

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
  }, [refreshTokenMutation]);

  // Login function
  const login = useCallback(
    (
      user: User,
      token: string,
      refreshTokenValue: string,
      expiresIn: number
    ) => {
      setToken(token);
      setRefreshToken(refreshTokenValue);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_refresh_token", refreshTokenValue);
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_expires_in", expiresIn.toString());

      // Update query cache
      queryClient.setQueryData(QUERY_KEYS.auth.user, user);
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expires_in");

    queryClient.clear();
  }, [queryClient]);

  const value: AuthContextType = {
    user: user || null,
    token,
    refreshToken,
    isAuthenticated: !!(token && user),
    isLoading: isLoadingUser,
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
