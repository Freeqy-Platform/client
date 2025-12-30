import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { extractErrorMessage, isValidationError } from "./authApi";
import { env } from "./env";
import { authService } from "../services/authService";

// API Configuration
const API_BASE_URL = env.API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add token and refresh proactively if needed
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Skip token refresh for auth endpoints
        const isAuthEndpoint = config.url?.includes("/Auth/");
        if (isAuthEndpoint) {
          return config;
        }

        // Proactively refresh token if it's expired or expiring soon
        // DISABLED: This was causing error toasts for users
        // The reactive refresh (on 401) in response interceptor is sufficient
        /*
        if (
          authService.isTokenExpiredOrExpiringSoon() &&
          !this.isRefreshing &&
          authService.getRefreshToken() &&
          !authService.isRefreshTokenExpired()
        ) {
          try {
            // This will use the promise queue in authService to prevent multiple refreshes
            await authService.refreshToken();
          } catch (error) {
            // Refresh failed, but don't block the request
            // The response interceptor will handle 401
            console.error("Proactive token refresh failed:", error);
          }
        }
        */

        const token = authService.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle 401 errors and refresh token
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Skip refresh for auth endpoints (login, register, etc.)
        const isAuthEndpoint = originalRequest?.url?.includes("/Auth/");
        if (isAuthEndpoint) {
          return this.handleError(error);
        }

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                const token = authService.getToken();
                if (token && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = authService.getRefreshToken();
          if (!refreshToken || authService.isRefreshTokenExpired()) {
            // No refresh token or expired, clear auth and reject
            authService.clearAuthData();
            this.processQueue(null, new Error("Refresh token expired"));
            return this.handleError(error);
          }

          try {
            const response = await authService.refreshToken();
            const token = response.token;

            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            // Process queued requests
            this.processQueue(token);

            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth and process queue
            authService.clearAuthData();
            this.processQueue(null, refreshError);
            return this.handleError(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        return this.handleError(error);
      }
    );
  }

  private processQueue(token: string | null, error?: Error) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private handleError(error: AxiosError) {
    const { response } = error;

    // Don't show toast for 401 errors - they're handled by refresh logic
    if (response?.status === 401) {
      return Promise.reject(error);
    }

    // Handle validation errors
    if (isValidationError(error)) {
      const validationError = error.response?.data;
      if (validationError?.errors) {
        // Show first validation error
        const firstErrorKey = Object.keys(validationError.errors)[0];
        const firstErrorMessages = validationError.errors[firstErrorKey];
        if (firstErrorMessages && firstErrorMessages.length > 0) {
          toast.error(firstErrorMessages[0]);
        } else {
          toast.error(validationError.title || "Validation error occurred");
        }
      }
      return Promise.reject(error);
    }

    // Handle server errors
    if (response?.status && response.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      // Extract and show error message
      const message = extractErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  }

  // HTTP Methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
