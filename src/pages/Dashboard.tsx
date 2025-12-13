import React from "react";
import { useAuth } from "../hooks/auth/useAuth";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

/**
 * Dashboard page component for authenticated users
 * Features: User profile display, logout functionality, responsive design
 */
const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Please login to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your Freeqy account!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Status
                </label>
                <p className="text-gray-900">
                  {user?.isEmailConfirmed ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-red-600">✗ Not Verified</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
              <Button className="w-full" variant="outline">
                Change Password
              </Button>
              <Button className="w-full" variant="outline">
                Account Settings
              </Button>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Account Type
                </span>
                <span className="text-sm text-gray-900">Free</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Member Since
                </span>
                <span className="text-sm text-gray-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <Button className="w-full" variant="destructive" onClick={logout}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
