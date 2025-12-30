import ProtectedRoute from "./ProtectedRoute";

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
