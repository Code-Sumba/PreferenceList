import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { StaffProtectedRoute } from "./routes/StaffProtectedRoute";
import { AdminProtectedRoute } from "./routes/AdminProtectedRoute";

// Everything except the landing page is lazy-loaded: most visitors only ever
// see "/", so the public marketing pages, the authed student flow, and the
// staff/admin panel shouldn't cost that visitor any bytes.
const CapRoundLiveUpdatesPage = lazy(() => import("./components/pages/CapRoundLiveUpdatesPage"));
const HowItWorksPage = lazy(() => import("./components/pages/HowItWorksPage"));
const SampleListPage = lazy(() => import("./components/pages/SampleListPage"));
const OptionFormOrderGuidePage = lazy(() => import("./components/pages/OptionFormOrderGuidePage"));
const AboutPage = lazy(() => import("./components/pages/AboutPage"));
const InfoFormPage = lazy(() => import("./components/pages/InfoFormPage"));
const PaymentPage = lazy(() => import("./components/pages/PaymentPage"));
const ToolPage = lazy(() => import("./components/pages/ToolPage"));
const StudentLoginPage = lazy(() => import("./components/pages/StudentLoginPage"));
const DashboardPage = lazy(() => import("./components/pages/DashboardPage"));
const NotFoundPage = lazy(() => import("./components/pages/NotFoundPage"));
const StaffLoginPage = lazy(() => import("./components/staff/StaffLoginPage"));
const ReviewQueuePage = lazy(() => import("./components/staff/ReviewQueuePage"));
const ReviewDetailPage = lazy(() => import("./components/staff/ReviewDetailPage"));
const BrandStatsPage = lazy(() => import("./components/staff/BrandStatsPage"));
const AdminKeyGatePage = lazy(() => import("./components/staff/AdminKeyGatePage"));
const AdminEmployeesPage = lazy(() => import("./components/staff/AdminEmployeesPage"));
const AdminAnalyticsPage = lazy(() => import("./components/staff/AdminAnalyticsPage"));
const AdminStudentsPage = lazy(() => import("./components/staff/AdminStudentsPage"));
const AdminStudentDetailPage = lazy(() => import("./components/staff/AdminStudentDetailPage"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cap-round-2026" element={<CapRoundLiveUpdatesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/sample-list" element={<SampleListPage />} />
        <Route path="/option-form-order-guide" element={<OptionFormOrderGuidePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/apply" element={<InfoFormPage />} />
        <Route path="/login" element={<StudentLoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/tool" element={<ProtectedRoute><ToolPage /></ProtectedRoute>} />

        <Route path="/staff/login" element={<StaffLoginPage />} />
        <Route path="/staff/reviews" element={<StaffProtectedRoute><ReviewQueuePage /></StaffProtectedRoute>} />
        <Route path="/staff/reviews/:id" element={<StaffProtectedRoute><ReviewDetailPage /></StaffProtectedRoute>} />
        <Route path="/staff/brand-stats" element={<StaffProtectedRoute><BrandStatsPage /></StaffProtectedRoute>} />

        <Route path="/staff/admin/login" element={<AdminKeyGatePage />} />
        <Route path="/staff/admin" element={<Navigate to="/staff/admin/employees" replace />} />
        <Route path="/staff/admin/employees" element={<AdminProtectedRoute><AdminEmployeesPage /></AdminProtectedRoute>} />
        <Route path="/staff/admin/analytics" element={<AdminProtectedRoute><AdminAnalyticsPage /></AdminProtectedRoute>} />
        <Route path="/staff/admin/students" element={<AdminProtectedRoute><AdminStudentsPage /></AdminProtectedRoute>} />
        <Route path="/staff/admin/students/:email" element={<AdminProtectedRoute><AdminStudentDetailPage /></AdminProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
