// Self-service dashboard for returning students — profile, credit balance,
// payment history, and submission status/downloads, all in one place.
// Reuses the exact same data-fetching functions ToolPage already uses
// (useCredits, getMyReviews, downloadMyReviewFile) plus one new endpoint
// (getMyPayments) for payment history.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { useCredits } from "../../hooks/useCredits";
import { AppLayout } from "../layout/AppLayout";
import { Spinner } from "../ui";
import { DashboardListRow } from "./DashboardListRow";
import { getMyReviews, getMyPayments } from "../../api";

export default function DashboardPage() {
  const { C, s } = useBrand();
  const { student } = useAuth();
  const { balance } = useCredits();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState(null);
  const [payments, setPayments] = useState(null);

  const loadReviews = () => getMyReviews().then(setReviews);

  useEffect(() => {
    loadReviews();
    getMyPayments().then(setPayments);
  }, []);

  return (
    <AppLayout creditsBalance={balance}>
      <div className="fade-in">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }} className="header-row">
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, overflowWrap: "anywhere" }}>Hi, {student?.name || student?.email}</h2>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4, overflowWrap: "anywhere" }}>{student?.email}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }} className="header-row-actions">
            {balance > 0 && (
              <button onClick={() => navigate("/tool")} style={{ ...s.btnPrimary, padding: "10px 20px" }} className="btn-primary">Generate a List</button>
            )}
            <button onClick={() => navigate("/payment")} style={{ ...s.btnGhost, padding: "10px 20px" }}>Buy More Credits</button>
          </div>
        </div>

        <div style={{ ...s.card, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Credits Remaining</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.text, marginTop: 4 }}>{balance ?? "—"}</div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Your Lists</span></div>
          <div style={s.cardBody}>
            {!reviews ? (
              <Spinner />
            ) : reviews.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13 }}>Nothing submitted yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {reviews.map((r) => (
                  <DashboardListRow key={r.id} review={r} onChanged={loadReviews} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ ...s.card, marginTop: 24 }}>
          <div style={s.cardHdr}><span style={{ fontWeight: 700, fontSize: 15 }}>Payment History</span></div>
          <div style={s.cardBody}>
            {!payments ? (
              <Spinner />
            ) : payments.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13 }}>No payments yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {payments.map((p) => (
                  <div key={p.order_id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderTop: `1px solid ${C.border}` }}>
                    <span style={{ color: C.muted }}>{new Date(p.created_at).toLocaleString()}</span>
                    <span style={{ fontWeight: 700, color: p.status === "paid" ? C.emerald : C.muted }}>₹{p.amount_inr} · {p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
