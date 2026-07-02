import { Link, useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

const STEPS = [
  {
    step: "1",
    title: "Enter your percentile, rank, and preferences",
    body: "You give us your CET percentile, rank, category, seat type, and preferred cities and branches. That's the only input the list is built from — no guesswork, no generic advice.",
  },
  {
    step: "2",
    title: "Pay ₹349, one time",
    body: "One payment covers two full preference lists — enough for two separate CAP rounds. Not a subscription, not a per-college charge.",
  },
  {
    step: "3",
    title: "Our engine drafts a ranked list",
    body: "A ranking engine builds a draft list from historical MHT-CET cutoff data matched to your percentile, category, and preferences — this is the starting point, not the final product.",
  },
  {
    step: "4",
    title: "A real counsellor reviews it",
    body: "A human counsellor checks the draft — reordering colleges, correcting anything that looks off, and adjusting for things a pure percentile match can miss. You never see the unreviewed draft.",
  },
  {
    step: "5",
    title: "Get your approved list within 6 hours",
    body: "Once approved, you're notified by email and can view or download your list (PDF or Excel) from your dashboard. You can also drag-and-drop reorder it or add a college manually, then resubmit for a quick re-check.",
  },
];

export default function HowItWorksPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    "How the MHT-CET Preference List Is Made — Percentile to Counsellor-Approved List | MindzSpark",
    "See exactly how MindzSpark turns your MHT-CET percentile and rank into a counsellor-reviewed CAP preference list, step by step, in under 6 hours."
  );

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <div style={s.hero} className="fade-in hero-section">
        <h1 style={s.heroTitle} className="hero-title">
          Preference List Kaise Banti Hai: Percentile → Counsellor Review → 2 Round Lists
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          Every MHT-CET preference list we deliver goes through the same five steps — an engine draft, then a human counsellor review, before it ever reaches you.
        </p>
      </div>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 24px" }} className="fade-in">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {STEPS.map((item) => (
            <div key={item.step} style={s.card}>
              <div style={{ padding: "20px 24px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: "50%", background: C.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                  {item.step}
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>{item.title}</h2>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "16px auto 0", padding: "0 24px" }} className="fade-in">
        <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px", textAlign: "center" }}>
          <p style={{ fontSize: 13.5, color: C.text, marginBottom: 14 }}>
            Want to see what a finished list actually looks like before you pay?
          </p>
          <Link to="/sample-list" style={{ color: C.primary, fontWeight: 700, fontSize: 13.5, marginRight: 18 }}>View a sample list →</Link>
          <Link to="/option-form-order-guide" style={{ color: C.primary, fontWeight: 700, fontSize: 13.5 }}>Why order matters →</Link>
        </div>
      </section>

      <section style={{ maxWidth: 480, margin: "40px auto 40px", padding: "0 24px", textAlign: "center" }} className="fade-in">
        <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "13px 32px", fontSize: 14.5 }} className="btn-primary">
          Get My Preference List — ₹349
        </button>
      </section>
    </PublicLayout>
  );
}
