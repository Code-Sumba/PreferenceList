import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { AppLayout } from "../layout/AppLayout";
import { Spinner, Tag, EmptyState } from "../ui";
import { listReviews } from "../../api";

export default function ReviewQueuePage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending_review");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listReviews(status).then(setReviews).finally(() => setLoading(false));
  }, [status]);

  return (
    <AppLayout showCredits={false}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Review Queue</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button onClick={() => navigate("/staff/brand-stats")} style={{ ...s.btnGhost, padding: "8px 16px", fontSize: 13 }}>Brand Stats</button>
          <button onClick={() => navigate("/staff/admin")} style={{ ...s.btnGhost, padding: "8px 16px", fontSize: 13 }}>Admin</button>
          {["pending_review", "approved"].map((st) => (
            <button
              key={st} onClick={() => setStatus(st)}
              style={{ ...(status === st ? s.btnPrimary : s.btnGhost), padding: "8px 16px", fontSize: 13 }}
              className={status === st ? "btn-primary" : ""}
            >
              {st === "pending_review" ? "Pending" : "Approved"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div>
      ) : reviews.length === 0 ? (
        <EmptyState icon="📭" title="Nothing here" subtitle={`No ${status === "pending_review" ? "pending" : "approved"} submissions right now.`} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reviews.map((r) => (
            <div
              key={r.id} onClick={() => navigate(`/staff/reviews/${r.id}`)}
              style={{ ...s.card, margin: 0, padding: "16px 20px", cursor: "pointer", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}
              className="hover-card"
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{r.student_name || r.student_email}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {r.total_colleges} colleges · percentile {r.percentile ?? "—"} · submitted {new Date(r.submitted_at).toLocaleString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {r.revision_count > 0 && <Tag label={`Student revision #${r.revision_count}`} color="#d97706" />}
                <Tag label={r.brand_name || "MindzSpark"} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
