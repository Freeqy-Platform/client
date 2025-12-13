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

// API Configuration
const API_BASE_URL = env.API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;

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
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getStoredToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    // Note: Token refresh is handled in AuthContext
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const { response } = error;

        // Don't show toast for 401 errors - handled by AuthContext
        if (response?.status === 401) {
          // Token refresh will be handled by AuthContext interceptor
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
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  // Public methods for token management
  public setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  public clearToken(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expires_in");
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
