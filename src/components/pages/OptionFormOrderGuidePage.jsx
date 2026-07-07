import { Link, useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useJsonLd } from "../../hooks/useJsonLd";

const GUIDE_STEPS = [
  {
    step: "1",
    title: "List every college + branch combination you'd genuinely accept",
    body: "Don't stop at 5-10 \"safe-looking\" options. A short list risks going empty-handed in a round if your percentile lands between cutoffs. There's no penalty for listing more options — only for leaving realistic ones out.",
  },
  {
    step: "2",
    title: "Order strictly by true preference — never by \"safe chances first\"",
    body: "CAP allotment checks your list from the top down and gives you the highest option on your list that you're eligible for in that round. Moving a \"safer\" college above one you actually want first doesn't protect you — it can cost you the better seat you were eligible for all along. Order by what you actually want, top to bottom.",
  },
  {
    step: "3",
    title: "Spread across reach, match, and safe options",
    body: "Within your true preference order, make sure the list isn't only reach colleges (cutoffs above your percentile) or only safe ones. A realistic spread across all three bands, still ordered by genuine preference, is what actually protects you across CAP rounds.",
  },
  {
    step: "4",
    title: "Check this year's exact freeze/float/slide rules on the official CET Cell portal",
    body: "The rules for accepting, upgrading, or continuing your allotted seat across rounds can change year to year and are set by the CET Cell, not by any private counselling service. Always confirm the current CAP round's exact rules on the official portal before you act on a seat allotment.",
  },
  {
    step: "5",
    title: "Get a counsellor to review your order before you submit it",
    body: "A second, experienced set of eyes catches ordering mistakes, missed eligible colleges, and category/seat-type errors before you lock in your official CAP form — not after. This is the review MindzSpark's ₹349 preference list service provides.",
  },
];

export default function OptionFormOrderGuidePage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    "MHT-CET CAP Option Form Order Guide 2026 — Kis Order Mein Bhare | MindzSpark",
    "Confused about what order to fill your MHT-CET CAP option form in? Here's why order matters, the strategy behind it, and how to avoid losing a seat you were eligible for.",
    "/option-form-order-guide"
  );

  useJsonLd("howto-schema", {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Order Your MHT-CET CAP Option Form",
    description: "Step-by-step strategy for ordering your MHT-CET CAP option form so you don't lose a seat you were eligible for.",
    step: GUIDE_STEPS.map((s2) => ({
      "@type": "HowToStep",
      position: Number(s2.step),
      name: s2.title,
      text: s2.body,
    })),
  });

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <div style={s.hero} className="fade-in hero-section">
        <h1 style={s.heroTitle} className="hero-title">
          MHT-CET CAP Option Form: Kis Order Mein Bhare?
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          The order you fill your CAP option form in can decide which college you actually get — not just which ones you're eligible for. Here's the strategy, step by step.
        </p>
      </div>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 24px" }} className="fade-in">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {GUIDE_STEPS.map((item) => (
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
        <div style={{ background: C.primaryFaint, border: `1px solid ${C.primary}30`, borderRadius: 14, padding: "26px 28px", textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Don't guess your own order — get it reviewed</h2>
          <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 16 }}>
            For ₹349, MindzSpark generates a personalized CAP round list from your exact percentile, rank, and preferences, then a real counsellor reviews and corrects the order before you see it — approved within 6 hours.
          </p>
          <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "13px 32px", fontSize: 14.5 }} className="btn-primary">
            Get My Reviewed List — ₹349
          </button>
        </div>
      </section>

      <section style={{ maxWidth: 480, margin: "32px auto 40px", padding: "0 24px", textAlign: "center" }} className="fade-in">
        <p style={{ fontSize: 12.5, color: C.muted }}>
          <Link to="/sample-list" style={{ color: C.primary, fontWeight: 700, marginRight: 18 }}>See a sample list →</Link>
          <Link to="/how-it-works" style={{ color: C.primary, fontWeight: 700 }}>How review works →</Link>
        </p>
      </section>
    </PublicLayout>
  );
}
