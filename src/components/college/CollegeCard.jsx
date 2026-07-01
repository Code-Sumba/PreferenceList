// Adapted from frontend/src/components/pages/ToolPage.jsx:142-231 (copied,
// not imported). Simplified to engine-only (this app has no legacy
// 2024/2025 dual-mode — see plan §2.2), so the isEngine branching is
// dropped and bucket-based styling always applies.
//
// Layout is grouped into two wrappers (name+branch, and the stat chips)
// rather than nine flat grid columns, specifically so mobile can collapse
// them via CSS alone (see .college-row's mobile rules in utils/theme.js) —
// a flat 9-column grid has no clean way to reflow onto a narrow screen.
import { useBrand } from "../../contexts/BrandContext";

const BUCKET_STYLE = {
  Safe: { color: "#16a34a", bg: "#34d39915", border: "#34d39940" },
  Moderate: { color: "#1d4ed8", bg: "#6366f115", border: "#6366f140" },
  Ambitious: { color: "#d97706", bg: "#fbbf2415", border: "#fbbf2440" },
  Reject: { color: "#dc2626", bg: "#ef444415", border: "#ef444440" },
};

export function CollegeCard({ item, index, onDelete, onDragStart, onDragOver, onDrop, isDragOver }) {
  const { C } = useBrand();
  const hasPct = typeof item.cutoff_percentile === "number" && item.cutoff_percentile > 0;
  const bucketStyle = item.bucket ? (BUCKET_STYLE[item.bucket] || BUCKET_STYLE.Reject) : null;

  const cardBg = bucketStyle ? bucketStyle.bg : "#34d39908";
  const cardBorder = isDragOver ? C.primary : (bucketStyle ? bucketStyle.border : "#34d39920");

  return (
    <div
      className="college-row"
      draggable
      onDragStart={() => onDragStart?.(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(index); }}
      onDrop={() => onDrop?.(index)}
      style={{
        display: "grid",
        gridTemplateColumns: "18px 40px 2fr 100px 60px 68px 80px 28px",
        gap: 8, alignItems: "center",
        background: isDragOver ? `${C.primary}10` : cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 10, padding: "10px 14px",
        cursor: "grab",
      }}
    >
      <span style={{ color: C.faint, fontSize: 12, cursor: "grab", userSelect: "none" }}>⠿</span>
      <span className="college-srno" style={{ width: 28, height: 28, borderRadius: 7, background: `${C.primary}20`, color: C.primary, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {item.sr_no}
      </span>

      <div className="college-main" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.college_name}</div>
          <div style={{ fontSize: 10, color: C.faint }}>{item.college_code}</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.branch_name}</div>
          <div style={{ fontSize: 10, color: C.faint }}>{item.branch_code}</div>
        </div>
      </div>

      <span className="college-meta" style={{ fontSize: 11, color: C.muted }}>{item.city || "—"}</span>

      <span className="college-meta">
        {bucketStyle ? (
          <span style={{ fontSize: 10, fontWeight: 800, background: bucketStyle.bg, color: bucketStyle.color, border: `1px solid ${bucketStyle.border}`, borderRadius: 5, padding: "2px 7px", textAlign: "center" }}>
            {item.bucket}
          </span>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, borderRadius: 5, padding: "2px 7px", textAlign: "center" }}>{item.category || "—"}</span>
        )}
      </span>

      <span className="college-meta" style={{ textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: item.margin > 1 ? C.emerald : item.margin < -0.5 ? C.red : C.amber }}>
          {item.margin != null ? `${item.margin > 0 ? "+" : ""}${item.margin.toFixed(2)}` : "—"}
        </span>
      </span>

      <span className="college-meta" style={{ textAlign: "right" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: bucketStyle ? bucketStyle.color : C.emerald, display: "block" }}>
          {hasPct ? item.cutoff_percentile.toFixed(4) : "—"}
        </span>
        {item.confidence && (
          <span style={{ fontSize: 8.5, color: item.confidence === "estimated" ? "#f97316" : C.faint, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {item.confidence === "estimated" ? "est. open" : item.confidence} conf
          </span>
        )}
      </span>

      {onDelete ? (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(index); }}
          title="Remove from list"
          style={{ background: "none", border: "none", cursor: "pointer", color: C.faint, fontSize: 14, padding: "2px 4px", borderRadius: 4, lineHeight: 1 }}
        >
          ×
        </button>
      ) : <span />}
    </div>
  );
}
