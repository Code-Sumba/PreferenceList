import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { PublicLayout } from "../layout/PublicLayout";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { WHATSAPP_IS_CONFIGURED, whatsappChatUrl } from "../../config/whatsapp";

export default function AboutPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();

  useDocumentMeta(
    "About MindzSpark — Who Reviews Your MHT-CET Preference List",
    "MindzSpark's counsellor-reviewed MHT-CET preference list service: who builds and checks your list, and how the review process actually works.",
    "/about"
  );

  return (
    <PublicLayout navLinks={[
      { label: "Log In", onClick: () => navigate("/login") },
      { label: "Get My List", primary: true, onClick: () => navigate("/apply") },
    ]}>
      <div style={s.hero} className="fade-in hero-section">
        <h1 style={s.heroTitle} className="hero-title">
          About MindzSpark
        </h1>
        <p style={s.heroSubtitle} className="hero-subtitle">
          A counsellor-reviewed MHT-CET preference list service — built so students never have to submit a raw, unreviewed algorithm output as their official CAP option form order.
        </p>
      </div>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }} className="fade-in">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={s.card}>
            <div style={{ padding: "22px 26px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>What we do</h2>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
                Collegelist.mindzspark.in is MindzSpark's counsellor-reviewed MHT-CET preference list product. You enter your percentile, rank, category, seat type, and preferences; our engine drafts a ranked list from historical cutoff data; then a real counsellor reviews and corrects that draft before it's finalized. You only ever see the counsellor-approved version — never the raw draft.
              </p>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ padding: "22px 26px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>How review actually works</h2>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
                Every submitted list enters a staff review queue. A counsellor checks college eligibility, ordering, and category/seat-type accuracy, can reorder or edit entries, and only then approves it for delivery. If you later reorder your own approved list, it goes back through the same review queue before being finalized again — a counsellor always signs off on the version that ships.
              </p>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ padding: "22px 26px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Related MindzSpark tools</h2>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
                MindzSpark also runs a free MHT-CET percentile-and-rank-to-college predictor at{" "}
                <a href="https://mhtcet.mindzspark.in" style={{ color: C.primary, fontWeight: 700 }}>mhtcet.mindzspark.in</a>. That tool gives a free, non-reviewed estimate of what you might get; this ₹349 service is the counsellor-reviewed, finalized version meant for actually filling your CAP form.
              </p>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ padding: "22px 26px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>What we are not</h2>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
                MindzSpark is an independent counselling service. We are not affiliated with, endorsed by, or connected to the State CET Cell, Maharashtra, or DTE. Official CAP registration and option-form submission happen only on the official CET Cell portal — our service only helps you decide what order to fill your own form in.
              </p>
            </div>
          </div>

          <div style={s.card}>
            <div style={{ padding: "22px 26px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Questions before you pay?</h2>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
                Message us on WhatsApp — the same channel our counsellors use to reach students during CAP rounds.
              </p>
              {WHATSAPP_IS_CONFIGURED ? (
                <a href={whatsappChatUrl("Hi! I have a question before I purchase a preference list.")} target="_blank" rel="noopener noreferrer" style={{ ...s.btnPrimary, display: "inline-block", padding: "10px 22px", fontSize: 13.5, textDecoration: "none" }} className="btn-primary">
                  Chat on WhatsApp
                </a>
              ) : (
                <p style={{ fontSize: 12, color: C.faint }}>WhatsApp contact coming soon.</p>
              )}
            </div>
          </div>
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
