import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { student } = useAuth();
  if (!student) return <Navigate to="/apply" replace />;
  return children;
}
