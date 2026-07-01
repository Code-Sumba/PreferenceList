// Adapted from frontend/src/components/pages/ToolPage.jsx:32-44 (copied,
// not imported) — mirrors the backend's derive_category_codes so
// AddCollegePanel can compute a margin for a manually-added college using
// the same CAP cutoff codes the engine used.
const CASTE_MAP = { OPEN: "OPEN", OBC: "OBC", SC: "SC", ST: "ST", VJ: "VJ", VJNT: "VJ", NT1: "NT1", NT2: "NT2", NT3: "NT3", SEBC: "SEBC" };
const SEAT_SUFFIX = { MH: "S", HU: "H", OH: "O" };

export function deriveCategoryCodes(category, seatType, gender) {
  const cat = (category || "").toUpperCase();
  const st = (seatType || "").toUpperCase();
  if (cat === "EWS") return ["EWS"];
  if (cat === "TFWS" || st === "TFWS") return ["TFWS"];
  const caste = CASTE_MAP[cat] || cat;
  const suffix = SEAT_SUFFIX[st] || "S";
  const g = (gender || "").toLowerCase();
  const prefixes = g === "female" ? ["G", "L"] : ["G"];
  return prefixes.map((p) => `${p}${caste}${suffix}`);
}
