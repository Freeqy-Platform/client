# Freeqy Authentication System

A complete authentication system built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- ✅ **Login/Register Forms** with validation
- ✅ **Password Reset Flow** (forgot password + reset password)
- ✅ **Email Verification** system
- ✅ **Protected Routes** with authentication guards
- ✅ **Form Validation** using Zod and react-hook-form
- ✅ **Toast Notifications** using Sonner
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Modern UI** with shadcn/ui components
- ✅ **TypeScript** support with full type safety

## Project Structure

```
src/
├── components/
│   └── auth/
│       └── AuthCard.tsx          # Shared auth layout component
├── hooks/
│   └── useAuth.ts               # Authentication hook
├── lib/
│   └── validation.ts            # Zod validation schemas
├── pages/
│   └── auth/
│       ├── login.tsx            # Login page
│       ├── Register.tsx         # Registration page
│       ├── forgot-password.tsx  # Forgot password page
│       ├── reset-password.tsx   # Reset password page
│       └── verify-email.tsx     # Email verification page
├── routes/
│   ├── index.tsx                # Main router
│   └── ProtectedRoute.tsx       # Route protection component
└── main.tsx                     # App entry point with toast provider
```

## API Endpoints

The authentication system expects these API endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/request-reset-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/verify-email` - Verify email with token

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Usage

### 1. Basic Authentication

```tsx
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Protected Routes

```tsx
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### 3. Protected Route with Email Verification

```tsx
<ProtectedRoute requireVerification={true}>
  <VerifiedUserOnly />
</ProtectedRoute>
```

### 4. Using the withAuth HOC

```tsx
import { withAuth } from "./routes/ProtectedRoute";

const ProtectedComponent = withAuth(MyComponent, true); // requireVerification = true
```

### 5. Using the useAuthGuard Hook

```tsx
import { useAuthGuard } from "./routes/ProtectedRoute";

function ConditionalComponent() {
  const { canAccess, isAuthenticated, isVerified } = useAuthGuard(true);

  if (!canAccess) {
    return <div>Access denied</div>;
  }

  return <div>Protected content</div>;
}
```

## Form Validation

All forms use Zod schemas for validation:

```tsx
import { loginSchema, type LoginFormData } from "./lib/validation";

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

### Validation Rules

- **Email**: Required, must be valid email format
- **Password**: Minimum 8 characters, must contain uppercase, lowercase, and number
- **Name**: Minimum 2 characters, maximum 50 characters
- **Confirm Password**: Must match the password field

## Styling

The system uses custom CSS variables for consistent theming:

- Primary colors: `#1E293B` (dark slate)
- Background: `#F8FAFC` (light gray)
- Secondary: `#E2E8F0` (border gray)
- Success: `#10B981` (emerald)

Fonts: Inter (primary) and Poppins (headings)

## Toast Notifications

Toast notifications are automatically handled by the `useAuth` hook:

```tsx
// Success notifications
toast.success("Login successful!");

// Error notifications
toast.error("Invalid credentials");
```

## Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Customization

### Adding New Auth Pages

1. Create the page component in `src/pages/auth/`
2. Add the route to `src/routes/index.tsx`
3. Use the `AuthCard` component for consistent styling

### Custom Validation Rules

Modify the schemas in `src/lib/validation.ts`:

```tsx
const customSchema = z.object({
  field: z.string().min(1, "Custom error message"),
});
```

### Custom API Integration

Update the `useAuth` hook in `src/hooks/useAuth.ts` to match your API structure.

## Security Notes

- Passwords are validated on the frontend but should also be validated on the backend
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All API calls should use HTTPS in production
- Implement rate limiting on authentication endpoints
- Add CSRF protection for production use

## Browser Support

- Modern browsers with ES2020+ support
- React 18+
- TypeScript 5.0+

## License

MIT License - feel free to use in your projects!
