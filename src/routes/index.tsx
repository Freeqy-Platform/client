import { Routes, Route } from "react-router-dom";
import Layout from "../components/navigation/Layout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import VerifyEmail from "../pages/auth/verify-email";
import AthLayout from "../components/auth/AthLayout";
import ProfilePage from "@/pages/ProfilePage";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
        {/* <Route path="/terms-of-service" element={<TermsOfService />} /> */}

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
        path="/auth/login"
        element={
          <AthLayout>
            <Login />
          </AthLayout>
        }
      />
      <Route
        path="/auth/register"
        element={
          <AthLayout>
            <Register />
          </AthLayout>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <AthLayout>
            <ForgotPassword />
          </AthLayout>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <AthLayout>
            <ResetPassword />
          </AthLayout>
        }
      />
      {/* Support new camelCase reset password link from emails */}
      <Route
        path="/resetPassword"
        element={
          <AthLayout>
            <ResetPassword />
          </AthLayout>
        }
      />
      <Route
        path="/emailConfirmation"
        element={
          <AthLayout>
            <VerifyEmail />
          </AthLayout>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
};

export default MainRouter;
