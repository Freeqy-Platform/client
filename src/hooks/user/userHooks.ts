import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../../services/userService";
import { QUERY_KEYS } from "../../types/api";
import { extractErrorMessage } from "../../lib/authApi";
import { authService } from "../../services/authService";
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
  ConfirmEmailRequest,
  ResendConfirmEmailRequest,
  UpdateTrackRequest,
  UpdateTrackWithConfirmRequest,
  CreateTrackRequestDto,
  ApproveTrackRequestDto,
  RejectTrackRequestDto,
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
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically update cache
      if (previousUser) {
        // Convert API string availability ("1", "2", "3") to status string for User type
        const availabilityString = newData.availability !== undefined && newData.availability !== null
          ? (newData.availability === "1" ? "Available" : newData.availability === "2" ? "Busy" : "DoNotDisturb")
          : previousUser.availability;
        
        const optimisticUser: User = {
          ...previousUser,
          firstName: newData.firstName,
          lastName: newData.lastName,
          phoneNumber: newData.phoneNumber || previousUser.phoneNumber,
          availability: availabilityString,
          track: newData.trackName || previousUser.track,
        };

        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: optimisticUser.id,
          firstName: optimisticUser.firstName,
          lastName: optimisticUser.lastName,
          email: optimisticUser.email,
        });
      }

      return { previousUser };
    },
    onSuccess: (data) => {
      // Get current user data to preserve email if not in response
      const currentUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);
      
      // Merge response with current user data to preserve all fields
      const updatedUser: User = {
        ...currentUser,
        ...data,
        // Ensure email is preserved if not in response
        email: data.email || currentUser?.email || "",
        // Map trackName to track (API might return trackName or track)
        track: (data as any).track || (data as any).trackName || currentUser?.track,
        // Preserve other fields that might not be in response
        phoneNumber: (data as any).phoneNumber || currentUser?.phoneNumber,
        availability: (data as any).availability || currentUser?.availability,
      };

      // Update authService user data to keep localStorage in sync
      authService.updateUser(updatedUser);

      // Update query cache with server response
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
      queryClient.setQueryData(QUERY_KEYS.auth.user, {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      
      toast.success("Profile updated successfully");
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: context.previousUser.id,
          firstName: context.previousUser.firstName,
          lastName: context.previousUser.lastName,
          email: context.previousUser.email,
        });
      }
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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically update social links
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          socialLinks: newData.socialLinks,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get latest from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Social links updated successfully");
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically update education
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          educations: newData.educations.map((edu) => ({
            id: edu.id || "",
            institution: edu.institutionName,
            degree: edu.degree || "",
            fieldOfStudy: edu.fieldOfStudy || undefined,
            startDate: edu.startDate || "",
            endDate: edu.endDate || undefined,
            isCurrent: !edu.endDate,
            description: edu.description || undefined,
          })),
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get latest from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Education updated successfully");
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically update certificates
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          certificates: newData.certificates.map((cert) => ({
            id: cert.id || "",
            name: cert.certificateName,
            issuingOrganization: cert.issuer || "",
            issueDate: cert.issueDate || "",
            expiryDate: cert.expirationDate || undefined,
            credentialId: cert.credentialId || undefined,
            credentialUrl: cert.credentialUrl || undefined,
          })),
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get latest from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Certificates updated successfully");
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically update username
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          userName: newData.NewUsername,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get latest from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Username updated successfully");
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically update summary
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          summary: newData.summary,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get latest from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Summary updated successfully");
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
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

/**
 * POST /api/Users/resend-confirm-email
 * Resend confirmation email
 */
export const useResendConfirmEmail = () => {
  return useMutation({
    mutationFn: (data: ResendConfirmEmailRequest) =>
      userService.resendConfirmEmail(data),
    onSuccess: () => {
      toast.success("Confirmation email sent. Please check your inbox.");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to resend confirmation email");
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
    onMutate: async (file) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Create preview URL for optimistic update
      const previewUrl = URL.createObjectURL(file);
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          photoUrl: previewUrl,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser, previewUrl };
    },
    onSuccess: async () => {
      // Refetch user data to get the new photo URL from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Photo uploaded successfully");
    },
    onError: (error, _file, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
      // Clean up preview URL
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }
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
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically remove photo
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          photoUrl: null,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get updated state from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Photo deleted successfully");
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to delete photo");
    },
  });
};

/**
 * POST /api/Users/me/banner-photo
 * Upload banner photo
 */
export const useUploadBannerPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadBannerPhoto(file),
    onMutate: async (file) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Create preview URL for optimistic update
      const previewUrl = URL.createObjectURL(file);
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          bannerPhotoUrl: previewUrl,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser, previewUrl };
    },
    onSuccess: async () => {
      // Refetch user data to get the new banner photo URL from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Banner photo uploaded successfully");
    },
    onError: (error, _file, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
      // Clean up preview URL
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to upload banner photo");
    },
  });
};

/**
 * DELETE /api/Users/me/banner-photo
 * Delete banner photo
 */
export const useDeleteBannerPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteBannerPhoto(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });

      const previousUser = queryClient.getQueryData<User>([
        QUERY_KEYS.auth.user,
        "me",
      ]);

      // Optimistically remove banner photo
      if (previousUser) {
        const optimisticUser: User = {
          ...previousUser,
          bannerPhotoUrl: null,
        };
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], optimisticUser);
      }

      return { previousUser };
    },
    onSuccess: async () => {
      // Refetch user data to get updated state from server
      const updatedUser = await queryClient.fetchQuery<User>({
        queryKey: [QUERY_KEYS.auth.user, "me"],
        queryFn: () => userService.getMe(),
      });
      
      if (updatedUser) {
        authService.updateUser(updatedUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], updatedUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      }
      
      toast.success("Banner photo deleted successfully");
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          [QUERY_KEYS.auth.user, "me"],
          context.previousUser
        );
      }
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to delete banner photo");
    },
  });
};

// Track hooks
/**
 * GET /api/Users/tracks
 * Get all available tracks
 */
export const useTracks = () => {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: () => userService.getTracks(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * PUT /api/Users/me/track
 * Update user's track
 */
export const useUpdateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTrackRequest) => userService.updateTrack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      toast.success("Track updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update track");
    },
  });
};

/**
 * PUT /api/Users/me/track/smart
 * Smart update with auto-create option
 */
export const useUpdateTrackSmart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTrackWithConfirmRequest) =>
      userService.updateTrackSmart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.auth.user, "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tracks"],
      });
      toast.success("Track updated successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to update track");
    },
  });
};

// Track Request hooks (User)
/**
 * GET /api/Users/me/track-requests/stats
 * Get track request stats
 */
export const useTrackRequestStats = () => {
  return useQuery({
    queryKey: ["track-requests", "stats"],
    queryFn: () => userService.getTrackRequestStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * GET /api/Users/me/track-requests
 * Get user's track requests
 */
export const useMyTrackRequests = () => {
  return useQuery({
    queryKey: ["track-requests", "me"],
    queryFn: () => userService.getMyTrackRequests(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * POST /api/Users/track-requests
 * Create track request
 */
export const useCreateTrackRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrackRequestDto) =>
      userService.createTrackRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-requests", "me"],
      });
      queryClient.invalidateQueries({
        queryKey: ["track-requests", "stats"],
      });
      toast.success("Track request submitted successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      // Handle 429 error specifically
      if (message?.includes("DailyLimitExceeded") || message?.includes("429")) {
        toast.error(
          "You can only submit one track request per day. Please try again tomorrow."
        );
      } else {
        toast.error(message || "Failed to submit track request");
      }
    },
  });
};

// Track Request hooks (Admin)
/**
 * GET /api/Users/track-requests
 * Get all track requests (admin only)
 */
export const useAllTrackRequests = () => {
  return useQuery({
    queryKey: ["track-requests", "all"],
    queryFn: () => userService.getAllTrackRequests(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * POST /api/Users/track-requests/approve
 * Approve track request (admin only)
 */
export const useApproveTrackRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApproveTrackRequestDto) =>
      userService.approveTrackRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-requests", "all"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tracks"],
      });
      toast.success("Track request approved successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to approve track request");
    },
  });
};

/**
 * POST /api/Users/track-requests/reject
 * Reject track request (admin only)
 */
export const useRejectTrackRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectTrackRequestDto) =>
      userService.rejectTrackRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["track-requests", "all"],
      });
      toast.success("Track request rejected successfully");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message || "Failed to reject track request");
    },
  });
};
