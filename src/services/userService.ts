import { apiClient } from "../lib/api-client";
import type {
  User,
  UpdateUserProfileRequest,
  UpdateUserSkillsRequest,
  UpdateSocialLinksRequest,
  UpdateEducationsRequest,
  UpdateCertificatesRequest,
  UpdateUsernameRequest,
  UpdatePhoneNumberRequest,
  UpdateSummaryRequest,
  UpdateAvailabilityRequest,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  UsersListQueryParams,
  UsersListResponse,
  ConfirmEmailRequest,
} from "../types/user";

/**
 * User Service
 * Handles all user-related API endpoints
 */
export const userService = {
  /**
   * GET /api/Users/me
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    return apiClient.get<User>("/Users/me");
  },

  /**
   * PUT /api/Users/me
   * Update current user profile
   */
  updateProfile: async (data: UpdateUserProfileRequest): Promise<User> => {
    // Transform to match API format (PascalCase for FirstName/LastName)
    const requestData: {
      track?: string;
      FirstName?: string;
      LastName?: string;
    } = {};

    if (data.track) requestData.track = data.track;
    if (data.FirstName) requestData.FirstName = data.FirstName;
    if (data.LastName) requestData.LastName = data.LastName;
    // Fallback to camelCase if PascalCase not provided
    if (!requestData.FirstName && data.firstName)
      requestData.FirstName = data.firstName;
    if (!requestData.LastName && data.lastName)
      requestData.LastName = data.lastName;

    return apiClient.put<User>("/Users/me", requestData);
  },

  /**
   * GET /api/Users/{id}
   * Get user by id
   */
  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/api/Users/${id}`);
  },

  /**
   * GET /api/Users
   * List/search users with query params
   */
  getUsers: async (
    params?: UsersListQueryParams
  ): Promise<UsersListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.Name) {
      queryParams.append("Name", params.Name);
    }
    if (params?.Track) {
      queryParams.append("Track", params.Track);
    }
    if (params?.Skills && params.Skills.length > 0) {
      params.Skills.forEach((skill) => {
        queryParams.append("Skills", skill);
      });
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.pageSize) {
      queryParams.append("pageSize", params.pageSize.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/Users?${queryString}` : "/Users";

    return apiClient.get<UsersListResponse>(url);
  },

  uploadPhoto: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("photo", file);

    await apiClient.post("/Users/me/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deletePhoto: async (): Promise<void> => {
    await apiClient.delete("/Users/me/photo");
  },

  uploadBannerPhoto: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("BannerPhoto", file);

    await apiClient.post("/Users/me/banner-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteBannerPhoto: async (): Promise<void> => {
    await apiClient.delete("/Users/me/banner-photo");
  },

  updateSkills: async (data: UpdateUserSkillsRequest): Promise<void> => {
    await apiClient.post("/Users/me/skills", data);
  },

  updateSocialLinks: async (data: UpdateSocialLinksRequest): Promise<void> => {
    await apiClient.put("/Users/me/social-links", data);
  },

  updateEducation: async (data: UpdateEducationsRequest): Promise<void> => {
    await apiClient.put("/Users/me/education", data);
  },

  updateCertificates: async (
    data: UpdateCertificatesRequest
  ): Promise<void> => {
    await apiClient.put("/Users/me/certificates", data);
  },

  updateUsername: async (data: UpdateUsernameRequest): Promise<void> => {
    await apiClient.put("/Users/me/username", data);
  },

  updatePhoneNumber: async (data: UpdatePhoneNumberRequest): Promise<void> => {
    await apiClient.put("/Users/me/phone-number", data);
  },

  updateSummary: async (data: UpdateSummaryRequest): Promise<void> => {
    await apiClient.put("/Users/me/summary", data);
  },

  updateAvailability: async (
    data: UpdateAvailabilityRequest
  ): Promise<void> => {
    await apiClient.put("/Users/me/availability", data);
  },

  updateEmail: async (data: UpdateEmailRequest): Promise<void> => {
    await apiClient.put("/Users/me/email", data);
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    await apiClient.put("/Users/me/password", data);
  },

  searchByUsername: async (username: string): Promise<User> => {
    return apiClient.get<User>(`/Users/search/${username}`);
  },

  confirmEmail: async (data: ConfirmEmailRequest): Promise<void> => {
    const queryParams = new URLSearchParams({
      userId: data.userId,
      token: data.token,
    });
    await apiClient.post(`/Users/confirm-email?${queryParams.toString()}`);
  },
};
