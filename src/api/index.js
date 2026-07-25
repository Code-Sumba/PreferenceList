import api from "./client";
import { getUtmParams } from "../utils/utm";

// baseURL on the shared axios instance is "/" (not "/api") because this
// app talks to several distinct prefixes (/api/client/*, /api/auth/*,
// /engine/*, /api/colleges/*) — every call below spells out its full path.

// ── Public brand resolution (no auth) ───────────────────────────────────────
export const getBrandTheme = (host, ref = "") => {
  const p = new URLSearchParams();
  if (host) p.set("host", host);
  if (ref) p.set("ref", ref);
  return api.get(`/api/client/public/brand?${p}`).then((r) => r.data.brand);
};

// ── Student self-serve auth (auto-active, no admin approval gate) ──────────
export const sendOtp = (email, ref = "") =>
  api.post("/api/client/auth/send-otp", { email, ref, ...getUtmParams() }).then((r) => r.data);

export const verifyOtp = (email, otp) =>
  api.post("/api/client/auth/verify-otp", { email, otp }).then((r) => r.data);

// ── Credits + gated generation ──────────────────────────────────────────────
export const getCredits = () => api.get("/api/client/credits").then((r) => r.data);

export const generatePreferences = (payload) =>
  api.post("/api/client/generate-preferences", payload).then((r) => r.data);

// ── Payments (Razorpay) ─────────────────────────────────────────────────────
export const createOrder = () =>
  api.post("/api/client/payments/create-order").then((r) => r.data);

export const verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) =>
  api
    .post("/api/client/payments/verify", { razorpay_order_id, razorpay_payment_id, razorpay_signature })
    .then((r) => r.data);

export const getMyPayments = () => api.get("/api/client/payments/history").then((r) => r.data);

// ── Review submission + student access ──────────────────────────────────────
export const submitReview = (formData, orderedList) =>
  api.post("/api/client/reviews/submit", { form_data: formData, ordered_list: orderedList }).then((r) => r.data);

export const getMyReviews = () => api.get("/api/client/my-reviews").then((r) => r.data);

export const getMyReviewDetail = (id) => api.get(`/api/client/my-reviews/${id}`).then((r) => r.data);

export const reorderMyReview = (id, orderedList) =>
  api.put(`/api/client/my-reviews/${id}/reorder`, { ordered_list: orderedList }).then((r) => r.data);

export const myReviewPdfUrl = (id) => `/api/client/my-reviews/${id}/pdf`;
export const myReviewExcelUrl = (id) => `/api/client/my-reviews/${id}/excel`;

export const downloadMyReviewFile = async (id, kind, filename) => {
  const url = kind === "excel" ? myReviewExcelUrl(id) : myReviewPdfUrl(id);
  const res = await api.get(url, { responseType: "blob" });
  const blobUrl = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename || (kind === "excel" ? "preference_list.xlsx" : "preference_list.pdf");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
};

// ── College lookups (free, used by AddCollegePanel and the engine form) ────
export const getEngineOptions = () => api.get("/engine/options").then((r) => r.data);

export const browseColleges = (q = "", limit = 20) =>
  api.get(`/api/colleges/browse?q=${encodeURIComponent(q)}&limit=${limit}`).then((r) => r.data);

export const getCollegeBranches = (code, year = 2025) =>
  api.get(`/api/colleges/${encodeURIComponent(code)}/branches?year=${year}`).then((r) => r.data);

// ── Staff: login reuses the EXISTING password-based employee login ─────────
export const staffLogin = (email, password) =>
  api.post("/api/auth/login", { email, password }).then((r) => r.data);

export const staffMe = () => api.get("/api/auth/me").then((r) => r.data);

// ── Staff: review queue / edit / approve ────────────────────────────────────
export const listReviews = (status = "pending_review") =>
  api.get(`/api/client/reviews?status=${status}`).then((r) => r.data);

export const getReview = (id) => api.get(`/api/client/reviews/${id}`).then((r) => r.data);

export const updateReviewStudentName = (id, studentName) =>
  api.put(`/api/client/reviews/${id}/student-name`, { student_name: studentName }).then((r) => r.data);

export const updateReviewList = (id, orderedList) =>
  api.put(`/api/client/reviews/${id}/list`, { ordered_list: orderedList }).then((r) => r.data);

export const approveReview = (id) => api.post(`/api/client/reviews/${id}/approve`).then((r) => r.data);

export const getBrandStats = () => api.get("/api/client/admin/brand-stats").then((r) => r.data);

// ── Admin: shared X-Admin-Key mechanism (same model as the internal tool's ──
// AdminPage — a shared secret, not a per-user login). Own storage key
// (mspub_admin_key), zero collision with the existing frontend's ms_admin_key.
const ADMIN_KEY_STORAGE = "mspub_admin_key";
export const getAdminKey = () => localStorage.getItem(ADMIN_KEY_STORAGE) || "";
export const setAdminKey = (key) => localStorage.setItem(ADMIN_KEY_STORAGE, key);
export const clearAdminKey = () => localStorage.removeItem(ADMIN_KEY_STORAGE);

const adminCfg = (extra = {}) => {
  const { headers: extraHeaders, ...rest } = extra;
  return { headers: { "X-Admin-Key": getAdminKey(), ...(extraHeaders || {}) }, ...rest };
};

export const adminCheckKey = (key) =>
  api.get("/api/client/admin/students", { headers: { "X-Admin-Key": key } }).then((r) => r.status === 200);

// Employee approval — status toggle reuses the EXISTING internal-tool
// endpoint directly (PATCH /admin/employees/{id}/status), same admin key.
export const adminListEmployeeCandidates = () =>
  api.get("/api/client/admin/employee-candidates", adminCfg()).then((r) => r.data);

export const adminSetEmployeeStatus = (id, status) =>
  api.patch(`/admin/employees/${id}/status`, { status }, adminCfg()).then((r) => r.data);

export const adminSetEmployeeRole = (id, role) =>
  api.post(`/api/client/admin/employees/${id}/set-role`, { role }, adminCfg()).then((r) => r.data);

export const adminSetEmployeePassword = (id, password) =>
  api.post(`/api/client/admin/employees/${id}/set-password`, { password }, adminCfg()).then((r) => r.data);

export const adminCreateStaff = (email, name, password) =>
  api.post("/api/client/admin/employees", { email, name, password }, adminCfg()).then((r) => r.data);

// Analytics
export const adminGetAnalytics = () => api.get("/api/client/admin/analytics", adminCfg()).then((r) => r.data);
export const adminGetBrandAnalytics = () => api.get("/api/client/admin/brand-analytics", adminCfg()).then((r) => r.data);

// Client student management
export const adminListStudents = (search = "") => {
  const p = new URLSearchParams();
  if (search) p.set("search", search);
  return api.get(`/api/client/admin/students?${p}`, adminCfg()).then((r) => r.data);
};
export const adminCreateStudent = (payload) =>
  api.post("/api/client/admin/students", payload, adminCfg()).then((r) => r.data);
export const adminGetStudentDetail = (email) =>
  api.get(`/api/client/admin/students/${encodeURIComponent(email)}`, adminCfg()).then((r) => r.data);
export const adminAdjustCredits = (email, delta, reason) =>
  api.post(`/api/client/admin/students/${encodeURIComponent(email)}/adjust-credits`, { delta, reason }, adminCfg()).then((r) => r.data);
