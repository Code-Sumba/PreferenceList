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
import { MAHARASHTRA_DISTRICTS } from "../../data/maharashtraDistricts";
import { HOME_UNIVERSITIES } from "../../data/homeUniversities";

const CATEGORIES = ["OPEN", "OBC", "SC", "ST", "EWS", "VJNT", "NT1", "NT2", "NT3"];
const SEAT_TYPES = [
  { code: "MH", label: "Maharashtra State Level" },
  { code: "HU", label: "Home University" },
  { code: "OH", label: "Other than Home University" },
];
const SPECIAL_CATEGORIES = [
  { code: "", label: "Not Applicable (NA)" },
  { code: "PWD", label: "Persons with Disability (PWD)" },
  { code: "DEFENCE", label: "Defence" },
  { code: "ORPHAN", label: "Orphan" },
];
const COLLEGE_AUTONOMY_OPTIONS = [
  { code: "ANY", label: "Both (Autonomous & Non-Autonomous)" },
  { code: "AUTONOMOUS_ONLY", label: "Autonomous Only" },
  { code: "NON_AUTONOMOUS_ONLY", label: "Non-Autonomous Only" },
];
const PREFERRED_DEGREE_OPTIONS = [
  { code: "ANY", label: "Both (B.E & B.Tech)" },
  { code: "BE", label: "B.E Only" },
  { code: "BTECH", label: "B.Tech Only" },
];

const STEPS = [
  "Personal", "Category & Reservation", "Location & Academic",
  "Preferences", "College & Additional Info", "Review", "Verify email",
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
    // Personal Information
    student_name: "",
    student_email: "",
    mobile: "",
    gender: "Male",
    // Category & Reservation Information
    category_label: "OPEN",
    seat_type: "MH",
    special_category: "",
    linguistic_minority: false,
    religious_minority: false,
    // Location & Academic Background
    district: "",
    home_city: "",
    home_university_code: "",
    percentile: "",
    jee_percentile: "",
    rank: "",
    // University & Branch Preferences
    preferred_cities: [],
    preferred_branches: [],
    risk_profile: "balanced",
    // College Preferences & Additional Information
    applying_tfws: false,
    college_autonomy_pref: "ANY",
    preferred_degree: "ANY",
    additional_notes: "",
  });

  const [step, setStep] = useState(0); // 0-4 = wizard sections, 5 = review, 6 = OTP
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
  const setBool = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === "Yes" }));
  const setMulti = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const mobileValid = !form.mobile || /^[6-9]\d{9}$/.test(form.mobile);

  const validateStep = (i) => {
    if (i === 0) {
      if (!form.student_name.trim()) return "Your name is required.";
      if (!form.student_email.trim()) return "Email is required.";
      if (!mobileValid) return "Enter a valid 10-digit mobile number.";
      if (!form.gender) return "Select gender.";
      return null;
    }
    if (i === 1) {
      if (!form.category_label) return "Select a category.";
      if (!form.seat_type) return "Select a candidature type.";
      return null;
    }
    if (i === 2) {
      if (!form.district) return "Select your district.";
      if (!form.home_university_code) return "Select your home university.";
      if (!form.home_city.trim()) return "Enter your home city.";
      if (!form.percentile && !form.jee_percentile) return "At least one exam percentile is required.";
      if (!form.rank) return "Rank is required.";
      return null;
    }
    if (i === 5) {
      if (!accuracyConfirmed) return "Please confirm your details are accurate before continuing.";
      return null;
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) return toast.error(err);
    setStep((st) => st + 1);
  };
  const goBack = () => setStep((st) => Math.max(0, st - 1));

  const handleContinue = async () => {
    const err = validateStep(5);
    if (err) return toast.error(err);

    setSending(true);
    try {
      await sendOtp(form.student_email.trim(), brandSlug);
      toast.success("OTP sent to your email.");
      setStep(6);
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

  const NavButtons = ({ onNext = goNext }) => (
    <div style={{ gridColumn: "1 / -1", marginTop: 8, display: "flex", gap: 10 }}>
      {step > 0 && <button onClick={goBack} style={{ ...s.btnGhost, padding: 13, flex: 1 }}>← Back</button>}
      <button onClick={onNext} style={{ ...s.btnPrimary, padding: 13, flex: 2 }} className="btn-primary">Continue →</button>
    </div>
  );

  return (
    <PublicLayout>
      <div style={{ maxWidth: 720, margin: "0 auto" }} className="fade-in">
        <StepBar steps={STEPS} current={step} />

        {step === 0 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Personal Information</span></div>
            <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2-col">
              <div>
                <label style={s.label}>Full Name *</label>
                <input style={s.input} value={form.student_name} onChange={set("student_name")} placeholder="Your full name" />
              </div>
              <div>
                <label style={s.label}>Mobile Number (WhatsApp) *</label>
                <input style={s.input} value={form.mobile} onChange={set("mobile")} placeholder="10-digit mobile" />
              </div>
              <div>
                <label style={s.label}>Email Address *</label>
                <input style={s.input} type="email" value={form.student_email} onChange={set("student_email")} placeholder="you@example.com" />
              </div>
              <div>
                <label style={s.label}>Gender *</label>
                <select style={s.input} value={form.gender} onChange={set("gender")}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <NavButtons />
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Category & Reservation Information</span></div>
            <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2-col">
              <div>
                <label style={s.label}>Candidature Type *</label>
                <select style={s.input} value={form.seat_type} onChange={set("seat_type")}>
                  {SEAT_TYPES.map((st) => <option key={st.code} value={st.code}>{st.label}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Category *</label>
                <select style={s.input} value={form.category_label} onChange={set("category_label")}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Special Category</label>
                <select style={s.input} value={form.special_category} onChange={set("special_category")}>
                  {SPECIAL_CATEGORIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
              <div />
              <div>
                <label style={s.label}>Linguistic Minority</label>
                <select style={s.input} value={form.linguistic_minority ? "Yes" : "NA"} onChange={setBool("linguistic_minority")}>
                  <option value="NA">Not Applicable (NA)</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Religious Minority</label>
                <select style={s.input} value={form.religious_minority ? "Yes" : "NA"} onChange={setBool("religious_minority")}>
                  <option value="NA">Not Applicable (NA)</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <NavButtons />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Location & Academic Background</span></div>
            <div style={{ padding: "16px 24px 0" }}>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>⚠ Double-check your percentile and rank</p>
                <p style={{ fontSize: 12, color: "#92400e", marginTop: 4, lineHeight: 1.5 }}>
                  Your preference list is generated strictly from what you enter below. Incorrect percentile, rank, category,
                  or seat type will produce an inaccurate list — and each generation uses one of your paid credits, so mistakes
                  can't be undone for free. We are not responsible for results caused by incorrect information you provide.
                </p>
              </div>
            </div>
            <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2-col">
              <div>
                <label style={s.label}>District *</label>
                <select style={s.input} value={form.district} onChange={set("district")}>
                  <option value="">Select your district</option>
                  {MAHARASHTRA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Home University *</label>
                <select style={s.input} value={form.home_university_code} onChange={set("home_university_code")}>
                  <option value="">Select your home university</option>
                  {HOME_UNIVERSITIES.map((u) => <option key={u.code} value={u.code}>{u.label}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Home City *</label>
                <input style={s.input} value={form.home_city} onChange={set("home_city")} placeholder="e.g. Pune" />
              </div>
              <div>
                <label style={s.label}>CET Rank *</label>
                <input style={s.input} type="number" value={form.rank} onChange={set("rank")} placeholder="e.g. 1234" />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 4 }}>* At least one exam percentile is required</p>
              </div>
              <div>
                <label style={s.label}>MHT CET Percentile</label>
                <input style={s.input} type="number" step="0.0000001" value={form.percentile} onChange={set("percentile")} placeholder="Enter percentile (0-100)" />
                <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Enter your MHT CET percentile score</p>
              </div>
              <div>
                <label style={s.label}>JEE Mains Percentile</label>
                <input style={s.input} type="number" step="0.0000001" value={form.jee_percentile} onChange={set("jee_percentile")} placeholder="Enter percentile (0-100)" />
                <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Enter your JEE Mains percentile score</p>
              </div>
              <NavButtons />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>University & Branch Preferences</span></div>
            <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2-col">
              <div>
                <label style={s.label}>Risk Strategy</label>
                <select style={s.input} value={form.risk_profile} onChange={set("risk_profile")}>
                  <option value="safe">Safe</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div />
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
              <NavButtons />
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>College Preferences & Additional Information</span></div>
            <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2-col">
              <div>
                <label style={s.label}>Applying for TFWS? *</label>
                <select style={s.input} value={form.applying_tfws ? "Yes" : "No"} onChange={setBool("applying_tfws")}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label style={s.label}>College Autonomy *</label>
                <select style={s.input} value={form.college_autonomy_pref} onChange={set("college_autonomy_pref")}>
                  {COLLEGE_AUTONOMY_OPTIONS.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={s.label}>Preferred Degree *</label>
                <select style={s.input} value={form.preferred_degree} onChange={set("preferred_degree")}>
                  {PREFERRED_DEGREE_OPTIONS.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={s.label}>Additional Suggestions or Requests</label>
                <textarea
                  style={{ ...s.input, minHeight: 90, resize: "vertical" }}
                  value={form.additional_notes}
                  onChange={set("additional_notes")}
                  placeholder="Any specific requirements, preferences, or questions you'd like to share…"
                />
              </div>
              <NavButtons />
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={s.card}>
            <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Review Application</span></div>
            <div style={{ ...s.cardBody, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "Personal Information", editStep: 0, rows: [
                  ["Full Name", form.student_name], ["Mobile", form.mobile], ["Email", form.student_email], ["Gender", form.gender],
                ] },
                { title: "Category & Reservation", editStep: 1, rows: [
                  ["Candidature Type", SEAT_TYPES.find((st) => st.code === form.seat_type)?.label], ["Category", form.category_label],
                  ["Special Category", SPECIAL_CATEGORIES.find((c) => c.code === form.special_category)?.label],
                  ["Linguistic Minority", form.linguistic_minority ? "Yes" : "Not Applicable (NA)"],
                  ["Religious Minority", form.religious_minority ? "Yes" : "Not Applicable (NA)"],
                ] },
                { title: "Location & Academic Background", editStep: 2, rows: [
                  ["District", form.district], ["Home University", HOME_UNIVERSITIES.find((u) => u.code === form.home_university_code)?.label],
                  ["Home City", form.home_city], ["CET Rank", form.rank],
                  ["MHT CET Percentile", form.percentile || "—"], ["JEE Mains Percentile", form.jee_percentile || "—"],
                ] },
                { title: "University & Branch Preferences", editStep: 3, rows: [
                  ["Risk Strategy", form.risk_profile], ["Preferred Cities", form.preferred_cities.join(", ") || "Any"],
                  ["Preferred Branches", form.preferred_branches.join(", ") || "Any"],
                ] },
                { title: "College Preferences & Additional Info", editStep: 4, rows: [
                  ["Applying for TFWS?", form.applying_tfws ? "Yes" : "No"],
                  ["College Autonomy", COLLEGE_AUTONOMY_OPTIONS.find((o) => o.code === form.college_autonomy_pref)?.label],
                  ["Preferred Degree", PREFERRED_DEGREE_OPTIONS.find((o) => o.code === form.preferred_degree)?.label],
                  ["Additional Notes", form.additional_notes || "—"],
                ] },
              ].map((section) => (
                <div key={section.title} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{section.title}</span>
                    <button onClick={() => setStep(section.editStep)} style={{ background: "none", border: "none", color: C.primary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                    {section.rows.map(([label, value]) => (
                      <div key={label} style={{ fontSize: 12.5 }}>
                        <span style={{ color: C.muted }}>{label}: </span>
                        <span style={{ color: C.text, fontWeight: 600 }}>{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: C.text, cursor: "pointer" }}>
                <input type="checkbox" checked={accuracyConfirmed} onChange={(e) => setAccuracyConfirmed(e.target.checked)} style={{ marginTop: 2 }} />
                I confirm the percentile, rank, and other details above are accurate to the best of my knowledge.
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={goBack} style={{ ...s.btnGhost, padding: 13, flex: 1 }}>← Back</button>
                <button onClick={handleContinue} disabled={sending || !accuracyConfirmed} style={{ ...s.btnPrimary, flex: 2, padding: 13, opacity: (sending || !accuracyConfirmed) ? 0.5 : 1 }} className="btn-primary">
                  {sending ? <Spinner size={16} color="#fff" /> : "Confirm & Continue →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
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
              <button onClick={() => setStep(5)} style={{ ...s.btnGhost, width: "100%", padding: 11, marginTop: 10 }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
