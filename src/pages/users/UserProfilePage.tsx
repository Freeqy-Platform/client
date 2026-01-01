import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useUser } from "../../hooks/user/userHooks";
import { ReadOnlyProfilePhoto } from "../../components/profile/readonly/ReadOnlyProfilePhoto";
import { ReadOnlyBannerPhoto } from "../../components/profile/readonly/ReadOnlyBannerPhoto";
import { ReadOnlyProfileHeader } from "../../components/profile/readonly/ReadOnlyProfileHeader";
import { ReadOnlyAboutSection } from "../../components/profile/readonly/ReadOnlyAboutSection";
import { ReadOnlySkillsSection } from "../../components/profile/readonly/ReadOnlySkillsSection";
import { ReadOnlyEducationSection } from "../../components/profile/readonly/ReadOnlyEducationSection";
import { ReadOnlyCertificatesSection } from "../../components/profile/readonly/ReadOnlyCertificatesSection";
import { ReadOnlySocialLinksSection } from "../../components/profile/readonly/ReadOnlySocialLinksSection";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useUser(id);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30">
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
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-md">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              Failed to load user profile. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30">
      {/* Banner Photo Section */}
      <div className="w-full bg-muted/30 pb-4">
        <div className="w-full">
          <ReadOnlyBannerPhoto user={user} />
        </div>
        <div className="relative -mt-16 pb-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReadOnlyProfilePhoto user={user} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ReadOnlyProfileHeader user={user} />
        <ReadOnlyAboutSection user={user} />
        <ReadOnlySkillsSection user={user} />
        <ReadOnlyEducationSection user={user} />
        <ReadOnlyCertificatesSection user={user} />
        <ReadOnlySocialLinksSection user={user} />
      </div>
    </div>
  );
};

export default UserProfilePage;

