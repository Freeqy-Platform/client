import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/user/userHooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard page component for admin users
 * Features: Admin sidebar navigation, admin management pages
 */
const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data: user, isLoading } = useMe();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 p-8">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Card className="max-w-md mx-2 sm:max-w-2xl sm:mx-auto w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
            <CardDescription className="text-lg">
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-lg">
              <Link to="/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem-4.5rem)] bg-muted/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, projects, blog, and website configuration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/dashboard/users">View Users</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Website Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>Website Configuration</CardTitle>
              <CardDescription>Configure site settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/dashboard/config">Configure</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Projects Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/dashboard/projects">Manage Projects</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Blog Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Blog</CardTitle>
              <CardDescription>Manage blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/dashboard/blog">Manage Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
