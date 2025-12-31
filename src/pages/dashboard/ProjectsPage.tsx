import React from "react";
import { Navigate } from "react-router-dom";
import { useMe } from "@/hooks/user/userHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTrackRequestsTable } from "@/components/dashboard/AdminTrackRequestsTable";

/**
 * Dashboard Projects page component for admin users
 * Features: Track requests management
 */
const ProjectsPage: React.FC = () => {
  const { data: user, isLoading } = useMe();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 p-8">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  // Redirect if not admin
  if (user?.role == "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">
            Manage track requests and projects
          </p>
        </div>

        <AdminTrackRequestsTable />
      </div>
    </div>
  );
};

export default ProjectsPage;

