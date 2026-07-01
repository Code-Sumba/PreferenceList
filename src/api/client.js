import axios from "axios";

// Own storage keys, namespaced away from the existing tool's ms_token/
// ms_student — zero collision if this app is ever run on the same domain/
// browser profile as frontend/.
export const TOKEN_KEY = "mspub_token";
export const STUDENT_KEY = "mspub_student";

const api = axios.create({ baseURL: "/" });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STUDENT_KEY);
      if (!window.location.pathname.startsWith("/staff")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
