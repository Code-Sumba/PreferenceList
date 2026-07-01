// One row in DashboardPage's "Your Lists" — for approved lists, expands
// into a REORDER-ONLY editor (drag-and-drop, no delete, no add-college —
// CollegeCard's delete button is omitted by not passing onDelete, and
// AddCollegePanel is never rendered here at all). Saving sends the list
// back into the same staff review queue via PUT .../reorder, which the
// backend also validates server-side to reject anything but a pure
// reorder (same set of colleges, different order).
import { useState } from "react";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { Spinner, Tag } from "../ui";
import { CollegeCard } from "../college/CollegeCard";
import { getMyReviewDetail, reorderMyReview, downloadMyReviewFile } from "../../api";

export function DashboardListRow({ review, onChanged }) {
  const { C, s } = useBrand();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggleExpand = async () => {
    if (expanded) { setExpanded(false); return; }
    setLoading(true);
    try {
      const detail = await getMyReviewDetail(review.id);
      setColleges(detail.ordered_list);
      setExpanded(true);
    } catch {
      toast.error("Failed to load list.");
    } finally {
      setLoading(false);
    }
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
    setDragFrom(null);
    setDragOver(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await reorderMyReview(review.id, colleges);
      toast.success("Reordered list sent to our counselling team for a quick re-check.");
      setExpanded(false);
      onChanged?.();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: C.surfaceHigh, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 14px" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            Submitted {new Date(review.submitted_at).toLocaleString()}
            {review.revision_count > 0 && <span style={{ color: C.muted, fontWeight: 400 }}> · revised {review.revision_count}x</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <Tag label={review.status === "approved" ? "Approved" : "Under review"} color={review.status === "approved" ? "#16a34a" : "#d97706"} />
          {review.status === "approved" && (
            <>
              <button onClick={() => downloadMyReviewFile(review.id, "pdf")} style={{ ...s.btnPrimary, padding: "7px 14px", fontSize: 12 }} className="btn-primary">PDF</button>
              <button onClick={() => downloadMyReviewFile(review.id, "excel")} style={{ ...s.btnGhost, padding: "7px 14px", fontSize: 12 }}>Excel</button>
              <button onClick={toggleExpand} disabled={loading} style={{ ...s.btnGhost, padding: "7px 14px", fontSize: 12 }}>
                {loading ? <Spinner size={12} /> : expanded ? "Close" : "Reorder"}
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 14px 14px" }}>
          <p style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>
            Drag to reorder. You can't add or remove colleges here — for that, contact support. Saving sends this order to our team for a quick re-check before it's final again.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }} onDragLeave={() => setDragOver(null)}>
            {colleges.map((item, idx) => (
              <CollegeCard
                key={`${item.college_code}-${item.branch_code}-${idx}`}
                item={item} index={idx}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={dragOver === idx}
              />
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} style={{ ...s.btnPrimary, width: "100%", padding: 11, opacity: saving ? 0.6 : 1 }} className="btn-primary">
            {saving ? <Spinner size={16} color="#fff" /> : "Save & Send for Re-Review"}
          </button>
        </div>
      )}
    </div>
  );
}
