// Staff-side filter for narrowing down a bloated submission (e.g. a
// high-percentile student's list landing "Safe" bucket-uncapped before the
// backend fix — see client_credits.py's _cap_results_per_bucket). Filters
// by cutoff_percentile: greater-than, less-than, a manual range, or a
// tolerance quick-preset relative to the student's own percentile.
import { useState } from "react";
import { useBrand } from "../../contexts/BrandContext";

const TOLERANCE_PRESETS = [
  { label: "±5", minus: 5, plus: 5 },
  { label: "±10", minus: 10, plus: 10 },
  { label: "+10 / -5", minus: 5, plus: 10 },
  { label: "±15", minus: 15, plus: 15 },
];

export function CollegeFilterPanel({ percentile, onRangeChange }) {
  const { C, s } = useBrand();
  const [mode, setMode] = useState("all"); // all | gte | lte | between
  const [gteVal, setGteVal] = useState("");
  const [lteVal, setLteVal] = useState("");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");

  const apply = (range) => onRangeChange(range);

  const applyMode = (newMode) => {
    setMode(newMode);
    if (newMode === "all") return apply(null);
    if (newMode === "gte") return apply(gteVal !== "" ? { lo: parseFloat(gteVal), hi: 100 } : null);
    if (newMode === "lte") return apply(lteVal !== "" ? { lo: 0, hi: parseFloat(lteVal) } : null);
    if (newMode === "between") return apply(minVal !== "" && maxVal !== "" ? { lo: parseFloat(minVal), hi: parseFloat(maxVal) } : null);
  };

  const applyTolerance = (preset) => {
    if (percentile == null) return;
    setMode("between");
    const lo = Math.max(0, percentile - preset.minus);
    const hi = Math.min(100, percentile + preset.plus);
    setMinVal(String(lo));
    setMaxVal(String(hi));
    apply({ lo, hi });
  };

  return (
    <div style={{ background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
        Filter by cutoff percentile
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {[
          { key: "all", label: "All" },
          { key: "gte", label: "≥" },
          { key: "lte", label: "≤" },
          { key: "between", label: "Between" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => applyMode(m.key)}
            style={{ ...(mode === m.key ? s.btnPrimary : s.btnGhost), padding: "6px 14px", fontSize: 12 }}
            className={mode === m.key ? "btn-primary" : ""}
          >
            {m.label}
          </button>
        ))}

        {mode === "gte" && (
          <input type="number" placeholder="e.g. 90" value={gteVal} style={{ ...s.input, width: 100, padding: "6px 10px" }}
            onChange={(e) => { setGteVal(e.target.value); apply(e.target.value !== "" ? { lo: parseFloat(e.target.value), hi: 100 } : null); }} />
        )}
        {mode === "lte" && (
          <input type="number" placeholder="e.g. 95" value={lteVal} style={{ ...s.input, width: 100, padding: "6px 10px" }}
            onChange={(e) => { setLteVal(e.target.value); apply(e.target.value !== "" ? { lo: 0, hi: parseFloat(e.target.value) } : null); }} />
        )}
        {mode === "between" && (
          <>
            <input type="number" placeholder="min" value={minVal} style={{ ...s.input, width: 90, padding: "6px 10px" }}
              onChange={(e) => { setMinVal(e.target.value); if (maxVal !== "") apply({ lo: parseFloat(e.target.value), hi: parseFloat(maxVal) }); }} />
            <span style={{ color: C.muted, fontSize: 12, alignSelf: "center" }}>to</span>
            <input type="number" placeholder="max" value={maxVal} style={{ ...s.input, width: 90, padding: "6px 10px" }}
              onChange={(e) => { setMaxVal(e.target.value); if (minVal !== "") apply({ lo: parseFloat(minVal), hi: parseFloat(e.target.value) }); }} />
          </>
        )}
      </div>

      {percentile != null && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: C.muted }}>Tolerance around student's {percentile}%ile:</span>
          {TOLERANCE_PRESETS.map((p) => (
            <button key={p.label} onClick={() => applyTolerance(p)} style={{ ...s.btnGhost, padding: "5px 12px", fontSize: 12 }}>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
