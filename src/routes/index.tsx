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

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes (without layout) */}
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
      <Route
        path="/auth/verify-email"
        element={
          <AthLayout>
            <VerifyEmail />
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

      {/* Redirect old auth routes to new ones */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
};

export default MainRouter;
