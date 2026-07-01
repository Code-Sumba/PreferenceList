// One independent "list slot". Adapted from frontend/src/components/pages/
// ToolPage.jsx's engine-mode search (:359-407) — copied, not imported, and
// simplified to engine-only (see plan §2.2).
//
// IMPORTANT: per the trust requirement (plan §0.3 — "a student must never
// see a raw, unreviewed, engine-generated list"), Generate and Submit are
// now a SINGLE action: the moment the engine returns results, this
// component submits them straight into the review queue without ever
// rendering the college rows to the student. Drag-and-drop reorder and
// "add college" for THIS raw list now happen only on the staff side
// (client/src/components/staff/ReviewDetailPage.jsx, which reuses the same
// CollegeCard/AddCollegePanel components). The student only sees content
// again once a counsellor has approved it (PDF/Excel download).
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { Spinner } from "../ui";
import { generatePreferences, getMyReviews, submitReview, downloadMyReviewFile } from "../../api";

const ENGINE_YEAR = 2026;
const POLL_MS = 30000;

export function ListWorkspace({ slotLabel, initialForm, branchNameToId, credits, onCreditsChange }) {
  const { C, s } = useBrand();

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | pending_review | approved
  const [reviewId, setReviewId] = useState(null);
  const [collegeCount, setCollegeCount] = useState(0);
  const pollRef = useRef(null);

  useEffect(() => {
    if (status !== "pending_review" || !reviewId) return;
    pollRef.current = setInterval(async () => {
      try {
        const reviews = await getMyReviews();
        const mine = reviews.find((r) => r.id === reviewId);
        if (mine?.status === "approved") {
          setStatus("approved");
          toast.success(`${slotLabel}: your list has been approved!`);
        }
      } catch { /* silent — retry next tick */ }
    }, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [status, reviewId, slotLabel]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleGenerateAndSubmit = async () => {
    if (credits <= 0) return toast.error("No credits remaining.");
    if (!window.confirm(`Generating will use 1 of your ${credits} remaining credit(s) and send your list straight to our counselling team for review. Continue?`)) return;

    if (!form.percentile) return toast.error("Percentile is required.");
    if (!form.rank) return toast.error("Rank is required.");

    const branchPrefs = (form.preferred_branches || [])
      .filter(Boolean)
      .map((name, i) => ({ branch_id: branchNameToId[name], priority: i + 1 }))
      .filter((bp) => bp.branch_id != null);

    setStatus("submitting");
    try {
      const res = await generatePreferences({
        year: ENGINE_YEAR,
        target_round: 1,
        cet_percentile: parseFloat(form.percentile),
        cet_group: "PCM",
        category: form.category_label,
        seat_type: form.seat_type,
        gender: form.gender,
        branch_preferences: branchPrefs,
        preferred_cities: (form.preferred_cities || []).filter(Boolean),
        risk_profile: form.risk_profile,
        category_codes: form.category_codes || [],
      });
      onCreditsChange(res.credits_remaining);

      // Mapped locally, never assigned to rendered state — the student's
      // browser holds this only long enough to forward it to /reviews/submit.
      const ranked = (res.options || []).map((o, i) => ({
        sr_no: o.rank ?? i + 1,
        college_code: o.institute_code || o.choice_code,
        college_name: o.college_name,
        branch_code: o.choice_code?.length >= 10 ? o.choice_code.slice(5, 10) : "",
        branch_name: o.branch_name,
        city: o.city || "",
        category: o.bucket,
        cutoff_percentile: o.reference_percentile ?? 0,
        bucket: o.bucket,
        margin: o.margin,
        confidence: o.confidence,
      }));

      if (ranked.length === 0) {
        setStatus("idle");
        return toast.error("No colleges matched your inputs — try a different risk strategy or percentile.");
      }

      const formData = {
        student_name: form.student_name.trim(),
        student_email: form.student_email.trim() || null,
        percentile: parseFloat(form.percentile),
        rank: parseInt(form.rank, 10),
        category_label: (form.category_codes || []).length > 0 ? form.category_codes.join(", ") : `${form.category_label} · ${form.seat_type}`,
        seat_types: [form.seat_type],
        gender: form.gender,
        home_city: form.home_city,
        mobile: form.mobile || null,
        preferred_cities: form.preferred_cities || [],
        preferred_branches: form.preferred_branches || [],
        cutoff_year: ENGINE_YEAR,
      };
      const exportList = ranked.map((c) => ({
        sr_no: c.sr_no,
        college_code: c.college_code,
        college_name: c.college_name,
        branch_code: c.branch_code,
        branch_name: c.branch_name,
        city: c.city || "",
        category: c.category,
        cutoff_percentile: c.cutoff_percentile,
        bucket: c.bucket ?? null,
        margin: c.margin ?? null,
        confidence: c.confidence ?? null,
      }));

      const { review_id, status: st } = await submitReview(formData, exportList);
      setReviewId(review_id);
      setCollegeCount(ranked.length);
      setStatus(st);
      toast.success(`${slotLabel}: submitted for review!`);
    } catch (e) {
      setStatus("idle");
      if (e.response?.status === 402) {
        toast.error("No credits remaining.");
      } else {
        toast.error(e.response?.data?.detail || "Generation failed.");
      }
    }
  };

  const handleDownload = (kind) => downloadMyReviewFile(reviewId, kind, `${form.student_name}_preference_list.${kind === "excel" ? "xlsx" : "pdf"}`);

  return (
    <div style={s.card}>
      <div style={s.cardHdr}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{slotLabel}</span>
        {status !== "idle" && (
          <span style={{ fontSize: 11, fontWeight: 700, color: status === "approved" ? C.emerald : status === "pending_review" ? C.amber : C.muted }}>
            {status === "pending_review" ? "Under review" : status === "approved" ? "Approved" : ""}
          </span>
        )}
      </div>
      <div style={s.cardBody}>
        {status === "idle" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="grid-2-col">
            <div>
              <label style={s.label}>Percentile</label>
              <input style={s.input} type="number" step="0.0000001" value={form.percentile} onChange={set("percentile")} />
            </div>
            <div>
              <label style={s.label}>Rank</label>
              <input style={s.input} type="number" value={form.rank} onChange={set("rank")} />
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
              <button onClick={handleGenerateAndSubmit} disabled={credits <= 0} style={{ ...s.btnPrimary, width: "100%", padding: 12, opacity: credits <= 0 ? 0.6 : 1 }} className="btn-primary">
                {credits <= 0 ? "No credits remaining" : "Generate List (uses 1 credit)"}
              </button>
            </div>
          </div>
        )}

        {status === "submitting" && (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spinner size={24} />
            <p style={{ fontSize: 13, color: C.muted, marginTop: 12 }}>Generating and sending to our counselling team…</p>
          </div>
        )}

        {status === "pending_review" && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>
              {collegeCount > 0 ? `${collegeCount} colleges compiled — ` : ""}Our counselling team is reviewing your list.
            </p>
            <p style={{ fontSize: 12, color: "#92400e", marginTop: 4 }}>You'll get an email the moment it's approved.</p>
          </div>
        )}

        {status === "approved" && (
          <div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>Reviewed and approved by our counselling team.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleDownload("pdf")} style={{ ...s.btnPrimary, flex: 1, padding: 12 }} className="btn-primary">Download PDF</button>
              <button onClick={() => handleDownload("excel")} style={{ ...s.btnGhost, flex: 1, padding: 12 }}>Download Excel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
