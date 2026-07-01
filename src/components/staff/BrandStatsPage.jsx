import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { AppLayout } from "../layout/AppLayout";
import { Spinner } from "../ui";
import { getBrandStats } from "../../api";

export default function BrandStatsPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);

  useEffect(() => { getBrandStats().then((d) => setRows(d.brands)); }, []);

  return (
    <AppLayout showCredits={false}>
      <button onClick={() => navigate("/staff/reviews")} style={{ ...s.btnGhost, padding: "6px 14px", fontSize: 12, marginBottom: 16 }}>← Back to queue</button>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 20 }}>Brand Conversion Funnel</h2>

      {!rows ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div>
      ) : (
        <div style={{ ...s.card, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.surfaceHigh, textAlign: "left" }}>
                {["Brand", "Signups", "Paid", "Submitted", "Approved"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.brand_id ?? "direct"} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{r.brand_name}</td>
                  <td style={{ padding: "12px 16px" }}>{r.signups}</td>
                  <td style={{ padding: "12px 16px" }}>{r.paid}</td>
                  <td style={{ padding: "12px 16px" }}>{r.submitted}</td>
                  <td style={{ padding: "12px 16px" }}>{r.approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
