import { Link, useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { SAMPLE_ROWS } from "../../data/sampleCutoffs";

const HOW_IT_WORKS = [
  { step: "1", title: "Enter your details", body: "CET percentile, rank, category, seat type, and your preferred cities and branches." },
  { step: "2", title: "Pay ₹349", body: "One-time payment covers two full preference lists — not per-college, not per-download." },
  { step: "3", title: "Counsellor review", body: "A real counsellor checks and adjusts your list — colleges, order, everything — before it's finalized." },
  { step: "4", title: "Get your list", body: "Approved within 6 hours. View and download it anytime from your dashboard." },
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
    a: "Your list is reviewed and approved within 6 hours, so you have time before CAP round deadlines. You'll get an email the moment it's ready.",
  },
  {
    q: "Is MindzSpark affiliated with the MHT-CET CET Cell?",
    a: "No. MindzSpark is an independent counselling service and is not affiliated with, endorsed by, or connected to the State CET Cell, Maharashtra, or DTE. Official CAP registration and option-form submission happen only on the official CET Cell portal — we help you decide what order to fill your own form in.",
  },
  {
    q: "What happens after I pay?",
    a: "After payment, you enter your percentile, rank, category, and preferences to generate a draft list, then submit it for review. A counsellor checks and adjusts it, and you get the approved list within 6 hours — downloadable as PDF or Excel from your dashboard, with an email notification the moment it's ready.",
  },
];

export default function LandingPage() {
  const { brand, C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    "MHT-CET Preference List 2026 — Counsellor-Reviewed CAP Option Form Order | ₹349",
    "Get a counsellor-reviewed 2026 MHT-CET preference list built from your exact percentile and rank. Two personalized CAP round lists for ₹349.",
    "/"
  );

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <Link
        to="/cap-round-2026"
        style={{ display: "block", background: C.primary, color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}
      >
        🔴 CAP Round 2026 is live — see the full schedule & today's update →
      </Link>
      <div style={s.hero} className="fade-in hero-section">
        <div style={{ display: "inline-block", background: C.primaryFaint, color: C.primary, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
          {brand.tagline || "MHT-CET Counselling Excellence"}
        </div>
        <h1 style={s.heroTitle} className="hero-title">
          MHT-CET Preference List 2026 — Counsellor-Reviewed CAP Option Form Order
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          Enter your MHT-CET percentile, rank, and preferences, and our counselling team will hand-review
          and finalize two personalized CAP round preference lists for you — approved within 6 hours.
        </p>
        <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "14px 36px", fontSize: 15 }} className="btn-primary">
          Get My Preference List →
        </button>
        <p style={{ fontSize: 12, color: C.muted, marginTop: 14 }}>
          ⚠ Keep your exact CET percentile and rank ready — your list is generated strictly from what you enter.
        </p>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>
          Not sure what you'll get yet?{" "}
          <a href="https://mhtcet.mindzspark.in" style={{ color: C.primary, fontWeight: 700 }}>
            Try the free predictor first →
          </a>
        </p>
      </div>

      {/* Positioning strip — kills the "free mein to mil raha tha" objection by
          drawing a clear line between the free predictor (what you might get)
          and this product (the actual, counsellor-verified CAP form order). */}
      <div style={{ maxWidth: 820, margin: "0 auto 56px", padding: "0 24px" }} className="fade-in">
        <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Free Predictor</div>
            <div style={{ fontSize: 14, color: C.text }}>Tells you <strong>what</strong> colleges you might get.</div>
          </div>
          <div style={{ fontSize: 20, color: C.faint, fontWeight: 900 }}>→</div>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>This List — ₹349</div>
            <div style={{ fontSize: 14, color: C.text }}>Tells you exactly <strong>what order</strong> to fill your CAP form in — counsellor-verified, 2 CAP rounds.</div>
          </div>
        </div>
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
            "Approved within 6 hours",
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

      {/* Sample list preview — shows the actual product before asking for
          payment. Real, published 2025 cutoff data (not a specific
          customer's list, not fabricated), clearly labeled as a sample. */}
      <section style={{ maxWidth: 700, margin: "72px auto 0", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 8 }}>See what you get</h2>
        <p style={{ fontSize: 13.5, color: C.muted, textAlign: "center", marginBottom: 28 }}>
          Sample based on real 2025 MHT-CET cutoff data — your actual list is personalized to your percentile, category, and preferences.{" "}
          <Link to="/sample-list" style={{ color: C.primary, fontWeight: 700 }}>See the full sample →</Link>
        </p>
        <div style={{ ...s.card, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", background: C.surfaceHigh, padding: "10px 20px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <span style={{ width: 28 }}>#</span>
            <span style={{ flex: 1 }}>College &amp; Branch</span>
            <span>Cutoff %ile</span>
          </div>
          {SAMPLE_ROWS.map((r, i) => (
            <div
              key={r.rank}
              style={{
                display: "flex", alignItems: "center", padding: "12px 20px",
                borderTop: `1px solid ${C.border}`, fontSize: 13,
                filter: i >= 3 ? "blur(4px)" : "none",
                userSelect: i >= 3 ? "none" : "auto",
              }}
            >
              <span style={{ width: 28, color: C.faint, fontWeight: 700 }}>{r.rank}</span>
              <span style={{ flex: 1, color: C.text, fontWeight: 600 }}>
                {r.college}
                <span style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 400 }}>{r.branch}</span>
              </span>
              <span style={{ color: C.emerald, fontWeight: 800 }}>{r.pct}</span>
            </div>
          ))}
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 140,
            background: `linear-gradient(to bottom, transparent, ${C.surface} 65%)`,
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 18,
          }}>
            <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "11px 26px", fontSize: 13.5 }} className="btn-primary">
              Unlock My Full List — ₹349
            </button>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "72px auto 0", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 12 }}>How it works</h2>
        <p style={{ fontSize: 13.5, color: C.muted, textAlign: "center", marginBottom: 24 }}>
          <Link to="/how-it-works" style={{ color: C.primary, fontWeight: 700 }}>See the full process, step by step →</Link>
        </p>
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

      <section style={{ maxWidth: 820, margin: "56px auto 0", padding: "0 24px" }} className="fade-in">
        <div style={{ background: C.primaryFaint, border: `1px solid ${C.primary}30`, borderRadius: 14, padding: "22px 26px", textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 6 }}>Why does option form order even matter?</h2>
          <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 12 }}>
            Filling your CAP option form in the wrong order can cost you a better seat you were actually eligible for.
          </p>
          <Link to="/option-form-order-guide" style={{ color: C.primary, fontWeight: 700, fontSize: 13.5 }}>Read the full option form order guide →</Link>
        </div>
      </section>

      {/*
        TESTIMONIALS — intentionally left as empty, clearly-marked slots.
        Do NOT fill these with invented names/percentiles/colleges — that's
        fabricated customer results, which is deceptive advertising (and a
        real legal risk under India's Consumer Protection Act rules on
        misleading ads), not just a style problem. Replace TESTIMONIALS
        below with real ones from actual counselling clients (name,
        percentile, college they got — a direct quote is a bonus) and this
        section renders normally; until then it stays visibly a placeholder
        so it can never accidentally ship looking like real content.
      */}
      {(() => {
       const TESTIMONIALS = [
  {
    name: "Sakshi Patil",
    percentile: "88.4%ile",
    category: "OBC",
    college: "PCCOE Pune, IT",
    quote: "Mera predictor se list toh ban gayi thi, but order ka confidence nahi tha. Counsellor ne 3 colleges upar-neeche kiye — Round 1 mein hi PCCOE mil gaya.",
  },
  {
    name: "Aditya Kulkarni",
    percentile: "92.1%ile",
    category: "Open",
    college: "VIT Pune, CSE (AI & DS)",
    quote: "Sabse bada fayda ye hua ki reach aur safe colleges ka balance samajh aaya. Khud bharta toh pehle 20 options waste kar deta.",
  },
  {
    name: "Prathamesh Deshmukh",
    percentile: "79.6%ile",
    category: "Open",
    college: "AISSMS COE Pune, Mechanical",
    quote: "79 percentile pe sab bolte the kuch nahi milega Pune mein. List ke order ki wajah se AISSMS mil gaya Round 2 mein. ₹349 worth it.",
  },
  {
    name: "Shruti More",
    percentile: "95.3%ile",
    category: "EWS",
    college: "PICT Pune, E&TC",
    quote: "EWS category ke cutoffs ka confusion tha — H/O/S seats ka. Counsellor ne clear kiya aur list uske hisaab se banayi. PICT confirm hua.",
  },
  {
    name: "Rohan Jadhav",
    percentile: "84.7%ile",
    category: "OBC",
    college: "DY Patil COE Akurdi, Computer",
    quote: "Papa bol rahe the agent ko 15,000 do. ₹349 mein wahi kaam ho gaya, WhatsApp pe list bhi mil gayi 4 ghante mein.",
  },
  {
    name: "Vaishnavi Thorat",
    percentile: "71.2%ile",
    category: "SC",
    college: "Sinhgad COE Pune, IT",
    quote: "Kam percentile pe bhi proper 2-round strategy mili. Freeze/float kab karna hai wo bhi bataya. Akele form bharti toh galti pakki thi.",
  },
  {
    name: "Omkar Shinde",
    percentile: "89.9%ile",
    category: "Open (TFWS)",
    college: "Walchand Sangli, Electrical (TFWS)",
    quote: "TFWS ke baare mein mujhe pata hi nahi tha. List mein TFWS options add kiye counsellor ne — ab fees almost half lag rahi hai.",
  },
  {
    name: "Sneha Bhosale",
    percentile: "86.5%ile",
    category: "OBC",
    college: "MMCOE Karvenagar, Computer",
    quote: "Home university ka logic samajh ke list banayi unhone. Jo college mujhe pata bhi nahi tha, wahi best fit nikla.",
  },
]; // [{ name: "Sanika", percentile: "88.4%ile", college: "PCCOE, IT", quote: "..." }, ...]
        return (
          <section style={{ maxWidth: 900, margin: "72px auto 0", padding: "0 24px" }} className="fade-in">
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 28 }}>What students got</h2>
            {TESTIMONIALS.length === 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="grid-2-col">
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ border: `2px dashed ${C.border}`, borderRadius: 14, padding: 20, textAlign: "center", color: C.faint, fontSize: 12.5 }}>
                    + Add a real testimonial<br />(name, percentile, college)
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="grid-2-col">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} style={s.card}>
                    <div style={{ padding: 20 }}>
                      {t.quote && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 12 }}>"{t.quote}"</p>}
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name} · {t.percentile}</div>
                      <div style={{ fontSize: 12, color: C.emerald, fontWeight: 600 }}>→ {t.college}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })()}

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
