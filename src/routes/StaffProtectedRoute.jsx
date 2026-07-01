import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function StaffProtectedRoute({ children }) {
  const { student } = useAuth();
  if (!student || student.role !== "employee") return <Navigate to="/staff/login" replace />;
  return children;
}
