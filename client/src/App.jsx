import { createBrowserRouter } from "react-router";

import Home from "./pages/Home";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SupervisorOnboarding from "./pages/auth/SupervisorOnboarding";

export const interhubApp = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
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
]);
