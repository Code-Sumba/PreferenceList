// Adapted from frontend/src/components/ui/index.jsx (copied, not imported).
// Each component pulls C/s from useBrand() instead of a static theme import,
// since this app's colors/logo change at runtime per partner subdomain.
import { useState, useRef } from "react";
import { useBrand } from "../../contexts/BrandContext";

// ── Logo ──────────────────────────────────────────────────────────────────────
export function Logo({ size = 36 }) {
  const { brand } = useBrand();
  return (
    <img
      src={brand.logo_url || "/logo.png"}
      width={size}
      height={size}
      alt={brand.name}
      style={{ borderRadius: size * 0.22, flexShrink: 0, display: "block", objectFit: "cover" }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}

// ── NavBar ────────────────────────────────────────────────────────────────────
export function NavBar({ links = [] }) {
  const { brand, s, C } = useBrand();
  return (
    <nav style={s.nav}>
      <div style={s.navInner} className="nav-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <Logo />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontWeight: 800, color: "#111827", fontSize: 15, letterSpacing: "-0.3px", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{brand.name}</span>
            <span style={{ color: "#9ca3af", fontSize: 10, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{brand.tagline || "MHT-CET Counselling"}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }} className="nav-links">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.onClick}
              style={{
                background: l.primary ? C.primary : "transparent",
                color: l.primary ? "#fff" : "#6b7280",
                border: l.primary ? "none" : "1px solid #e2e8f0",
                borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, color }) {
  const { C } = useBrand();
  const c = color || C.primary;
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: `2.5px solid ${c}30`, borderTopColor: c,
      borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}

// ── MultiSelect with search ───────────────────────────────────────────────────
export function MultiSelect({ label, options = [], selected = [], onChange, placeholder = "Select…", required }) {
  const { C, s } = useBrand();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const toggle = (val) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  const display = selected.length === 0 ? placeholder
    : selected.length <= 2 ? selected.join(", ")
    : `${selected.slice(0, 2).join(", ")} +${selected.length - 2} more`;

  return (
    <div style={{ position: "relative" }}>
      {label && (
        <label style={s.label}>
          {label}{required && <span style={{ color: C.primary, marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 40); }}
        style={{ ...s.input, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: selected.length ? C.text : C.faint }}
      >
        <span style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{display}</span>
        <span style={{ color: C.faint, fontSize: 10, marginLeft: 8, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => { setOpen(false); setQuery(""); }} />
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 10,
            background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)", display: "flex", flexDirection: "column", maxHeight: 280,
          }}>
            <div style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
              <input
                ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…" style={{ ...s.input, padding: "7px 10px", fontSize: 13 }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpen(false); setQuery(""); }
                  if (e.key === "Enter" && filtered.length === 1) toggle(filtered[0]);
                }}
              />
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.length === 0
                ? <div style={{ padding: "12px 16px", color: C.muted, fontSize: 13 }}>No results for "{query}"</div>
                : filtered.map((opt) => {
                  const active = selected.includes(opt);
                  return (
                    <div
                      key={opt} onClick={() => toggle(opt)}
                      style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 10, background: active ? C.primaryFaint : "transparent", color: active ? C.primary : C.text }}
                    >
                      <span style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, border: `2px solid ${active ? C.primary : C.faint}`, background: active ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {active && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
                      </span>
                      {opt}
                    </div>
                  );
                })}
            </div>
            {selected.length > 0 && (
              <div style={{ padding: "7px 14px", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: C.muted }}>{selected.length} selected</span>
                <button onClick={(e) => { e.stopPropagation(); onChange([]); }} style={{ background: "none", border: "none", color: C.red, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Clear all</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
// On narrow screens, the full row of circle+label per step (esp. with 6-7
// steps and long labels like "College & Additional Info") doesn't fit and
// forces horizontal overflow of the whole page. .step-current-label /
// .step-label / .step-circle / .step-connector are targeted by the
// @media(max-width:640px) block in theme.js's GLOBAL_CSS to hide the
// per-step text and shrink circles down to a compact dot-row instead,
// while still surfacing the current step's name as its own line.
export function StepBar({ steps, current }) {
  const { C } = useBrand();
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="step-current-label" style={{ display: "none", fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>
        Step {current + 1} of {steps.length}: {steps[current]}
      </div>
      <div className="step-bar" style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div className="step-circle" style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? C.emerald : active ? C.primary : "#f1f5f9",
                  border: `2px solid ${done ? C.emerald : active ? C.primary : "#e2e8f0"}`,
                  fontSize: 13, fontWeight: 700, color: (done || active) ? "#fff" : C.faint,
                  flexShrink: 0,
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <span className="step-label" style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.text : done ? C.emerald : C.muted, whiteSpace: "nowrap" }}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="step-connector" style={{ flex: 1, height: 2, background: done ? C.emerald : "#e2e8f0", margin: "0 12px", minWidth: 6 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action }) {
  const { C, s } = useBrand();
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ color: C.text, fontWeight: 700, marginBottom: 8, fontSize: 18 }}>{title}</h3>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: action ? 24 : 0, maxWidth: 360, margin: "0 auto" }}>{subtitle}</p>
      {action && <button onClick={action.onClick} style={{ ...s.btnPrimary, marginTop: 20 }} className="btn-primary">{action.label}</button>}
    </div>
  );
}

// ── Tag badge ─────────────────────────────────────────────────────────────────
export function Tag({ label, color }) {
  const { C, s } = useBrand();
  const c = color || C.primary;
  return <span style={{ ...s.badge, background: `${c}14`, color: c, border: `1px solid ${c}28` }}>{label}</span>;
}

export { WhatsAppFloat } from "./WhatsAppFloat";
