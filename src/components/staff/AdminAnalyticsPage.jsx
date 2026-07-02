import { useEffect, useState } from "react";
import { useBrand } from "../../contexts/BrandContext";
import { AdminLayout } from "./AdminLayout";
import { Spinner } from "../ui";
import { adminGetAnalytics } from "../../api";

function StatCard({ label, value, sub }) {
  const { C, s } = useBrand();
  return (
    <div style={{ ...s.card, margin: 0, padding: 20 }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: C.text, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { C, s } = useBrand();
  const [data, setData] = useState(null);

  useEffect(() => { adminGetAnalytics().then(setData); }, []);

  if (!data) return <AdminLayout><div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div></AdminLayout>;

  const { revenue, credits, lists, growth, channels = [] } = data;

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 20 }}>Analytics</h2>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Revenue</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }} className="grid-4-col">
        <StatCard label="Total Collected" value={`₹${revenue.total_paid_inr.toLocaleString()}`} />
        <StatCard label="Successful Payments" value={revenue.successful_payments} />
        <StatCard label="Failed Payments" value={revenue.failed_payments} />
        <StatCard label="Abandoned (unpaid orders)" value={revenue.abandoned_payments} />
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Credits</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }} className="grid-2-col">
        <StatCard label="Credits Sold" value={credits.sold} />
        <StatCard label="Credits Consumed" value={credits.consumed} />
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Lists</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }} className="grid-4-col">
        <StatCard label="Total Submitted" value={lists.total_submitted} />
        <StatCard label="Pending Review" value={lists.pending_review} />
        <StatCard label="Approved" value={lists.approved} />
        <StatCard label="Avg Turnaround" value={lists.avg_turnaround_hours != null ? `${lists.avg_turnaround_hours}h` : "—"} />
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Growth</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }} className="grid-2-col">
        <StatCard label="Total Signups" value={growth.total_signups} />
        <StatCard label="Signups (Last 30 Days)" value={growth.signups_last_30_days.reduce((a, r) => a + r.count, 0)} sub={`across ${growth.signups_last_30_days.length} active day(s)`} />
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Channels (utm_source)</h3>
      <div style={{ ...s.card, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.surfaceHigh, textAlign: "left" }}>
              {["Source", "Signups", "Paid", "Conversion"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channels.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 16, color: C.muted, textAlign: "center" }}>No signups yet.</td></tr>
            ) : channels.map((c) => (
              <tr key={c.utm_source} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 16px", fontWeight: 600, color: C.text }}>{c.utm_source}</td>
                <td style={{ padding: "10px 16px" }}>{c.signups}</td>
                <td style={{ padding: "10px 16px" }}>{c.paid}</td>
                <td style={{ padding: "10px 16px" }}>{c.signups > 0 ? `${((c.paid / c.signups) * 100).toFixed(1)}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
