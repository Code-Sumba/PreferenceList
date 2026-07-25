import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { AdminLayout } from "./AdminLayout";
import { Spinner, EmptyState } from "../ui";
import { adminCreateStudent, adminListStudents } from "../../api";

const emptyForm = {
  student_name: "",
  student_email: "",
  mobile: "",
  gender: "Male",
  category_label: "OPEN",
  seat_type: "MH",
  special_category: "",
  linguistic_minority: false,
  religious_minority: false,
  district: "",
  home_city: "",
  home_university_code: "",
  percentile: "",
  jee_percentile: "",
  rank: "",
  preferred_cities_text: "",
  preferred_branches_text: "",
  risk_profile: "balanced",
  applying_tfws: false,
  college_autonomy_pref: "ANY",
  preferred_degree: "ANY",
  additional_notes: "",
};

export default function AdminStudentsPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = (q) => adminListStudents(q).then(setRows);
  useEffect(() => { load(""); }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const setValue = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setBool = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value === "Yes" }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.student_name.trim()) return toast.error("Student name is required.");
    if (!form.student_email.trim()) return toast.error("Student email is required.");

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        mobile: form.mobile.trim() || null,
        percentile: form.percentile === "" ? null : Number(form.percentile),
        jee_percentile: form.jee_percentile === "" ? null : Number(form.jee_percentile),
        rank: form.rank === "" ? null : Number(form.rank),
        preferred_cities: form.preferred_cities_text.split(",").map((v) => v.trim()).filter(Boolean),
        preferred_branches: form.preferred_branches_text.split(",").map((v) => v.trim()).filter(Boolean),
      };
      await adminCreateStudent(payload);
      toast.success("Student added.");
      setForm(emptyForm);
      setShowForm(false);
      load(search);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to add student.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Client Students</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input style={{ ...s.input, width: 260 }} placeholder="Search by email…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setShowForm((v) => !v)} style={{ ...s.btnPrimary, padding: "10px 14px" }} className="btn-primary">
            {showForm ? "Close form" : "+ Add student"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ ...s.card, marginBottom: 20 }}>
          <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Add student with intake details</span></div>
          <div style={{ ...s.cardBody, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div><label style={s.label}>Full Name *</label><input required style={s.input} value={form.student_name} onChange={setValue("student_name")} /></div>
            <div><label style={s.label}>Email *</label><input required type="email" style={s.input} value={form.student_email} onChange={setValue("student_email")} /></div>
            <div><label style={s.label}>Mobile</label><input style={s.input} value={form.mobile} onChange={setValue("mobile")} /></div>
            <div><label style={s.label}>Gender</label><select style={s.input} value={form.gender} onChange={setValue("gender")}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
            <div><label style={s.label}>Category</label><select style={s.input} value={form.category_label} onChange={setValue("category_label")}><option value="OPEN">OPEN</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="EWS">EWS</option><option value="VJNT">VJNT</option><option value="NT1">NT1</option><option value="NT2">NT2</option><option value="NT3">NT3</option></select></div>
            <div><label style={s.label}>Seat Type</label><select style={s.input} value={form.seat_type} onChange={setValue("seat_type")}><option value="MH">MH</option><option value="HU">HU</option><option value="OH">OH</option></select></div>
            <div><label style={s.label}>Special Category</label><input style={s.input} value={form.special_category} onChange={setValue("special_category")} /></div>
            <div><label style={s.label}>Linguistic Minority</label><select style={s.input} value={form.linguistic_minority ? "Yes" : "No"} onChange={setBool("linguistic_minority")}><option value="No">No</option><option value="Yes">Yes</option></select></div>
            <div><label style={s.label}>Religious Minority</label><select style={s.input} value={form.religious_minority ? "Yes" : "No"} onChange={setBool("religious_minority")}><option value="No">No</option><option value="Yes">Yes</option></select></div>
            <div><label style={s.label}>District</label><input style={s.input} value={form.district} onChange={setValue("district")} /></div>
            <div><label style={s.label}>Home City</label><input style={s.input} value={form.home_city} onChange={setValue("home_city")} /></div>
            <div><label style={s.label}>Home University</label><input style={s.input} value={form.home_university_code} onChange={setValue("home_university_code")} /></div>
            <div><label style={s.label}>CET Percentile</label><input type="number" step="0.01" style={s.input} value={form.percentile} onChange={setValue("percentile")} /></div>
            <div><label style={s.label}>JEE Percentile</label><input type="number" step="0.01" style={s.input} value={form.jee_percentile} onChange={setValue("jee_percentile")} /></div>
            <div><label style={s.label}>Rank</label><input type="number" style={s.input} value={form.rank} onChange={setValue("rank")} /></div>
            <div><label style={s.label}>Preferred Cities (comma separated)</label><input style={s.input} value={form.preferred_cities_text} onChange={setValue("preferred_cities_text")} /></div>
            <div><label style={s.label}>Preferred Branches (comma separated)</label><input style={s.input} value={form.preferred_branches_text} onChange={setValue("preferred_branches_text")} /></div>
            <div><label style={s.label}>Risk Profile</label><select style={s.input} value={form.risk_profile} onChange={setValue("risk_profile")}><option value="balanced">Balanced</option><option value="safe">Safe</option><option value="ambitious">Ambitious</option></select></div>
            <div><label style={s.label}>Applying for TFWS</label><select style={s.input} value={form.applying_tfws ? "Yes" : "No"} onChange={setBool("applying_tfws")}><option value="No">No</option><option value="Yes">Yes</option></select></div>
            <div><label style={s.label}>College Autonomy Pref</label><select style={s.input} value={form.college_autonomy_pref} onChange={setValue("college_autonomy_pref")}><option value="ANY">Any</option><option value="AUTONOMOUS_ONLY">Autonomous Only</option><option value="NON_AUTONOMOUS_ONLY">Non-Autonomous Only</option></select></div>
            <div><label style={s.label}>Preferred Degree</label><select style={s.input} value={form.preferred_degree} onChange={setValue("preferred_degree")}><option value="ANY">Any</option><option value="BE">B.E</option><option value="BTECH">B.Tech</option></select></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={s.label}>Additional Notes</label><textarea style={{ ...s.input, minHeight: 90, resize: "vertical" }} value={form.additional_notes} onChange={setValue("additional_notes")} /></div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ ...s.btnGhost, padding: "10px 14px" }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ ...s.btnPrimary, padding: "10px 14px", opacity: submitting ? 0.7 : 1 }} className="btn-primary">{submitting ? <Spinner size={16} /> : "Save student"}</button>
            </div>
          </div>
        </form>
      )}

      {!rows ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon="🧑‍🎓" title="No students found" subtitle="No client-app students match this search." />
      ) : (
        <div style={{ ...s.card, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.surfaceHigh, textAlign: "left" }}>
                {["Email", "Status", "Credits", "Total Paid", "Submitted", "Approved"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} onClick={() => navigate(`/staff/admin/students/${encodeURIComponent(r.email)}`)} style={{ borderTop: `1px solid ${C.border}`, cursor: "pointer" }} className="hover-card">
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{r.name || r.email}<div style={{ fontSize: 11, color: C.faint }}>{r.email}</div></td>
                  <td style={{ padding: "12px 16px" }}>{r.status}</td>
                  <td style={{ padding: "12px 16px" }}>{r.credits_balance}</td>
                  <td style={{ padding: "12px 16px" }}>₹{r.total_paid_inr}</td>
                  <td style={{ padding: "12px 16px" }}>{r.lists_submitted}</td>
                  <td style={{ padding: "12px 16px" }}>{r.lists_approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
