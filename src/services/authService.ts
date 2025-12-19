import type {
  LoginResponse,
  RefreshTokenResponse,
  RefreshTokenRequest,
  User,
} from "../types/api";
import { authApi } from "../lib/authApi";

/**
 * Centralized Authentication Service
 * Handles all token management, storage, and refresh logic
 */
class AuthService {
  private refreshPromise: Promise<RefreshTokenResponse> | null = null;
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "auth_refresh_token";
  private readonly USER_KEY = "auth_user";
  private readonly EXPIRES_IN_KEY = "auth_expires_in";
  private readonly REFRESH_TOKEN_EXPIRY_KEY = "auth_refresh_token_expiry";

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  /**
   * Get token expiration timestamp
   */
  getTokenExpiry(): number | null {
    const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
    if (!expiresIn) return null;
    const expiresInSeconds = parseInt(expiresIn, 10);
    if (isNaN(expiresInSeconds)) return null;

    // Calculate expiry timestamp (current time + expiresIn seconds)
    // We need to track when the token was issued to calculate expiry
    // For now, we'll use a conservative approach: assume token expires in expiresIn seconds
    // In a real app, you'd store the issued timestamp
    const issuedAt = localStorage.getItem("auth_token_issued_at");
    if (issuedAt) {
      return parseInt(issuedAt, 10) + expiresInSeconds * 1000;
    }
    return null;
  }

  /**
   * Check if access token is expired or will expire soon (within 5 minutes)
   */
  isTokenExpiredOrExpiringSoon(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;

    // Consider token expired if it expires within 5 minutes
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return expiry <= fiveMinutesFromNow;
  }

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    const expiryStr = localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;

    try {
      const expiry = new Date(expiryStr).getTime();
      return expiry <= Date.now();
    } catch {
      return true;
    }
  }

  /**
   * Store authentication data
   */
  setAuthData(
    user: User,
    token: string,
    refreshToken: string,
    expiresIn: number,
    refreshTokenExpiryDate?: string
  ): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.EXPIRES_IN_KEY, expiresIn.toString());
    localStorage.setItem("auth_token_issued_at", Date.now().toString());

    if (refreshTokenExpiryDate) {
      localStorage.setItem(this.REFRESH_TOKEN_EXPIRY_KEY, refreshTokenExpiryDate);
    }
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRY_KEY);
    localStorage.removeItem("auth_token_issued_at");
  }

  /**
   * Update tokens after refresh
   */
  updateTokens(response: RefreshTokenResponse): void {
    const user: User = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
    };

    this.setAuthData(
      user,
      response.token,
      response.refreshToken,
      response.expiresIn,
      response.refreshTokenExpiryDate
    );
  }

  /**
   * Refresh access token
   * Uses a promise queue to prevent multiple simultaneous refresh requests
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    // If a refresh is already in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!token || !refreshToken) {
      throw new Error("No tokens available for refresh");
    }

    if (this.isRefreshTokenExpired()) {
      this.clearAuthData();
      throw new Error("Refresh token expired");
    }

    // Create refresh promise
    this.refreshPromise = authApi
      .refreshToken({
        token,
        refreshToken,
      })
      .then((response) => {
        this.updateTokens(response);
        return response;
      })
      .finally(() => {
        // Clear the promise so future refreshes can proceed
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!token || !refreshToken) return false;

    // If refresh token is expired, user is not authenticated
    if (this.isRefreshTokenExpired()) {
      return false;
    }

    // If access token is expired but refresh token is valid, we can still refresh
    // So consider authenticated if refresh token is valid
    return true;
  }

  /**
   * Get expires in value (in seconds)
   */
  getExpiresIn(): number {
    const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
    if (!expiresIn) return 0;
    return parseInt(expiresIn, 10) || 0;
  }

  /**
   * Get refresh token expiry date
   */
  getRefreshTokenExpiryDate(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);
  }

  /**
   * Update user data without changing tokens
   */
  updateUser(user: User): void {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    const expiresIn = this.getExpiresIn();
    const refreshTokenExpiryDate = this.getRefreshTokenExpiryDate();

    if (token && refreshToken) {
      this.setAuthData(
        user,
        token,
        refreshToken,
        expiresIn,
        refreshTokenExpiryDate || undefined
      );
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

