import { Navigate, Outlet } from "react-router";

import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  if (!user || (roles && !roles.includes(user.role))) return <Navigate to="/" replace />;
  return <Outlet />;
}