import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../../services/userService";
import { QUERY_KEYS } from "../../types/api";
import { extractErrorMessage } from "../../lib/authApi";
import type {
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
  ConfirmEmailRequest,
} from "../../types/user";

/**
 * GET /api/Users/me
 * Get current user profile
 */
export const useMe = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.auth.user, "me"],
    queryFn: () => userService.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * PUT /api/Users/me
 * Update current user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) =>
      userService.updateProfile(data),
    onSuccess: (data) => {
      // Update query cache
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], data);
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update profile");
    },
  });
};

/**
 * GET /api/Users/{id}
 * Get user by id
 */
export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * GET /api/Users
 * List/search users with filters
 */
export const useUsersList = (filters?: UsersListQueryParams) => {
  return useQuery({
    queryKey: ["users", "list", filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * POST /api/Users/me/skills
 * Update user skills
 */
export const useUpdateSkills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSkillsRequest) =>
      userService.updateSkills(data),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Skills updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update skills");
    },
  });
};

/**
 * PUT /api/Users/me/social-links
 * Update social links
 */
export const useUpdateSocialLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSocialLinksRequest) =>
      userService.updateSocialLinks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Social links updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update social links");
    },
  });
};

/**
 * PUT /api/Users/me/education
 * Update educations
 */
export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEducationsRequest) =>
      userService.updateEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Education updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update education");
    },
  });
};

/**
 * PUT /api/Users/me/certificates
 * Update certificates
 */
export const useUpdateCertificates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCertificatesRequest) =>
      userService.updateCertificates(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Certificates updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update certificates");
    },
  });
};

/**
 * PUT /api/Users/me/username
 * Update username
 */
export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUsernameRequest) =>
      userService.updateUsername(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Username updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update username");
    },
  });
};

/**
 * PUT /api/Users/me/phone-number
 * Update phone number
 */
export const useUpdatePhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePhoneNumberRequest) =>
      userService.updatePhoneNumber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Phone number updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update phone number");
    },
  });
};

/**
 * PUT /api/Users/me/summary
 * Update summary
 */
export const useUpdateSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSummaryRequest) => userService.updateSummary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Summary updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update summary");
    },
  });
};

/**
 * PUT /api/Users/me/availability
 * Update availability
 */
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAvailabilityRequest) =>
      userService.updateAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Availability updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update availability");
    },
  });
};

/**
 * PUT /api/Users/me/email
 * Update email
 */
export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => userService.updateEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Email update request sent. Please check your email.");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update email");
    },
  });
};

/**
 * PUT /api/Users/me/password
 * Update password
 */
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordRequest) =>
      userService.updatePassword(data),
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update password");
    },
  });
};

/**
 * GET /api/Users/search/{username}
 * Search user by username
 */
export const useSearchByUsername = (username: string | undefined) => {
  return useQuery({
    queryKey: ["user", "search", username],
    queryFn: () => userService.searchByUsername(username!),
    enabled: !!username && username.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * POST /api/Users/confirm-email
 * Confirm email
 */
export const useConfirmEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmEmailRequest) => userService.confirmEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Email confirmed successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to confirm email");
    },
  });
};

// Photo hooks
/**
 * POST /api/Users/me/photo
 * Upload user photo
 */
export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadPhoto(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "photo"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Photo uploaded successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to upload photo");
    },
  });
};

/**
 * DELETE /api/Users/me/photo
 * Delete user photo
 */
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deletePhoto(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "photo"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Photo deleted successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to delete photo");
    },
  });
};
