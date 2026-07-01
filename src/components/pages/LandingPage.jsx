import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

const HOW_IT_WORKS = [
  { step: "1", title: "Enter your details", body: "CET percentile, rank, category, seat type, and your preferred cities and branches." },
  { step: "2", title: "Pay ₹349", body: "One-time payment covers two full preference lists — not per-college, not per-download." },
  { step: "3", title: "Counsellor review", body: "A real counsellor checks and adjusts your list — colleges, order, everything — before it's finalized." },
  { step: "4", title: "Get your list", body: "Emailed to you as soon as it's approved. View and download it anytime from your dashboard." },
];

const FAQS = [
  {
    q: "Is my MHT-CET preference list just AI-generated?",
    a: "No. Your list is first generated from your percentile, rank, and preferences, but a real counsellor reviews and finalizes it — reordering colleges and correcting anything before you ever see it. You only receive the counsellor-approved version.",
  },
  {
    q: "How much does a MHT-CET preference list cost?",
    a: "₹349 for two personalized, counsellor-reviewed preference lists, covering CAP round admissions across Maharashtra engineering colleges.",
  },
  {
    q: "How is the MHT-CET preference list generated?",
    a: "You enter your CET percentile, rank, category, seat type, and preferred cities/branches. Our engine ranks colleges by historical cutoff data, then a counsellor reviews and adjusts the list before it's finalized.",
  },
  {
    q: "How long does counsellor review take?",
    a: "You'll receive an email as soon as your list is reviewed and approved, typically within a short turnaround so you have time before CAP round deadlines.",
  },
];

export default function LandingPage() {
  const { brand, C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    "MHT-CET College Preference List | Counsellor-Reviewed | MindzSpark",
    "Get a counsellor-reviewed MHT-CET college preference list built from your exact percentile and rank. Two personalized CAP round lists for ₹349."
  );

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <div style={s.hero} className="fade-in hero-section">
        <div style={{ display: "inline-block", background: C.primaryFaint, color: C.primary, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
          {brand.tagline || "MHT-CET Counselling Excellence"}
        </div>
        <h1 style={s.heroTitle} className="hero-title">
          MHT-CET College Preference List — Counsellor-Reviewed
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          Enter your MHT-CET percentile, rank, and preferences, and our counselling team will hand-review
          and finalize two personalized CAP round preference lists for you.
        </p>
        <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "14px 36px", fontSize: 15 }} className="btn-primary">
          Get My Preference List →
        </button>
        <p style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>
          ⚠ Keep your exact CET percentile and rank ready — your list is generated strictly from what you enter.
        </p>
      </div>

      <div style={s.priceCard} className="fade-in price-card">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>One-time payment</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: C.text, marginTop: 6 }}>₹349</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>for 2 personalized lists</div>
        </div>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {[
            "2 college preference lists, your choice of inputs",
            "Drag-and-drop reordering + add any college manually",
            "Reviewed and finalized by our counselling team",
            "Emailed to you the moment it's approved",
          ].map((f) => (
            <li key={f} style={{ display: "flex", gap: 10, fontSize: 13.5, color: C.text }}>
              <span style={{ color: C.emerald, fontWeight: 900 }}>✓</span>{f}
            </li>
          ))}
        </ul>
        <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, width: "100%", padding: "13px" }} className="btn-primary">
          Get Started
        </button>
      </div>

      <section style={{ maxWidth: 900, margin: "72px auto 0", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 36 }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="grid-4-col">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "72px auto 40px", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 28 }}>Frequently asked questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((f) => (
            <div key={f.q} style={s.card}>
              <div style={{ padding: "18px 22px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{f.q}</h3>
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
