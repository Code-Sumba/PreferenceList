import { useEffect, useState } from "react";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { useCredits } from "../../hooks/useCredits";
import { AppLayout } from "../layout/AppLayout";
import { Spinner } from "../ui";
import { ListWorkspace } from "./ListWorkspace";
import { getEngineOptions, getMyReviews, downloadMyReviewFile } from "../../api";
import { getPendingForm } from "../../utils/pendingForm";

export default function ToolPage() {
  const { C, s } = useBrand();
  const { student } = useAuth();
  const { balance, setBalance } = useCredits();

  const [branchNameToId, setBranchNameToId] = useState({});
  const [optsLoaded, setOptsLoaded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const pendingForm = getPendingForm() || {
    student_name: student?.name || "",
    student_email: student?.email || "",
    percentile: "", rank: "", category_label: "OPEN", seat_type: "MH", gender: "Male",
    home_city: "", preferred_cities: [], preferred_branches: [], risk_profile: "balanced", category_codes: [],
  };

  useEffect(() => {
    getEngineOptions()
      .then((data) => {
        const map = {};
        (data.branches || []).forEach((b) => { map[b.name] = b.id; });
        setBranchNameToId(map);
      })
      .finally(() => setOptsLoaded(true));
    loadReviews();
  }, []);

  const loadReviews = () => {
    setReviewsLoading(true);
    getMyReviews().then(setReviews).finally(() => setReviewsLoading(false));
  };

  const onCreditsChange = (newBalance) => setBalance(newBalance);

  return (
    <AppLayout creditsBalance={balance}>
      <div className="fade-in">
        <div style={{ background: C.primaryFaint, border: `1px solid ${C.primary}30`, borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>
            {balance === null ? "Loading credits…" : `Credits remaining: ${balance}`}
          </span>
          {balance === 0 && <span style={{ fontSize: 12, color: C.amber, fontWeight: 700 }}>Both lists used</span>}
        </div>

        {!optsLoaded ? (
          <div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="grid-2-col">
            <ListWorkspace slotLabel="List 1" initialForm={pendingForm} branchNameToId={branchNameToId} credits={balance ?? 0} onCreditsChange={onCreditsChange} />
            <ListWorkspace slotLabel="List 2" initialForm={pendingForm} branchNameToId={branchNameToId} credits={balance ?? 0} onCreditsChange={onCreditsChange} />
          </div>
        )}

        <div style={{ ...s.card, marginTop: 24 }}>
          <div style={s.cardHdr}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Your Submissions</span>
            <button onClick={loadReviews} style={{ ...s.btnGhost, padding: "6px 14px", fontSize: 12 }}>Refresh</button>
          </div>
          <div style={s.cardBody}>
            {reviewsLoading ? (
              <Spinner />
            ) : reviews.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13 }}>Nothing submitted yet — generate a list above and submit it for review.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 14px", background: C.surfaceHigh, borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Submitted {new Date(r.submitted_at).toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: r.status === "approved" ? C.emerald : C.amber, fontWeight: 700, marginTop: 2 }}>
                        {r.status === "approved" ? "Approved" : "Under review"}
                      </div>
                    </div>
                    {r.status === "approved" && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <button onClick={() => downloadMyReviewFile(r.id, "pdf")} style={{ ...s.btnPrimary, padding: "7px 14px", fontSize: 12 }} className="btn-primary">PDF</button>
                        <button onClick={() => downloadMyReviewFile(r.id, "excel")} style={{ ...s.btnGhost, padding: "7px 14px", fontSize: 12 }}>Excel</button>
                      </div>
                    )}
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
