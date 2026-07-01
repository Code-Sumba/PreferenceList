import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { AdminLayout } from "./AdminLayout";
import { Spinner, Tag } from "../ui";
import { adminGetStudentDetail, adminAdjustCredits, adminSetEmployeeStatus } from "../../api";

export default function AdminStudentDetailPage() {
  const { C, s } = useBrand();
  const { email } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => adminGetStudentDetail(email).then(setData).catch(() => toast.error("Failed to load student."));
  useEffect(() => { load(); }, [email]);

  const handleAdjust = async () => {
    const d = parseInt(delta, 10);
    if (!d) return toast.error("Enter a non-zero number.");
    setBusy(true);
    try {
      await adminAdjustCredits(email, d, reason);
      toast.success("Credits adjusted.");
      setDelta(""); setReason("");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleStatus = async (status) => {
    if (!data?.id) return;
    setBusy(true);
    try {
      await adminSetEmployeeStatus(data.id, status);
      toast.success(`Status set to ${status}.`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!data) return <AdminLayout><div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div></AdminLayout>;

  return (
    <AdminLayout>
      <button onClick={() => navigate("/staff/admin/students")} style={{ ...s.btnGhost, padding: "6px 14px", fontSize: 12, marginBottom: 16 }}>← Back to students</button>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{data.name || data.email}</h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{data.email} · joined {new Date(data.created_at).toLocaleDateString()}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Tag label={data.status} color={data.status === "active" ? "#16a34a" : data.status === "banned" ? "#dc2626" : "#d97706"} />
          <Tag label={data.brand_name} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="grid-2-col">
        <div style={s.card}>
          <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Credits — Balance: {data.credits_balance}</span></div>
          <div style={s.cardBody}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input style={{ ...s.input, flex: 1 }} type="number" placeholder="+2 or -1" value={delta} onChange={(e) => setDelta(e.target.value)} />
              <input style={{ ...s.input, flex: 2 }} placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
              <button disabled={busy} onClick={handleAdjust} style={{ ...s.btnPrimary, padding: "10px 16px", whiteSpace: "nowrap" }} className="btn-primary">Adjust</button>
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {data.credit_transactions.map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none", fontSize: 12 }}>
                  <span style={{ color: C.muted }}>{t.type}</span>
                  <span style={{ fontWeight: 700, color: t.delta > 0 ? C.emerald : C.red }}>{t.delta > 0 ? "+" : ""}{t.delta} → {t.balance_after}</span>
                  <span style={{ color: C.faint }}>{new Date(t.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Account</span></div>
          <div style={s.cardBody}>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button disabled={busy || data.status === "active"} onClick={() => handleStatus("active")} style={{ ...s.btnGhost, flex: 1, padding: 10 }}>Activate</button>
              <button disabled={busy || data.status === "banned"} onClick={() => handleStatus("banned")} style={{ ...s.btnDanger, flex: 1, padding: 10 }}>Ban</button>
            </div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Payments</div>
            {data.payments.length === 0 ? <p style={{ fontSize: 12, color: C.faint }}>No payments yet.</p> : data.payments.map((p) => (
              <div key={p.order_id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
                <span style={{ color: C.muted }}>{p.order_id}</span>
                <span style={{ fontWeight: 700, color: p.status === "paid" ? C.emerald : C.muted }}>₹{p.amount_inr} · {p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...s.card, marginTop: 20 }}>
        <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Submitted Lists</span></div>
        <div style={s.cardBody}>
          {data.lists.length === 0 ? <p style={{ fontSize: 12, color: C.faint }}>No submissions yet.</p> : data.lists.map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
              <span>Submitted {new Date(l.submitted_at).toLocaleString()}</span>
              <Tag label={l.status} color={l.status === "approved" ? "#16a34a" : "#d97706"} />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
