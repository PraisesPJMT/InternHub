import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const AuthProtection = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.authStore);

  console.log("Is Auth: ", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export const StudentProtection = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.authStore);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== "student") {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthProtection>{children}</AuthProtection>;
};

export const SupervisorProtection = ({ children }) => {
  const { user } = useSelector((state) => state.authStore);

  if (user?.role !== "supervisor") {
    return <Navigate to="/" replace />;
  }

  return <AuthProtection>{children}</AuthProtection>;
};

export const AdmimProtection = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.authStore);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== "supervisor") {
    return <Navigate to="/" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthProtection>{children}</AuthProtection>;
};
