import { useAuthContext } from "../contexts/AuthContext";

// Thin re-export so components can `import { useAuth } from "../hooks/useAuth"`
// matching the naming convention the internal tool's frontend/src/hooks/useAuth.js uses.
export function useAuth() {
  return useAuthContext();
}
