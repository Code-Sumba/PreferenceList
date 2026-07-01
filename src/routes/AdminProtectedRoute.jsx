import { Navigate } from "react-router-dom";
import { getAdminKey } from "../api";

// Gated by presence of a stored admin key, not a JWT/login — matches the
// existing internal tool's admin model (shared secret, no per-user admin
// account concept in this system). AdminKeyGatePage prompts for and
// verifies the key before it's stored.
export function AdminProtectedRoute({ children }) {
  if (!getAdminKey()) return <Navigate to="/staff/admin/login" replace />;
  return children;
}
