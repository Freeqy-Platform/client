import { Routes, Route } from "react-router-dom";
import Layout from "../components/navigation/Layout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import VerifyEmail from "../pages/auth/verify-email";
import ProfilePage from "@/pages/ProfilePage";
import { AuthLayout } from "@/components/auth/AuthLayout";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/login"
        element={
          <AuthLayout variant="login">
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout variant="register">
            <Register />
          </AuthLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout variant="forgot">
            <ForgotPassword />
          </AuthLayout>
        }
      />
      <Route
        path="/resetPassword"
        element={
          <AuthLayout variant="reset">
            <ResetPassword />
          </AuthLayout>
        }
      />
      <Route
        path="/emailConfirmation"
        element={
          <AuthLayout variant="verify">
            <VerifyEmail />
          </AuthLayout>
        }
      />
    </Routes>
  );
};

export default MainRouter;
