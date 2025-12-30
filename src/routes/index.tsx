import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/navigation/PublicLayout";
import AppLayout from "../components/navigation/AppLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Help from "../pages/Help";
import Dashboard from "../pages/dashboard/Dashboard";
import ProjectsPage from "../pages/dashboard/ProjectsPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import VerifyEmail from "../pages/auth/verify-email";
import ProfilePage from "@/pages/users/ProfilePage";
import SettingsPage from "@/pages/users/SettingsPage";
import { AuthLayout } from "@/components/auth/AuthLayout";

const MainRouter = () => {
  return (
    <Routes>
      {/* Public Pages - Use PublicLayout */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/help" element={<Help />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<ProjectsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/settings" element={<SettingsPage />} />
        {/* Messages, Projects, and Invitations routes will have MinimalFooter when added */}
        {/* <Route path="/messages" element={<Messages />} /> */}
        {/* <Route path="/projects" element={<Projects />} /> */}
        {/* <Route path="/projects/invitations" element={<Invitations />} /> */}
      </Route>

      <Route path="*" element={<PublicLayout />}>
        <Route index element={<NotFound />} />
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
