import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { WHATSAPP_IS_CONFIGURED, whatsappChatUrl } from "../../config/whatsapp";

const SESSION_KEY = "exitIntentShown";

// Fires once per browser tab session when the cursor leaves the top of the
// viewport (the classic "about to close the tab / switch away" signal on
// desktop). Skipped on touch devices — there's no reliable exit-intent
// signal on mobile, and an unexpected popup there just reads as broken.
export function ExitIntentPopup() {
  const { C, s } = useBrand();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const handleMouseOut = (e) => {
      if (e.clientY > 0 || e.relatedTarget) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(true);
      document.removeEventListener("mouseout", handleMouseOut);
    };

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, []);

  if (!visible) return null;

  const close = () => setVisible(false);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={close}
    >
      <div
        style={{ background: "#fff", borderRadius: 16, padding: "28px 26px", maxWidth: 380, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={close} aria-label="Close" style={{ float: "right", background: "none", border: "none", fontSize: 18, color: C.faint, cursor: "pointer", lineHeight: 1 }}>×</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 10, clear: "both" }}>
          Abhi decide nahi kar pa rahe?
        </h2>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
          Free predictor try karo, ya seedha WhatsApp pe sawaal poochho — koi obligation nahi.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a
            href="https://mhtcet.mindzspark.in"
            style={{ ...s.btnGhost, textDecoration: "none", padding: "11px 20px", fontSize: 13.5 }}
          >
            Try the free predictor →
          </a>
          {WHATSAPP_IS_CONFIGURED && (
            <a
              href={whatsappChatUrl("Hi! I have a question before I decide.")}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...s.btnPrimary, textDecoration: "none", padding: "11px 20px", fontSize: 13.5 }}
              className="btn-primary"
            >
              Ask on WhatsApp →
            </a>
          )}
          <button
            onClick={() => { close(); navigate("/apply"); }}
            style={{ background: "none", border: "none", color: C.muted, fontSize: 12.5, cursor: "pointer", marginTop: 4 }}
          >
            Or just get my list — ₹349
          </button>
        </div>
      </div>
    </div>
  );
}
