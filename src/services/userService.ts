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
    return apiClient.put<User>("/Users/me", data);
  },

  /**
   * GET /api/Users/{id}
   * Get user by id
   */
  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/Users/${id}`);
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
    } as any);
  },

  /**
   * DELETE /api/Users/me/photo
   * Delete user photo
   */
  deletePhoto: async (): Promise<void> => {
    await apiClient.delete("/Users/me/photo");
  },

  /**
   * POST /api/Users/me/skills
   * Update user skills
   */
  updateSkills: async (data: UpdateUserSkillsRequest): Promise<void> => {
    await apiClient.post("/Users/me/skills", data);
  },

  /**
   * PUT /api/Users/me/social-links
   * Update social links
   */
  updateSocialLinks: async (data: UpdateSocialLinksRequest): Promise<void> => {
    await apiClient.put("/Users/me/social-links", data);
  },

  /**
   * PUT /api/Users/me/education
   * Update educations
   */
  updateEducation: async (data: UpdateEducationsRequest): Promise<void> => {
    await apiClient.put("/Users/me/education", data);
  },

  /**
   * PUT /api/Users/me/certificates
   * Update certificates
   */
  updateCertificates: async (
    data: UpdateCertificatesRequest
  ): Promise<void> => {
    await apiClient.put("/Users/me/certificates", data);
  },

  /**
   * PUT /api/Users/me/username
   * Update username
   */
  updateUsername: async (data: UpdateUsernameRequest): Promise<void> => {
    await apiClient.put("/Users/me/username", data);
  },

  /**
   * PUT /api/Users/me/phone-number
   * Update phone number
   */
  updatePhoneNumber: async (data: UpdatePhoneNumberRequest): Promise<void> => {
    await apiClient.put("/Users/me/phone-number", data);
  },

  /**
   * PUT /api/Users/me/summary
   * Update summary
   */
  updateSummary: async (data: UpdateSummaryRequest): Promise<void> => {
    await apiClient.put("/Users/me/summary", data);
  },

  /**
   * PUT /api/Users/me/availability
   * Update availability
   */
  updateAvailability: async (
    data: UpdateAvailabilityRequest
  ): Promise<void> => {
    await apiClient.put("/Users/me/availability", data);
  },

  /**
   * PUT /api/Users/me/email
   * Update email
   */
  updateEmail: async (data: UpdateEmailRequest): Promise<void> => {
    await apiClient.put("/Users/me/email", data);
  },

  /**
   * PUT /api/Users/me/password
   * Update password
   */
  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    await apiClient.put("/Users/me/password", data);
  },

  /**
   * GET /api/Users/search/{username}
   * Search user by username
   */
  searchByUsername: async (username: string): Promise<User> => {
    return apiClient.get<User>(`/Users/search/${username}`);
  },

  /**
   * POST /api/Users/confirm-email
   * Confirm email via userId and token query params
   */
  confirmEmail: async (data: ConfirmEmailRequest): Promise<void> => {
    const queryParams = new URLSearchParams({
      userId: data.userId,
      token: data.token,
    });
    await apiClient.post(`/Users/confirm-email?${queryParams.toString()}`);
  },
};
