// Adapted from frontend/src/components/pages/ToolPage.jsx:465-521 (logic)
// and :1246-1330 (markup) — copied, not imported. Reused twice in this app:
// the student's ListWorkspace and the staff ReviewDetailPage.
import { useEffect, useState } from "react";
import { useBrand } from "../../contexts/BrandContext";
import { Spinner } from "../ui";
import { browseColleges, getCollegeBranches } from "../../api";
import { deriveCategoryCodes } from "../../utils/deriveCategoryCodes";

export function AddCollegePanel({ form, currentCount, onAdd }) {
  const { C, s } = useBrand();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    if (!query.trim() || selectedCollege) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await browseColleges(query.trim());
        setResults(res);
      } catch { /* silent */ }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [query, selectedCollege]);

  const handleSelectCollege = async (college) => {
    setSelectedCollege(college);
    setQuery(college.name);
    setResults([]);
    setSelectedBranch(null);
    setBranches([]);
    setBranchLoading(true);
    try {
      // The engine has no Cutoff rows for the live prediction year — fall
      // back to the most recent historical year for display purposes.
      const data = await getCollegeBranches(college.code, 2025);
      setBranches(data.branches || []);
    } catch {
      /* silent */
    } finally {
      setBranchLoading(false);
    }
  };

  const handleAdd = () => {
    if (!selectedCollege || !selectedBranch) return;

    const studentCodes = form.category_codes?.length > 0
      ? form.category_codes
      : deriveCategoryCodes(form.category_label, form.seat_type, form.gender);
    const branchCutoffs = selectedBranch.cutoffs || [];
    const matched = branchCutoffs.filter((c) => studentCodes.includes(c.category_code));
    const bestCutoff = matched.reduce((best, c) =>
      c.closing_percentile != null && (best == null || c.closing_percentile > best.closing_percentile) ? c : best, null);
    const cutoffPct = bestCutoff?.closing_percentile ?? 0;
    const margin = cutoffPct > 0 ? Math.round((parseFloat(form.percentile) - cutoffPct) * 10000) / 10000 : null;

    onAdd({
      sr_no: currentCount + 1,
      college_code: selectedCollege.code,
      college_name: selectedCollege.name,
      branch_code: selectedBranch.branch_code,
      branch_name: selectedBranch.branch_name,
      city: selectedCollege.city,
      category: bestCutoff?.category_code ?? null,
      cutoff_percentile: cutoffPct,
      bucket: null,
      margin,
      confidence: null,
    });

    setSelectedCollege(null);
    setSelectedBranch(null);
    setQuery("");
    setBranches([]);
  };

  return (
    <div style={{ marginTop: 20, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surfaceHigh }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Add Individual College</span>
          <span style={{ fontSize: 12, color: C.muted, marginLeft: 10 }}>Manually add any college to this list</span>
        </div>
        <button
          onClick={() => { setOpen((v) => !v); setQuery(""); setResults([]); setSelectedCollege(null); setSelectedBranch(null); setBranches([]); }}
          style={{ background: open ? `${C.primary}15` : "none", border: `1px solid ${open ? C.primary : C.border}`, color: open ? C.primary : C.muted, borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          {open ? "✕ Close" : "+ Add College"}
        </button>
      </div>

      {open && (
        <div style={{ padding: "0 18px 18px", display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }} className="grid-2-col">
          <div style={{ position: "relative" }}>
            <label style={{ ...s.label, marginBottom: 6 }}>
              Search College
              {searching && <span style={{ marginLeft: 8, fontSize: 10, color: C.muted }}>searching…</span>}
            </label>
            <input
              style={{ ...s.input, padding: "10px 14px" }}
              placeholder="Type college name or code…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedCollege(null); setSelectedBranch(null); setBranches([]); }}
            />
            {results.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 24px #0003", zIndex: 200, maxHeight: 240, overflowY: "auto" }}>
                {results.map((c) => (
                  <button
                    key={c.code} onClick={() => handleSelectCollege(c)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12, color: C.text }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>{c.code} · {c.city}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ ...s.label, marginBottom: 6 }}>Branch</label>
            {branchLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, ...s.input, padding: "10px 14px", color: C.muted, fontSize: 13 }}>
                <Spinner size={14} /> Loading branches…
              </div>
            ) : (
              <select
                style={{ ...s.input, padding: "10px 14px", cursor: selectedCollege ? "pointer" : "not-allowed" }}
                value={selectedBranch ? selectedBranch.choice_code : ""}
                onChange={(e) => setSelectedBranch(branches.find((b) => b.choice_code === e.target.value) || null)}
                disabled={!selectedCollege || branches.length === 0}
              >
                <option value="">{selectedCollege ? "— Select branch —" : "— Pick a college first —"}</option>
                {branches.map((b) => (
                  <option key={b.choice_code} value={b.choice_code}>{b.branch_name}</option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedCollege || !selectedBranch}
            style={{ ...s.btnPrimary, padding: "10px 22px", whiteSpace: "nowrap", opacity: (!selectedCollege || !selectedBranch) ? 0.45 : 1 }}
            className="btn-primary"
          >
            + Add to List
          </button>
        </div>
      )}
    </div>
  );
}
