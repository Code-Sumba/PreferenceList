import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { Spinner } from "../ui";
import { adminCheckKey, setAdminKey } from "../../api";

export default function AdminKeyGatePage() {
  const { s } = useBrand();
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      const ok = await adminCheckKey(key.trim());
      if (!ok) throw new Error();
      setAdminKey(key.trim());
      navigate("/staff/admin");
    } catch {
      toast.error("Invalid admin key.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ ...s.card, width: 360, margin: 0 }}>
        <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Admin Access</span></div>
        <div style={{ ...s.cardBody, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={s.label}>Admin Key</label>
            <input style={s.input} type="password" value={key} onChange={(e) => setKey(e.target.value)} required autoFocus />
          </div>
          <button type="submit" disabled={checking} style={{ ...s.btnPrimary, padding: 12, opacity: checking ? 0.6 : 1 }} className="btn-primary">
            {checking ? <Spinner size={16} color="#fff" /> : "Enter"}
          </button>
        </div>
      </form>
    </div>
  );
}
