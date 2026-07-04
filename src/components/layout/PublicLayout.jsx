import { Link } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { NavBar, WhatsAppFloat } from "../ui";
import { ExitIntentPopup } from "../ui/ExitIntentPopup";

const FOOTER_LINKS = [
  { to: "/cap-round-2026", label: "CAP Round 2026 Live Updates" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/sample-list", label: "Sample List" },
  { to: "/option-form-order-guide", label: "Option Form Order Guide" },
  { to: "/about", label: "About" },
];

export function PublicLayout({ children, navLinks = [] }) {
  const { s, brand, C } = useBrand();
  return (
    <div style={s.page}>
      <NavBar links={navLinks} />
      <main style={s.main} className="app-main">{children}</main>
      <footer style={{ textAlign: "center", padding: "24px", color: C.faint, fontSize: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 20px", marginBottom: 12 }}>
          {FOOTER_LINKS.map((l) => (
            <Link key={l.to} to={l.to} style={{ color: C.muted, fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
        {brand.footer_text || `© ${new Date().getFullYear()} ${brand.name}`}
      </footer>
      <WhatsAppFloat />
      <ExitIntentPopup />
    </div>
  );
}
