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

    // FastAPI's own request validation (422) returns `detail` as an array
    // of {type, loc, msg, input} objects instead of a string — every call
    // site does `toast.error(e.response?.data?.detail || "...")`, and
    // react-hot-toast crashes (React error #31) trying to render that
    // array as a child. Flatten it into a string here, once, so every
    // existing call site keeps working unchanged.
    const detail = err.response?.data?.detail;
    if (Array.isArray(detail)) {
      err.response.data.detail = detail
        .map((d) => {
          const field = Array.isArray(d?.loc) ? d.loc[d.loc.length - 1] : null;
          return field ? `${field}: ${d.msg}` : d.msg;
        })
        .join("; ");
    }

    return Promise.reject(err);
  }
);

export default api;
