import { Link, useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useJsonLd } from "../../hooks/useJsonLd";

// Edit these two lines each time this page is updated during CAP season —
// everything else (title suffix, JSON-LD dateModified) derives from them.
// Only bump LAST_UPDATED_ISO when the content below actually changed;
// Google discounts freshness signals from dates bumped without real edits.
const LAST_UPDATED_DISPLAY = "3 July 2026";
const LAST_UPDATED_ISO = "2026-07-03T18:00:00+05:30";
const FIRST_PUBLISHED_ISO = "2026-07-03T09:00:00+05:30";

const LATEST_UPDATES = [
  "Document verification started today. E-Scrutiny candidates: upload documents via the portal, no Facilitation Centre visit needed. Physical Scrutiny candidates: visit your selected Facilitation Centre with original documents.",
  "Registration continues on fe2026.mahacet.org — don't wait till the last day, the portal slows down near deadlines.",
  "Reserved category students: keep caste validity / NCL / EWS certificates ready — without them you'll be treated as Open category.",
];

const SCHEDULE = [
  { event: "CAP Registration + Document Upload begins", date: "2 July 2026" },
  { event: "Last date: Registration + Document Upload", date: "12 July 2026, 5 PM" },
  { event: "Document Verification (E-Scrutiny / Physical)", date: "3 – 13 July 2026, 5 PM" },
  { event: "Provisional Merit List", date: "15 July 2026" },
  { event: "Grievance Window", date: "16 – 18 July 2026" },
  { event: "Final Merit List", date: "20 July 2026" },
  { event: "CAP Round 1 Option Form Entry", date: "After final merit list (dates awaited)" },
  { event: "CAP Round 1 Allotment", date: "To be announced" },
  { event: "CAP Round 2", date: "To be announced" },
  { event: "CAP Round 3", date: "To be announced" },
  { event: "Institute-Level / Spot Admissions", date: "To be announced" },
];

const FAQS = [
  {
    q: "Is CAP round started in Maharashtra for engineering?",
    a: "Yes. CAP registration for engineering started on 2 July 2026 and closes 12 July 2026, 5 PM, on fe2026.mahacet.org.",
  },
  {
    q: "What is the last date for CAP registration 2026?",
    a: "12 July 2026, 5:00 PM (registration + document upload). Verification closes 13 July, 5 PM.",
  },
  {
    q: "When will the MHT-CET merit list come?",
    a: "Provisional merit list: 15 July 2026. Final merit list: 20 July 2026, after the grievance window (16–18 July).",
  },
  {
    q: "When will CAP Round 1 allotment happen?",
    a: "Option form entry begins after the final merit list (20 July). Exact allotment dates will be updated here as soon as CET Cell announces them.",
  },
  {
    q: "Is there any registration fee?",
    a: "Candidates who registered for MHT-CET 2026 generally don't pay again; JEE Main/NEET-only candidates pay the applicable CAP fee online. Check the official brochure for your category's exact amount.",
  },
];

export default function CapRoundLiveUpdatesPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    `MHT-CET CAP Round 2026: Live Updates & All Dates (Updated: ${LAST_UPDATED_DISPLAY})`,
    `MHT-CET CAP Round 2026 live status — registration open till 12 July, verification till 13 July, merit list 15 July. All CAP dates updated daily. Last updated ${LAST_UPDATED_DISPLAY}.`,
    "/cap-round-2026"
  );

  useJsonLd("cap-round-article-schema", {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "MHT CET CAP Round 2026: Live Updates & All Dates",
    datePublished: FIRST_PUBLISHED_ISO,
    dateModified: LAST_UPDATED_ISO,
    author: { "@type": "Organization", name: "MindzSpark", url: "https://collegelist.mindzspark.in/about" },
    publisher: {
      "@type": "Organization",
      name: "MindzSpark",
      logo: { "@type": "ImageObject", url: "https://collegelist.mindzspark.in/logo.png" },
    },
    image: "https://collegelist.mindzspark.in/og-image.png",
    mainEntityOfPage: "https://collegelist.mindzspark.in/cap-round-2026",
  });

  useJsonLd("cap-round-faq-schema", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <div style={s.hero} className="fade-in hero-section">
        <div style={{ display: "inline-block", background: "#fef2f2", color: C.red, fontSize: 12, fontWeight: 800, borderRadius: 20, padding: "6px 16px", marginBottom: 16 }}>
          🔴 Updated: {LAST_UPDATED_DISPLAY}
        </div>
        <h1 style={s.heroTitle} className="hero-title">
          MHT-CET CAP Round 2026 — Live Updates & Complete Schedule
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          <strong>Quick answer:</strong> Yes, CAP Round 2026 registration has started. Registration and document
          upload for Engineering (BE/BTech) opened on 2 July 2026 on fe2026.mahacet.org and closes on 12 July 2026,
          5:00 PM. Document verification (E-Scrutiny/Physical) runs from 3 July to 13 July 2026, 5:00 PM.
        </p>
        <p style={{ fontSize: 12.5, color: C.muted }}>This page is updated daily during CAP season — bookmark it.</p>
      </div>

      <section style={{ maxWidth: 760, margin: "0 auto 32px", padding: "0 24px" }} className="fade-in">
        <div style={{ ...s.card, borderColor: "#fecaca" }}>
          <div style={{ padding: "20px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: C.red, marginBottom: 10 }}>
              🔴 Latest Update — {LAST_UPDATED_DISPLAY}
            </h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 18 }}>
              {LATEST_UPDATES.map((u) => (
                <li key={u} style={{ fontSize: 13.5, color: C.text, lineHeight: 1.6 }}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto 32px", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>Complete CAP 2026 Schedule (Engineering)</h2>
        <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 16 }}>Upcoming dates will be added here the day CET Cell announces them.</p>
        <div style={s.card}>
          <div style={{ display: "flex", background: C.surfaceHigh, padding: "10px 20px", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            <div style={{ flex: "1 1 60%" }}>Event</div>
            <div style={{ flex: "1 1 40%" }}>Date</div>
          </div>
          {SCHEDULE.map((row) => (
            <div key={row.event} style={{ display: "flex", padding: "12px 20px", borderTop: `1px solid ${C.border}` }}>
              <div style={{ flex: "1 1 60%", fontSize: 13.5, color: C.text }}>{row.event}</div>
              <div style={{ flex: "1 1 40%", fontSize: 13.5, color: C.muted, fontWeight: 600 }}>{row.date}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto 32px", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 16 }}>What Should You Be Doing Right Now? ({LAST_UPDATED_DISPLAY.split(" ").slice(0, 2).join(" ")})</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.card}>
            <div style={{ padding: "18px 22px" }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: C.text, marginBottom: 6 }}>If you haven't registered</h3>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>Register today on fe2026.mahacet.org using your MHT-CET application number and roll number. Keep scanned documents ready before starting.</p>
            </div>
          </div>
          <div style={s.card}>
            <div style={{ padding: "18px 22px" }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: C.text, marginBottom: 6 }}>If you registered but verification is pending</h3>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>E-Scrutiny: upload clean, readable scans today so you have buffer time if the application is returned for correction. Physical: visit your Facilitation Centre by 8–10 July — the last 3 days will be crowded.</p>
            </div>
          </div>
          <div style={s.card}>
            <div style={{ padding: "18px 22px" }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: C.text, marginBottom: 6 }}>If verification is done</h3>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>
                Relax till 15 July. Use this time to research colleges and build your preference list — that's the step where most students ruin a good percentile.{" "}
                <Link to="/apply" style={{ color: C.primary, fontWeight: 700 }}>Get a ₹349 counsellor-reviewed preference list →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto 32px", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>How Many CAP Rounds Are There?</h2>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
          Typically 3 CAP rounds for engineering, followed by institute-level admissions for vacant seats.{" "}
          <Link to="/option-form-order-guide" style={{ color: C.primary, fontWeight: 700 }}>See the full CAP option-form order strategy →</Link>
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto 32px", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>Important Links</h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 18 }}>
          <li style={{ fontSize: 13.5, color: C.text }}>
            CAP Portal (Engineering): <a href="https://fe2026.mahacet.org" target="_blank" rel="noopener noreferrer" style={{ color: C.primary, fontWeight: 700 }}>fe2026.mahacet.org</a>
          </li>
          <li style={{ fontSize: 13.5, color: C.text }}>
            CET Cell Official: <a href="https://cetcell.mahacet.org" target="_blank" rel="noopener noreferrer" style={{ color: C.primary, fontWeight: 700 }}>cetcell.mahacet.org</a>
          </li>
          <li style={{ fontSize: 13.5, color: C.text }}>
            Free college predictor: <a href="https://mhtcet.mindzspark.in" style={{ color: C.primary, fontWeight: 700 }}>mhtcet.mindzspark.in</a>
          </li>
          <li style={{ fontSize: 13.5, color: C.text }}>
            <Link to="/sample-list" style={{ color: C.primary, fontWeight: 700 }}>See a sample preference list →</Link>
          </li>
        </ul>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto 40px", padding: "0 24px" }} className="fade-in">
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, textAlign: "center", marginBottom: 20 }}>FAQs</h2>
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

      <section style={{ maxWidth: 760, margin: "0 auto 48px", padding: "0 24px" }} className="fade-in">
        <div style={{ background: C.primaryFaint, border: `1px solid ${C.primary}30`, borderRadius: 14, padding: "26px 28px", textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Don't leave your preference list for the last day</h2>
          <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 16 }}>
            Once the merit list is out, CAP round deadlines move fast. Get your counsellor-reviewed list ready in advance — ₹349 for two personalized CAP round lists, approved within 6 hours.
          </p>
          <button onClick={() => navigate("/apply")} style={{ ...s.btnPrimary, padding: "13px 32px", fontSize: 14.5 }} className="btn-primary">
            Get My Preference List — ₹349
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}
