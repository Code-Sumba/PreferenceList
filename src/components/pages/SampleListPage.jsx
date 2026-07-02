import { Link, useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { SAMPLE_ROWS } from "../../data/sampleCutoffs";

export default function SampleListPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    "MHT-CET Preference List Sample — What a Counsellor-Reviewed List Looks Like | MindzSpark",
    "See a real MHT-CET preference list sample built from published 2025 cutoff data — college, branch, and cutoff percentile, the same format every counsellor-reviewed list uses."
  );

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <div style={s.hero} className="fade-in hero-section">
        <h1 style={s.heroTitle} className="hero-title">
          MHT-CET Preference List — Sample
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          This is what a finished preference list looks like: college, branch, and the cutoff percentile it was ranked against. Built from real, published 2025 MHT-CET cutoff data — not a fabricated example.
        </p>
      </div>

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }} className="fade-in">
        <div style={{ ...s.card, overflow: "hidden" }}>
          <div style={{ display: "flex", background: C.surfaceHigh, padding: "10px 20px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span style={{ width: 28 }}>#</span>
            <span style={{ flex: 1 }}>College &amp; Branch</span>
            <span>Cutoff %ile</span>
          </div>
          {SAMPLE_ROWS.map((r) => (
            <div key={r.rank} style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderTop: `1px solid ${C.border}`, fontSize: 13 }}>
              <span style={{ width: 28, color: C.faint, fontWeight: 700 }}>{r.rank}</span>
              <span style={{ flex: 1, color: C.text, fontWeight: 600 }}>
                {r.college}
                <span style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 400 }}>{r.branch}</span>
              </span>
              <span style={{ color: C.emerald, fontWeight: 800 }}>{r.pct}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: C.faint, textAlign: "center", marginTop: 14 }}>
          Sample: 2025 GOPENS Computer Engineering cutoffs, Pune region. Your real list is personalized to your own percentile, category, seat type, and preferred cities/branches — not this fixed example.
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: "48px auto 0", padding: "0 24px" }} className="fade-in">
        <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 26px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 10, textAlign: "center" }}>How your real list is different from this sample</h2>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, maxWidth: 480, margin: "0 auto" }}>
            {[
              "Ranked against your own percentile, category, and seat type — not GOPENS Pune Computer Engineering.",
              "Includes your preferred cities and branches, spread across realistic reach/match/safe options.",
              "Reviewed and adjusted by a real counsellor before it's finalized — this sample is not counsellor-reviewed, it's an illustration.",
              "Delivered as two separate lists, one per CAP round.",
            ].map((f) => (
              <li key={f} style={{ display: "flex", gap: 10, fontSize: 13.5, color: C.text }}>
                <span style={{ color: C.primary, fontWeight: 900 }}>→</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ maxWidth: 480, margin: "40px auto 40px", padding: "0 24px", textAlign: "center" }} className="fade-in">
        <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "13px 32px", fontSize: 14.5 }} className="btn-primary">
          Get My Real List — ₹349
        </button>
        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 14 }}>
          <Link to="/how-it-works" style={{ color: C.primary, fontWeight: 700 }}>See how it's built →</Link>
        </p>
      </section>
    </PublicLayout>
  );
}
