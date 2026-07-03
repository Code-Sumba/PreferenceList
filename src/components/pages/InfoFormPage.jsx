import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { PublicLayout } from "../layout/PublicLayout";
import { MultiSelect, Spinner, StepBar } from "../ui";
import { getEngineOptions, sendOtp, verifyOtp } from "../../api";
import { setPendingForm } from "../../utils/pendingForm";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

const CATEGORIES = ["OPEN", "OBC", "SC", "ST", "EWS", "VJNT", "NT1", "NT2", "NT3"];
const SEAT_TYPES = [
  { code: "MH", label: "Maharashtra State Level" },
  { code: "HU", label: "Home University" },
  { code: "OH", label: "Other than Home University" },
];

export default function InfoFormPage() {
  const { C, s, brandSlug } = useBrand();
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  useDocumentMeta(
    "Get Your MHT-CET Preference List — Enter Percentile & Rank | MindzSpark",
    "Enter your MHT-CET percentile, rank, category, and preferred colleges to get a counsellor-reviewed CAP round preference list.",
    "/apply"
  );

  const [opts, setOpts] = useState({ cities: [], branches: [] });
  const [optsLoaded, setOptsLoaded] = useState(false);

  const [form, setForm] = useState({
    student_name: "",
    student_email: "",
    mobile: "",
    percentile: "",
    rank: "",
    category_label: "OPEN",
    seat_type: "MH",
    gender: "Male",
    home_city: "",
    home_university_code: "",
    preferred_cities: [],
    preferred_branches: [],
    risk_profile: "balanced",
  });

  const [step, setStep] = useState(0); // 0 = form, 1 = OTP
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);

  useEffect(() => {
    getEngineOptions()
      .then((data) => setOpts(data))
      .catch(() => toast.error("Failed to load options. Refresh the page."))
      .finally(() => setOptsLoaded(true));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setMulti = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const mobileValid = !form.mobile || /^[6-9]\d{9}$/.test(form.mobile);

  const validate = () => {
    if (!form.student_name.trim()) return "Your name is required.";
    if (!form.student_email.trim()) return "Email is required.";
    if (!form.percentile) return "Percentile is required.";
    if (!form.rank) return "Rank is required.";
    if (!form.category_label) return "Select a category.";
    if (!form.seat_type) return "Select a seat type.";
    if (!form.gender) return "Select gender.";
    if (!form.home_city.trim()) return "Enter your home city.";
    if (!mobileValid) return "Enter a valid 10-digit mobile number.";
    if (!accuracyConfirmed) return "Please confirm your details are accurate before continuing.";
    return null;
  };

  const handleContinue = async () => {
    const err = validate();
    if (err) return toast.error(err);

    setSending(true);
    try {
      await sendOtp(form.student_email.trim(), brandSlug);
      toast.success("OTP sent to your email.");
      setStep(1);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) return toast.error("Enter the OTP.");
    setVerifying(true);
    try {
      const { token, student } = await verifyOtp(form.student_email.trim(), otp.trim());
      saveSession(token, student);
      setPendingForm(form);
      navigate("/payment");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Invalid OTP.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ maxWidth: 720, margin: "0 auto" }} className="fade-in">
        <StepBar steps={["Your details", "Verify email"]} current={step} />

        {step === 0 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Tell us about yourself</span></div>
            <div style={{ padding: "16px 24px 0" }}>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>⚠ Double-check your percentile, rank, and other details</p>
                <p style={{ fontSize: 12, color: "#92400e", marginTop: 4, lineHeight: 1.5 }}>
                  Your preference list is generated strictly from what you enter below. Incorrect percentile, rank, category,
                  or seat type will produce an inaccurate list — and each generation uses one of your paid credits, so mistakes
                  can't be undone for free. We are not responsible for results caused by incorrect information you provide.
                </p>
              </div>
            </div>
            <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2-col">
              <div>
                <label style={s.label}>Full Name *</label>
                <input style={s.input} value={form.student_name} onChange={set("student_name")} placeholder="Your full name" />
              </div>
              <div>
                <label style={s.label}>Email *</label>
                <input style={s.input} type="email" value={form.student_email} onChange={set("student_email")} placeholder="you@example.com" />
              </div>
              <div>
                <label style={s.label}>Mobile Number</label>
                <input style={s.input} value={form.mobile} onChange={set("mobile")} placeholder="10-digit mobile" />
              </div>
              <div>
                <label style={s.label}>Home City *</label>
                <input style={s.input} value={form.home_city} onChange={set("home_city")} placeholder="e.g. Pune" />
              </div>

              <div>
                <label style={s.label}>CET Percentile *</label>
                <input style={s.input} type="number" step="0.0000001" value={form.percentile} onChange={set("percentile")} placeholder="e.g. 95.4550679" />
              </div>
              <div>
                <label style={s.label}>CET Rank *</label>
                <input style={s.input} type="number" value={form.rank} onChange={set("rank")} placeholder="e.g. 1234" />
              </div>

              <div>
                <label style={s.label}>Category *</label>
                <select style={s.input} value={form.category_label} onChange={set("category_label")}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Seat Type *</label>
                <select style={s.input} value={form.seat_type} onChange={set("seat_type")}>
                  {SEAT_TYPES.map((st) => <option key={st.code} value={st.code}>{st.label}</option>)}
                </select>
              </div>

              <div>
                <label style={s.label}>Gender *</label>
                <select style={s.input} value={form.gender} onChange={set("gender")}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Risk Strategy</label>
                <select style={s.input} value={form.risk_profile} onChange={set("risk_profile")}>
                  <option value="safe">Safe</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                {optsLoaded ? (
                  <MultiSelect label="Preferred Cities" options={opts.cities} selected={form.preferred_cities} onChange={setMulti("preferred_cities")} placeholder="Any city" />
                ) : <Spinner />}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                {optsLoaded ? (
                  <MultiSelect
                    label="Preferred Branches"
                    options={(opts.branches || []).map((b) => b.name)}
                    selected={form.preferred_branches}
                    onChange={setMulti("preferred_branches")}
                    placeholder="Any branch"
                  />
                ) : <Spinner />}
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: C.text, cursor: "pointer" }}>
                  <input type="checkbox" checked={accuracyConfirmed} onChange={(e) => setAccuracyConfirmed(e.target.checked)} style={{ marginTop: 2 }} />
                  I confirm the percentile, rank, and other details above are accurate to the best of my knowledge.
                </label>
              </div>

              <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                <button onClick={handleContinue} disabled={sending || !accuracyConfirmed} style={{ ...s.btnPrimary, width: "100%", padding: 13, opacity: (sending || !accuracyConfirmed) ? 0.5 : 1 }} className="btn-primary">
                  {sending ? <Spinner size={16} color="#fff" /> : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Verify your email</span></div>
            <div style={{ ...s.cardBody, maxWidth: 360, margin: "0 auto", textAlign: "center" }}>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>
                We sent a 6-digit code to <strong>{form.student_email}</strong>
              </p>
              <input
                style={{ ...s.input, textAlign: "center", fontSize: 24, letterSpacing: 8, padding: "14px" }}
                value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="······"
              />
              <button onClick={handleVerify} disabled={verifying} style={{ ...s.btnPrimary, width: "100%", padding: 13, marginTop: 16, opacity: verifying ? 0.6 : 1 }} className="btn-primary">
                {verifying ? <Spinner size={16} color="#fff" /> : "Verify & Continue"}
              </button>
              <button onClick={() => setStep(0)} style={{ ...s.btnGhost, width: "100%", padding: 11, marginTop: 10 }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
