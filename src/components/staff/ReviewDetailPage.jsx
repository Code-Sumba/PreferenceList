import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { AppLayout } from "../layout/AppLayout";
import { Spinner, Tag } from "../ui";
import { CollegeCard } from "../college/CollegeCard";
import { AddCollegePanel } from "../college/AddCollegePanel";
import { CollegeFilterPanel } from "./CollegeFilterPanel";
import { approveReview, getReview, updateReviewList } from "../../api";

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

  return (
    <AppLayout showCredits={false}>
      <button onClick={() => navigate("/staff/reviews")} style={{ ...s.btnGhost, padding: "6px 14px", fontSize: 12, marginBottom: 16 }}>← Back to queue</button>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{review.student_name || review.student_email}</h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            Percentile {review.percentile ?? "—"} · Rank {review.rank ?? "—"} · For CAP Round {review.round ?? "—"} · {review.total_colleges} colleges
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {review.revision_count > 0 && <Tag label={`Student revision #${review.revision_count}`} color="#d97706" />}
          <Tag label={review.brand_name || "MindzSpark"} />
        </div>
      </div>

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
