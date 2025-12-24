import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useUserContext } from "../Context/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: string;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.userDetails.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
