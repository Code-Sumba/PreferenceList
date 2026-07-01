import { useNavigate, useLocation } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { NavBar } from "../ui";
import { clearAdminKey } from "../../api";

const TABS = [
  { path: "/staff/admin/employees", label: "Staff" },
  { path: "/staff/admin/analytics", label: "Analytics" },
  { path: "/staff/admin/students", label: "Students" },
  { path: "/staff/brand-stats", label: "Brand Stats" },
];

export function AdminLayout({ children }) {
  const { s, C } = useBrand();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={s.page}>
      <NavBar links={[{ label: "Exit Admin", onClick: () => { clearAdminKey(); navigate("/staff/reviews"); } }]} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0" }} className="app-main">
        <div style={{ display: "flex", gap: 8, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }} className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              style={{
                background: "none", border: "none", padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                color: location.pathname === t.path ? C.primary : C.muted,
                borderBottom: location.pathname === t.path ? `2px solid ${C.primary}` : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <main style={{ ...s.main, paddingTop: 0 }} className="app-main">{children}</main>
    </div>
  );
}
