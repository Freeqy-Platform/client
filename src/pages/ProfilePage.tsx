import React, { useState } from "react";
import { useMe } from "../hooks/user/userHooks";
import {
  useUpdateProfile,
  useUpdateSkills,
  useUpdateSocialLinks,
  useUpdateEducation,
  useUpdateCertificates,
  useUpdateSummary,
  useUploadPhoto,
  useDeletePhoto,
} from "../hooks/user/userHooks";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { ProfilePhoto } from "../components/profile/ProfilePhoto";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { AboutSection } from "../components/profile/sections/AboutSection";
import { SkillsSection } from "../components/profile/sections/SkillsSection";
import { EducationSection } from "../components/profile/sections/EducationSection";
import { CertificatesSection } from "../components/profile/sections/CertificatesSection";
import { SocialLinksSection } from "../components/profile/sections/SocialLinksSection";
import type {
  UpdateUserProfileRequest,
  UpdateUserSkillsRequest,
  UpdateSocialLinksRequest,
  UpdateEducationsRequest,
  UpdateCertificatesRequest,
  UpdateSummaryRequest,
} from "../types/user";

/**
 * LinkedIn/Facebook-style Profile Page with inline editing
 */
const ProfilePage: React.FC = () => {
  const { data: user, isLoading, error } = useMe();
  const updateProfile = useUpdateProfile();
  const updateSkills = useUpdateSkills();
  const updateSocialLinks = useUpdateSocialLinks();
  const updateEducation = useUpdateEducation();
  const updateCertificates = useUpdateCertificates();
  const updateSummary = useUpdateSummary();
  const uploadPhoto = useUploadPhoto();
  const deletePhoto = useDeletePhoto();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Photo handling
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      try {
        await uploadPhoto.mutateAsync(file);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deletePhoto.mutateAsync();
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  // Form handlers
  const handleProfileUpdate = async (data: UpdateUserProfileRequest) => {
    await updateProfile.mutateAsync(data);
  };

  const handleSummaryUpdate = async (data: UpdateSummaryRequest) => {
    await updateSummary.mutateAsync(data);
  };

  const handleSkillsUpdate = async (data: UpdateUserSkillsRequest) => {
    await updateSkills.mutateAsync(data);
  };

  const handleEducationUpdate = async (data: UpdateEducationsRequest) => {
    await updateEducation.mutateAsync(data);
  };

  const handleCertificatesUpdate = async (data: UpdateCertificatesRequest) => {
    await updateCertificates.mutateAsync(data);
  };

  const handleSocialLinksUpdate = async (data: UpdateSocialLinksRequest) => {
    await updateSocialLinks.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-48 w-full mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Failed to load profile. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Cover Photo Section */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--purple)] via-purple-600 to-purple-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6">
          <ProfilePhoto
            user={user}
            photoPreview={photoPreview}
            onPhotoUpload={handlePhotoUpload}
            onPhotoDelete={handleDeletePhoto}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ProfileHeader
          user={user}
          onUpdate={handleProfileUpdate}
          isUpdating={updateProfile.isPending}
        />

        <AboutSection
          user={user}
          onUpdate={handleSummaryUpdate}
          isUpdating={updateSummary.isPending}
        />

        <SkillsSection
          user={user}
          onUpdate={handleSkillsUpdate}
          isUpdating={updateSkills.isPending}
        />

        <EducationSection
          user={user}
          onUpdate={handleEducationUpdate}
          isUpdating={updateEducation.isPending}
        />

        <CertificatesSection
          user={user}
          onUpdate={handleCertificatesUpdate}
          isUpdating={updateCertificates.isPending}
        />

        <SocialLinksSection
          user={user}
          onUpdate={handleSocialLinksUpdate}
          isUpdating={updateSocialLinks.isPending}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
