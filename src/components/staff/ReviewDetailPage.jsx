import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { AppLayout } from "../layout/AppLayout";
import { Spinner, Tag } from "../ui";
import { CollegeCard } from "../college/CollegeCard";
import { AddCollegePanel } from "../college/AddCollegePanel";
import { CollegeFilterPanel } from "./CollegeFilterPanel";
import { approveReview, getReview, updateReviewList, updateReviewStudentName } from "../../api";

export default function ReviewDetailPage() {
  const { C, s } = useBrand();
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [filterRange, setFilterRange] = useState(null); // {lo, hi} | null
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    getReview(id)
      .then((r) => { setReview(r); setColleges(r.ordered_list || []); })
      .catch(() => toast.error("Failed to load submission."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = (idx) => {
    setColleges((prev) => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, sr_no: i + 1 })));
    setDirty(true);
  };
  const handleDragStart = (idx) => setDragFrom(idx);
  const handleDragOver = (idx) => setDragOver(idx);
  const handleDrop = (targetIdx) => {
    if (dragFrom === null || dragFrom === targetIdx) { setDragFrom(null); setDragOver(null); return; }
    setColleges((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(targetIdx, 0, moved);
      return next.map((c, i) => ({ ...c, sr_no: i + 1 }));
    });
    setDragFrom(null); setDragOver(null); setDirty(true);
  };
  const handleAdd = (item) => { setColleges((prev) => [...prev, item]); setDirty(true); };

  const startEditName = () => { setNameInput(review.student_name || ""); setEditingName(true); };
  const cancelEditName = () => setEditingName(false);
  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return toast.error("Name can't be empty.");
    setSavingName(true);
    try {
      await updateReviewStudentName(id, trimmed);
      setReview((prev) => ({ ...prev, student_name: trimmed }));
      setEditingName(false);
      toast.success("Student name updated.");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const inRange = (item) => !filterRange || (item.cutoff_percentile >= filterRange.lo && item.cutoff_percentile <= filterRange.hi);
  const indexed = colleges.map((item, idx) => ({ item, idx }));
  const visible = indexed.filter(({ item }) => inRange(item));

  const handleBulkRemoveOutside = () => {
    if (!filterRange) return;
    const keepCount = visible.length;
    const removeCount = colleges.length - keepCount;
    if (removeCount <= 0) return toast.error("Nothing outside this range to remove.");
    if (!window.confirm(`Remove ${removeCount} college(s) outside ${filterRange.lo.toFixed(1)}–${filterRange.hi.toFixed(1)} percentile? Keeps the ${keepCount} currently visible.`)) return;
    setColleges((prev) => prev.filter(inRange).map((c, i) => ({ ...c, sr_no: i + 1 })));
    setFilterRange(null);
    setDirty(true);
    toast.success(`Removed ${removeCount} college(s).`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateReviewList(id, colleges);
      setDirty(false);
      toast.success("Changes saved.");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (dirty) return toast.error("Save your changes before approving.");
    if (!window.confirm("Approve and notify the student by email?")) return;
    setApproving(true);
    try {
      await approveReview(id);
      toast.success("Approved and student notified!");
      navigate("/staff/reviews");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <AppLayout showCredits={false}><div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div></AppLayout>;
  if (!review) return null;

  const addPanelForm = { percentile: review.percentile, category_label: "", seat_type: "", gender: "", category_codes: [] };

  const app = review.application;
  const waNumber = app?.mobile ? app.mobile.replace(/\D/g, "").replace(/^(?!91)(\d{10})$/, "91$1") : "";
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi ${review.student_name || "there"}, this is ${review.brand_name || "MindzSpark"} regarding your MHT-CET preference list (submission #${review.id}).`)}`
    : "";

  const yesNo = (v) => (v ? "Yes" : "No");
  const detailFields = app ? [
    ["Mobile", app.mobile],
    ["Gender", app.gender],
    ["Home City", app.home_city],
    ["District", app.district],
    ["Home University", app.home_university_code],
    ["Seat Type", app.seat_type],
    ["Category", app.category_label],
    ["CET Percentile", app.cet_percentile],
    ["JEE Percentile", app.jee_percentile],
    ["Special Category", app.special_category],
    ["Linguistic Minority", yesNo(app.linguistic_minority)],
    ["Religious Minority", yesNo(app.religious_minority)],
    ["Applying TFWS", yesNo(app.applying_tfws)],
    ["Autonomy Preference", app.college_autonomy_pref],
    ["Preferred Degree", app.preferred_degree],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "") : [];

  return (
    <AppLayout showCredits={false}>
      <button onClick={() => navigate("/staff/reviews")} style={{ ...s.btnGhost, padding: "6px 14px", fontSize: 12, marginBottom: 16 }}>← Back to queue</button>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <div>
          {editingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                autoFocus
                style={{ ...s.input, padding: "6px 10px", fontSize: 16, fontWeight: 700, width: 240 }}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") cancelEditName(); }}
                placeholder="Student name"
              />
              <button onClick={handleSaveName} disabled={savingName} style={{ ...s.btnPrimary, padding: "6px 12px", fontSize: 12 }}>
                {savingName ? <Spinner size={14} color="#fff" /> : "Save"}
              </button>
              <button onClick={cancelEditName} disabled={savingName} style={{ ...s.btnGhost, padding: "6px 12px", fontSize: 12 }}>
                Cancel
              </button>
            </div>
          ) : (
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, display: "flex", alignItems: "center", gap: 10 }}>
              {review.student_name || review.student_email}
              <button
                onClick={startEditName}
                title="Edit student name"
                style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
              >
                ✎ Edit name
              </button>
            </h2>
          )}
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Percentile {review.percentile ?? "—"} · Rank {review.rank ?? "—"} · For CAP Round {review.round ?? "—"} · {review.total_colleges} colleges
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#25D366", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          )}
          {review.revision_count > 0 && <Tag label={`Student revision #${review.revision_count}`} color="#d97706" />}
          <Tag label={review.brand_name || "MindzSpark"} />
        </div>
      </div>

      {app && (
        <div style={{ ...s.card, marginBottom: 16 }}>
          <div style={s.cardBody}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Student Details</h3>
              <span style={{ fontSize: 11, color: C.faint }}>As filled in the intake form</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px 20px" }}>
              {detailFields.map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 700, wordBreak: "break-word" }}>
                    {label === "Mobile" && waLink ? (
                      <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "none" }}>{value}</a>
                    ) : String(value)}
                  </div>
                </div>
              ))}
            </div>
            {app.additional_notes && (
              <div style={{ marginTop: 14, background: C.bgSoft || "#f9fafb", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>Additional Notes from Student</div>
                <div style={{ fontSize: 13, color: C.text, whiteSpace: "pre-wrap" }}>{app.additional_notes}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={s.card}>
        <div style={s.cardBody}>
          <CollegeFilterPanel percentile={review.percentile} onRangeChange={setFilterRange} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              Showing {visible.length} of {colleges.length} colleges
              {filterRange && " — drag-and-drop is disabled while a filter is active"}
            </span>
            {filterRange && (
              <button onClick={handleBulkRemoveOutside} style={{ ...s.btnDanger, padding: "6px 14px", fontSize: 12 }}>
                Remove {colleges.length - visible.length} outside range
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }} onDragLeave={() => setDragOver(null)}>
            {visible.map(({ item, idx }) => (
              <CollegeCard
                key={`${item.college_code}-${item.branch_code}-${idx}`}
                item={item} index={idx}
                onDelete={handleDelete}
                onDragStart={filterRange ? undefined : handleDragStart}
                onDragOver={filterRange ? undefined : handleDragOver}
                onDrop={filterRange ? undefined : handleDrop}
                isDragOver={dragOver === idx}
              />
            ))}
          </div>

          <AddCollegePanel form={addPanelForm} currentCount={colleges.length} onAdd={handleAdd} />

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={handleSave} disabled={saving || !dirty} style={{ ...s.btnGhost, flex: 1, padding: 12, opacity: (!dirty || saving) ? 0.5 : 1 }}>
              {saving ? <Spinner size={16} /> : "Save Changes"}
            </button>
            <button onClick={handleApprove} disabled={approving || review.status === "approved"} style={{ ...s.btnPrimary, flex: 1, padding: 12, opacity: (approving || review.status === "approved") ? 0.6 : 1 }} className="btn-primary">
              {approving ? <Spinner size={16} color="#fff" /> : review.status === "approved" ? "Already Approved" : "Approve & Notify Student"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
