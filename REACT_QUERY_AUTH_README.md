# React Query Authentication System

This document describes the complete React Query authentication system implemented for the Freeqy frontend application.

## 🚀 Features

- **React Query Integration**: Complete state management and caching with TanStack Query
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Authentication Flow**: Complete user authentication lifecycle
- **Error Handling**: Global error handling with toast notifications
- **Protected Routes**: Route protection based on authentication status
- **Form Validation**: Zod-based form validation with react-hook-form
- **Responsive Design**: Mobile-first responsive UI components
- **Development Tools**: React Query DevTools integration

## 📁 File Structure

```
src/
├── types/
│   └── api.ts                    # TypeScript interfaces and types
├── lib/
│   ├── api-client.ts             # Axios-based API client with interceptors
│   ├── query-client.ts           # React Query configuration
│   └── env.ts                    # Environment configuration
├── hooks/
│   └── auth/
│       └── useAuth.ts            # Authentication hook with React Query
├── components/
│   └── auth/
│       ├── LoginForm.tsx         # Login form component
│       ├── RegisterForm.tsx      # Registration form component
│       ├── ForgotPasswordForm.tsx # Forgot password form
│       ├── ResetPasswordForm.tsx # Reset password form
│       ├── EmailVerificationForm.tsx # Email verification form
│       └── ProtectedRoute.tsx    # Protected route wrapper
├── pages/
│   ├── auth/
│   │   ├── login.tsx             # Login page
│   │   ├── Register.tsx          # Registration page
│   │   ├── forgot-password.tsx   # Forgot password page
│   │   ├── reset-password.tsx    # Reset password page
│   │   └── verify-email.tsx      # Email verification page
│   └── Dashboard.tsx             # Protected dashboard page
├── App.tsx                       # Main app with React Query provider
└── routes/
    └── index.tsx                 # Route configuration with protected routes
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the client root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Freeqy
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEVTOOLS=true
```

### React Query Configuration

The React Query client is configured with:

- **Stale Time**: 5 minutes for queries
- **Cache Time**: 10 minutes for queries
- **Retry Logic**: Smart retry with exponential backoff
- **Error Handling**: Automatic error handling and user feedback

## 🔐 Authentication Flow

### 1. User Registration

```typescript
const { register, isRegisterLoading } = useAuth();
await register({
  email: "user@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
});
```

### 2. Email Verification

After registration, users receive an email with a verification code.

### 3. Login

```typescript
const { login, isLoginLoading } = useAuth();
await login({
  email: "user@example.com",
  password: "password123",
});
```

### 4. Password Reset

```typescript
// Forgot password
const { forgotPassword } = useAuth();
await forgotPassword({ email: "user@example.com" });

// Reset password (with token from email)
const { resetPassword } = useAuth();
await resetPassword({
  token: "reset-token",
  id: "user-id",
  newPassword: "newpassword123",
});
```

## 🛡️ Protected Routes

Use the `ProtectedRoute` component to protect routes:

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 🔄 State Management

### Authentication State

The `useAuth` hook provides:

- **User Information**: Current user data
- **Authentication Status**: `isAuthenticated` boolean
- **Loading States**: Individual loading states for each action
- **Error States**: Error information for each action

### Caching Strategy

- **User Data**: Cached indefinitely until logout
- **Authentication State**: Persisted in localStorage
- **Token Management**: Automatic token attachment to requests
- **Cache Invalidation**: Automatic cache clearing on logout

## 🎨 UI Components

### Form Components

All authentication forms include:

- **Validation**: Zod schema validation
- **Error Display**: Real-time error feedback
- **Loading States**: Button loading indicators
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Toast Notifications

Global toast notifications for:

- Success messages
- Error messages
- Loading states
- User feedback

## 🔧 API Integration

### Backend Endpoints

The system integrates with these .NET backend endpoints:

1. **POST** `/api/v1/auth/register` - User registration
2. **POST** `/api/v1/auth/login` - User login
3. **POST** `/api/v1/auth/forgot-password` - Forgot password
4. **POST** `/api/v1/auth/reset-password` - Reset password
5. **POST** `/api/v1/auth/resend-confirmation-code` - Resend verification
6. **POST** `/api/v1/auth/confirm-email` - Confirm email

### Request/Response Handling

- **Automatic Token Attachment**: JWT tokens automatically added to requests
- **Error Interception**: Global error handling with user-friendly messages
- **Response Transformation**: Consistent response format handling

## 🚀 Usage Examples

### Basic Authentication Check

```typescript
import { useAuth } from "../hooks/auth/useAuth";

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Form Integration

```typescript
import { useAuth } from "../hooks/auth/useAuth";

const LoginForm = () => {
  const { login, isLoginLoading } = useAuth();

  const handleSubmit = (data) => {
    login(data); // React Query handles the rest
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoginLoading}>
        {isLoginLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

## 🔍 Development Tools

### React Query DevTools

The development environment includes React Query DevTools for:

- Query inspection
- Cache visualization
- Performance monitoring
- Debugging queries and mutations

### TypeScript Support

Full TypeScript support with:

- Strict type checking
- IntelliSense support
- Compile-time error detection
- Interface definitions for all API responses

## 🧪 Testing Considerations

### Mocking React Query

For testing, you can mock React Query:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
```

### Testing Hooks

Test the `useAuth` hook with:

- Mock API responses
- Authentication state changes
- Error scenarios
- Loading states

## 📱 Responsive Design

All components are built with mobile-first responsive design:

- **Mobile**: Optimized for touch interactions
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured desktop experience

## 🔒 Security Features

- **JWT Token Management**: Secure token storage and handling
- **Automatic Logout**: Session expiration handling
- **CSRF Protection**: Request validation
- **Input Validation**: Client-side and server-side validation
- **Secure Headers**: Proper HTTP headers for security

## 🚀 Performance Optimizations

- **Query Caching**: Intelligent caching strategy
- **Background Refetching**: Automatic data updates
- **Optimistic Updates**: Immediate UI feedback
- **Bundle Splitting**: Code splitting for better performance
- **Lazy Loading**: Route-based code splitting

This authentication system provides a complete, production-ready solution for user authentication in React applications with React Query integration.
