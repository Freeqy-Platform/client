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
  ResendConfirmEmailRequest,
  Track,
  TrackRequest,
  TrackRequestStats,
  UpdateTrackRequest,
  UpdateTrackWithConfirmRequest,
  CreateTrackRequestDto,
  ApproveTrackRequestDto,
  RejectTrackRequestDto,
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

  /**
   * POST /api/Users/resend-confirm-email
   * Resend confirmation email
   */
  resendConfirmEmail: async (data: ResendConfirmEmailRequest): Promise<void> => {
    await apiClient.post("/Users/resend-confirm-email", data);
  },

  // Track Management
  /**
   * PUT /api/Users/me/track
   * Update user's track
   */
  updateTrack: async (data: UpdateTrackRequest): Promise<void> => {
    await apiClient.put("/Users/me/track", data);
  },

  /**
   * GET /api/Users/tracks
   * Get all available tracks
   */
  getTracks: async (): Promise<Track[]> => {
    return apiClient.get<Track[]>("/Users/tracks");
  },

  /**
   * PUT /api/Users/me/track/smart
   * Smart update with auto-create option
   */
  updateTrackSmart: async (
    data: UpdateTrackWithConfirmRequest
  ): Promise<void> => {
    await apiClient.put("/Users/me/track/smart", data);
  },

  // Track Requests (User)
  /**
   * POST /api/Users/track-requests
   * Create a new track request
   */
  createTrackRequest: async (
    data: CreateTrackRequestDto
  ): Promise<TrackRequest> => {
    return apiClient.post<TrackRequest>("/Users/track-requests", data);
  },

  /**
   * GET /api/Users/me/track-requests/stats
   * Get track request stats for current user
   */
  getTrackRequestStats: async (): Promise<TrackRequestStats> => {
    return apiClient.get<TrackRequestStats>("/Users/me/track-requests/stats");
  },

  /**
   * GET /api/Users/me/track-requests
   * Get all track requests submitted by current user
   */
  getMyTrackRequests: async (): Promise<TrackRequest[]> => {
    const response = await apiClient.get<
      TrackRequest[] | { data?: TrackRequest[] }
    >("/Users/me/track-requests");
    // Handle case where API might return wrapped response
    if (Array.isArray(response)) {
      return response;
    }
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }
    return [];
  },

  // Track Requests (Admin)
  /**
   * GET /api/Users/track-requests
   * Get all track requests (admin only)
   */
  getAllTrackRequests: async (): Promise<TrackRequest[]> => {
    const response = await apiClient.get<
      TrackRequest[] | { data?: TrackRequest[] }
    >("/Users/track-requests");
    // Handle case where API might return wrapped response
    if (Array.isArray(response)) {
      return response;
    }
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }
    return [];
  },

  /**
   * POST /api/Users/track-requests/approve
   * Approve a track request (admin only)
   */
  approveTrackRequest: async (data: ApproveTrackRequestDto): Promise<void> => {
    await apiClient.post("/Users/track-requests/approve", data);
  },

  /**
   * POST /api/Users/track-requests/reject
   * Reject a track request (admin only)
   */
  rejectTrackRequest: async (data: RejectTrackRequestDto): Promise<void> => {
    await apiClient.post("/Users/track-requests/reject", data);
  },
};
