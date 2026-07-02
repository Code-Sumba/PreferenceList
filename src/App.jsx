import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import HowItWorksPage from "./components/pages/HowItWorksPage";
import SampleListPage from "./components/pages/SampleListPage";
import OptionFormOrderGuidePage from "./components/pages/OptionFormOrderGuidePage";
import AboutPage from "./components/pages/AboutPage";
import InfoFormPage from "./components/pages/InfoFormPage";
import PaymentPage from "./components/pages/PaymentPage";
import ToolPage from "./components/pages/ToolPage";
import StudentLoginPage from "./components/pages/StudentLoginPage";
import DashboardPage from "./components/pages/DashboardPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import StaffLoginPage from "./components/staff/StaffLoginPage";
import ReviewQueuePage from "./components/staff/ReviewQueuePage";
import ReviewDetailPage from "./components/staff/ReviewDetailPage";
import BrandStatsPage from "./components/staff/BrandStatsPage";
import AdminKeyGatePage from "./components/staff/AdminKeyGatePage";
import AdminEmployeesPage from "./components/staff/AdminEmployeesPage";
import AdminAnalyticsPage from "./components/staff/AdminAnalyticsPage";
import AdminStudentsPage from "./components/staff/AdminStudentsPage";
import AdminStudentDetailPage from "./components/staff/AdminStudentDetailPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { StaffProtectedRoute } from "./routes/StaffProtectedRoute";
import { AdminProtectedRoute } from "./routes/AdminProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
  );
}
