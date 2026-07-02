import { useBrand } from "../../contexts/BrandContext";
import { NavBar, WhatsAppFloat } from "../ui";

export function PublicLayout({ children, navLinks = [] }) {
  const { s, brand } = useBrand();
  return (
    <div style={s.page}>
      <NavBar links={navLinks} />
      <main style={s.main} className="app-main">{children}</main>
      <footer style={{ textAlign: "center", padding: "24px", color: "#9ca3af", fontSize: 12 }}>
        {brand.footer_text || `© ${new Date().getFullYear()} ${brand.name}`}
      </footer>
      <WhatsAppFloat />
    </div>
  );
}
