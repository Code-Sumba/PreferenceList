import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "../../contexts/BrandContext";
import { AdminLayout } from "./AdminLayout";
import { Spinner, EmptyState } from "../ui";
import { adminListStudents } from "../../api";

export default function AdminStudentsPage() {
  const { C, s } = useBrand();
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);
  const [search, setSearch] = useState("");

  const load = (q) => adminListStudents(q).then(setRows);
  useEffect(() => { load(""); }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Client Students</h2>
        <input style={{ ...s.input, width: 260 }} placeholder="Search by email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!rows ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon="🧑‍🎓" title="No students found" subtitle="No client-app students match this search." />
      ) : (
        <div style={{ ...s.card, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.surfaceHigh, textAlign: "left" }}>
                {["Email", "Status", "Credits", "Total Paid", "Submitted", "Approved"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} onClick={() => navigate(`/staff/admin/students/${encodeURIComponent(r.email)}`)} style={{ borderTop: `1px solid ${C.border}`, cursor: "pointer" }} className="hover-card">
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{r.name || r.email}<div style={{ fontSize: 11, color: C.faint }}>{r.email}</div></td>
                  <td style={{ padding: "12px 16px" }}>{r.status}</td>
                  <td style={{ padding: "12px 16px" }}>{r.credits_balance}</td>
                  <td style={{ padding: "12px 16px" }}>₹{r.total_paid_inr}</td>
                  <td style={{ padding: "12px 16px" }}>{r.lists_submitted}</td>
                  <td style={{ padding: "12px 16px" }}>{r.lists_approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
