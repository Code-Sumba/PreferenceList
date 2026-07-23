// Adapted from frontend/src/utils/theme.js (copied, not imported — this is
// a fully independent app). Extended with landing/pricing tokens the
// internal tool never needed, and made brand-aware: getTheme(brand) lets
// PublicLayout/AppLayout swap primary/secondary colors + logo + tagline at
// runtime for white-labeled partner subdomains, falling back to the same
// MindzSpark defaults as the internal tool when no brand is resolved.

export const DEFAULT_BRAND = {
  name: "MindzSpark",
  logo_url: "/logo.png",
  primary_color: "#2563eb",
  secondary_color: "#1d4ed8",
  tagline: "MHT-CET Counselling Excellence",
  footer_text: "MindzSpark · MHT-CET Counselling",
};

export function getTheme(brand) {
  const primary = brand?.primary_color || DEFAULT_BRAND.primary_color;
  const secondary = brand?.secondary_color || DEFAULT_BRAND.secondary_color;

  const C = {
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceHigh: "#f1f5f9",
    border: "#e2e8f0",
    input: "#ffffff",

    primary,
    primaryMid: secondary,
    primaryLight: "#3b82f6",
    primaryFaint: "#eff6ff",

    text: "#111827",
    muted: "#6b7280",
    // Was #9ca3af (~2.5:1 on white/surfaceHigh — fails WCAG AA). Muted
    // itself is already near the lightest gray that clears 4.5:1 on both
    // backgrounds this app uses, so there's no lighter tone left for
    // "faint" to occupy — this is intentionally close to muted rather
    // than lighter.
    faint: "#646d78",

    emerald: "#16a34a",
    amber: "#d97706",
    red: "#dc2626",
  };

  const s = {
    page: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" },
    nav: { borderBottom: `1px solid ${C.border}`, background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 20 },
    navInner: { maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
    main: { maxWidth: 1200, margin: "0 auto", padding: "36px 24px" },

    card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    cardHdr: { padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff" },
    cardBody: { padding: 24 },

    input: { width: "100%", background: "#ffffff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, fontFamily: "'Inter', sans-serif", outline: "none" },
    label: { display: "block", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },

    btnPrimary: { background: primary, color: "#fff", fontWeight: 600, border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, cursor: "pointer" },
    btnGhost: { background: "transparent", color: C.text, fontWeight: 600, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 24px", fontSize: 14, cursor: "pointer" },
    btnDanger: { background: "#fef2f2", color: C.red, fontWeight: 600, border: "1px solid #fecaca", borderRadius: 8, padding: "11px 24px", fontSize: 14, cursor: "pointer" },

    badge: { borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 },

    // landing/pricing-specific tokens the internal tool never needed
    hero: { textAlign: "center", padding: "80px 24px 60px", maxWidth: 780, margin: "0 auto" },
    heroTitle: { fontSize: 40, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16, color: C.text },
    heroSubtitle: { fontSize: 17, color: C.muted, lineHeight: 1.6, marginBottom: 32 },
    priceCard: { background: C.surface, border: `2px solid ${primary}`, borderRadius: 20, padding: 32, maxWidth: 380, margin: "0 auto", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
  };

  return { brand: brand || DEFAULT_BRAND, C, s };
}

export const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f8fafc; }
  input::placeholder { color: #9ca3af; }
  input:focus, select:focus, textarea:focus { outline: 2px solid #2563eb !important; outline-offset: 0; }
  select { appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px !important; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.3s ease; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); transition: all .15s; }
  .btn-ghost:hover  { border-color: #2563eb80 !important; }
  .hover-card:hover { border-color: #2563eb40 !important; background: #f8fafc !important; }

  /* ── Mobile responsiveness ──────────────────────────────────────────────
     Everything else in this app is inline-styled (React style prop), which
     can't express @media queries — these utility classes are applied
     alongside inline styles specifically where a fixed multi-column grid or
     wide flex row would otherwise overflow/squash on a phone screen. */
  @media (max-width: 640px) {
    .app-main { padding: 20px 14px !important; }
    .nav-inner { padding: 10px 14px !important; }
    .nav-links { gap: 6px !important; }
    .nav-links button, .nav-links a { padding: 6px 10px !important; font-size: 12px !important; }

    .grid-2-col { grid-template-columns: 1fr !important; }
    .grid-4-col { grid-template-columns: 1fr 1fr !important; gap: 20px 14px !important; }

    /* Step indicator: hide per-step text labels (they force horizontal
       overflow past ~4 steps) and shrink the circles into a compact dot
       row; the current step's full name is shown as its own line instead. */
    .step-current-label { display: block !important; }
    .step-bar .step-label { display: none !important; }
    .step-circle { width: 22px !important; height: 22px !important; font-size: 10px !important; }
    .step-connector { margin: 0 3px !important; min-width: 4px !important; }

    .header-row { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
    .header-row-actions { display: flex !important; gap: 8px !important; }
    .header-row-actions button { flex: 1 !important; }

    .hero-section { padding: 40px 16px 32px !important; }
    .hero-title { font-size: 26px !important; }
    .hero-subtitle { font-size: 14px !important; }
    .price-card { padding: 22px !important; max-width: 100% !important; }

    .admin-tabs { overflow-x: auto !important; -webkit-overflow-scrolling: touch; flex-wrap: nowrap !important; }
    .admin-tabs button { white-space: nowrap !important; }

    /* College row: the desktop layout is an 8-column grid (handle, sr_no,
       name+branch, city, bucket, margin, percentile, delete). On mobile it
       switches to flex-wrap: the name+branch block takes its own full-width
       line, and the small stat chips + delete button wrap onto the line(s)
       below — much simpler than trying to keep everything on one grid row. */
    .college-row {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 6px 10px !important;
    }
    .college-srno { display: none !important; }
    .college-main {
      display: flex !important;
      flex-direction: column !important;
      gap: 2px !important;
      flex: 1 1 75% !important;
      order: 1;
    }
    .college-meta { order: 2; font-size: 11px !important; }
    .college-row > button:last-child, .college-row > span:last-child:empty { order: 3; margin-left: auto; }
  }
`;
