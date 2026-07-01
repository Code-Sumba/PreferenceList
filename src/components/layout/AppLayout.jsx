import { useLocation, useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { NavBar } from "../ui";

export function AppLayout({ children, creditsBalance, showCredits = true }) {
  const { s } = useBrand();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    ...(location.pathname !== "/dashboard" ? [{ label: "Dashboard", onClick: () => navigate("/dashboard") }] : []),
    ...(showCredits && creditsBalance !== null && creditsBalance !== undefined
      ? [{ label: `Credits: ${creditsBalance}`, onClick: () => {} }]
      : []),
    { label: "Log out", onClick: () => { logout(); navigate("/"); } },
  ];

  return (
    <div style={s.page}>
      <NavBar links={links} />
      <main style={s.main} className="app-main">{children}</main>
    </div>
  );
}
