// Staff sign-in reuses the EXISTING password-based employee login endpoint
// (POST /api/auth/login, unmodified) — no new auth mechanism for staff.
// After login we call GET /api/auth/me (also existing, unmodified) because
// the login response's `employee` field omits `role`; /auth/me's
// get_current_student dependency includes it, which is what
// StaffProtectedRoute needs to gate access.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../ui";
import { staffLogin, staffMe } from "../../api";

export default function StaffLoginPage() {
  const { C, s } = useBrand();
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token } = await staffLogin(email.trim(), password);
      localStorage.setItem("mspub_token", access_token);
      const me = await staffMe();
      if (me.role !== "employee") {
        localStorage.removeItem("mspub_token");
        toast.error("This account doesn't have staff access.");
        return;
      }
      saveSession(access_token, me);
      navigate("/staff/reviews");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleLogin} style={{ ...s.card, width: 360, margin: 0 }}>
        <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Staff Sign In</span></div>
        <div style={{ ...s.cardBody, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{ ...s.btnPrimary, padding: 12, opacity: loading ? 0.6 : 1 }} className="btn-primary">
            {loading ? <Spinner size={16} color="#fff" /> : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
