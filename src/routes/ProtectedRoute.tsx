import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 * Features: Authentication check, email verification requirement, redirect handling
 *
 * @param children - The component to render if user is authenticated
 * @param requireVerification - Whether to require email verification (default: false)
 * @param redirectTo - Custom redirect path (default: "/login")
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireVerification = false,
  redirectTo = "/auth/login",
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect to email verification if verification is required but user is not verified
  if (requireVerification && user && !user.isEmailConfirmed) {
    return <Navigate to="/auth/verify-email" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

/**
 * Higher-order component version of ProtectedRoute for easier usage
 *
 * @param Component - The component to protect
 * @param requireVerification - Whether to require email verification
 * @param redirectTo - Custom redirect path
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requireVerification: boolean = false,
  redirectTo: string = "/login"
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute
        requireVerification={requireVerification}
        redirectTo={redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

/**
 * Hook to check authentication status and get user info
 * Useful for conditional rendering in components
 */
export const useAuthGuard = (requireVerification: boolean = false) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  return {
    isAuthenticated,
    user,
    isLoading,
    isVerified: user?.isEmailConfirmed ?? false,
    canAccess: isAuthenticated && (!requireVerification || user?.isEmailConfirmed),
  };
};

export default ProtectedRoute;
