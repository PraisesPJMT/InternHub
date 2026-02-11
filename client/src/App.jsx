import { createBrowserRouter } from "react-router";
import {
  AdmimProtection,
  StudentProtection,
  SupervisorProtection,
} from "./protect/Protect";

// Auth Pages
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SupervisorOnboarding from "./pages/auth/SupervisorOnboarding";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";

// Supervisor Pages
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

export const interhubApp = createBrowserRouter([
  // Auth Routes
  {
    path: "/signin",
    Component: Signin,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/auth/supervisor-onboarding",
    Component: SupervisorOnboarding,
  },

  // Student Dashboard Routes
  {
    path: "/",
    element: (
      <StudentProtection>
        <StudentDashboard />
      </StudentProtection>
    ),
  },

  // Supervisor Dashboard Routes
  {
    path: "/dashboard",
    element: (
      <SupervisorProtection>
        <SupervisorDashboard />
      </SupervisorProtection>
    ),
  },

  // Admin Dashboard Routes
  {
    path: "/admin",
    element: (
      <AdmimProtection>
        <AdminDashboard />
      </AdmimProtection>
    ),
  },
]);
