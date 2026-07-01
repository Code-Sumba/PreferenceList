// Lightweight login for RETURNING students — email + OTP only, no info
// form. New students still go through /apply (which collects their
// academic details as part of getting a list generated); this page is
// purely for coming back later to check status, download an approved
// list, or buy more credits.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { PublicLayout } from "../layout/PublicLayout";
import { Spinner } from "../ui";
import { sendOtp, verifyOtp } from "../../api";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function StudentLoginPage() {
  const { s, brandSlug } = useBrand();
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  useDocumentMeta(
    "Log In | MindzSpark MHT-CET Preference List",
    "Log in to view your MHT-CET preference list status, download an approved list, or buy more credits."
  );

  const [step, setStep] = useState(0); // 0 = email, 1 = otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter your email.");
    setSending(true);
    try {
      await sendOtp(email.trim(), brandSlug);
      toast.success("OTP sent to your email.");
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("Enter the OTP.");
    setVerifying(true);
    try {
      const { token, student } = await verifyOtp(email.trim(), otp.trim());
      saveSession(token, student);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid OTP.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ maxWidth: 380, margin: "60px auto" }} className="fade-in">
        <div style={s.card}>
          <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>{step === 0 ? "Log In" : "Verify Your Email"}</span></div>
          <div style={s.cardBody}>
            {step === 0 ? (
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={s.label}>Email</label>
                  <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
                </div>
                <button type="submit" disabled={sending} style={{ ...s.btnPrimary, padding: 12, opacity: sending ? 0.6 : 1 }} className="btn-primary">
                  {sending ? <Spinner size={16} color="#fff" /> : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#6b7280" }}>We sent a 6-digit code to <strong>{email}</strong></p>
                <input
                  style={{ ...s.input, textAlign: "center", fontSize: 24, letterSpacing: 8, padding: 14 }}
                  value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} placeholder="······" autoFocus
                />
                <button type="submit" disabled={verifying} style={{ ...s.btnPrimary, padding: 12, opacity: verifying ? 0.6 : 1 }} className="btn-primary">
                  {verifying ? <Spinner size={16} color="#fff" /> : "Verify & Log In"}
                </button>
                <button type="button" onClick={() => setStep(0)} style={{ ...s.btnGhost, padding: 10 }}>← Back</button>
              </form>
            )}
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
          New here? <a href="/apply" style={{ color: "#2563eb", fontWeight: 600 }}>Get your preference list →</a>
        </p>
      </div>
    </PublicLayout>
  );
}
