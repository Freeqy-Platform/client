import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useMe } from "../../hooks/user/userHooks";
import { TrackRequestForm } from "../../components/profile/TrackRequestForm";
import { TrackRequestsSection } from "../../components/profile/TrackRequestsSection";

const SettingsPage: React.FC = () => {
  const { data: user, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
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
              Failed to load settings. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your track requests and preferences
          </p>
        </div>

        <div className="space-y-6">
          <TrackRequestForm />
          <TrackRequestsSection />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

