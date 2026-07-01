// Staff approval + direct staff creation + per-staff review history.
// Status approval reuses the EXISTING PATCH /admin/employees/{id}/status
// as-is; role assignment, password-setting, staff creation, and the
// lists_reviewed/lists_approved counts are all new (see client_admin.py —
// Student.role is never set anywhere in the pre-existing codebase, so
// there was previously no way to grant staff access at all).
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { AdminLayout } from "./AdminLayout";
import { Spinner, Tag, EmptyState } from "../ui";
import {
  adminListEmployeeCandidates, adminSetEmployeeStatus, adminSetEmployeeRole,
  adminSetEmployeePassword, adminCreateStaff,
} from "../../api";

export default function AdminEmployeesPage() {
  const { C, s } = useBrand();
  const [rows, setRows] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ email: "", name: "", password: "" });
  const [creating, setCreating] = useState(false);

  const load = () => adminListEmployeeCandidates().then(setRows).catch(() => toast.error("Failed to load."));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    try {
      await adminSetEmployeeStatus(id, status);
      toast.success(`Status set to ${status}.`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRole = async (id, role) => {
    setBusyId(id);
    try {
      await adminSetEmployeeRole(id, role);
      toast.success(role === "employee" ? "Granted staff access." : "Revoked staff access.");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSetPassword = async (id, email) => {
    const password = window.prompt(`Set a new password for ${email} (min 6 characters):`);
    if (!password) return;
    setBusyId(id);
    try {
      await adminSetEmployeePassword(id, password);
      toast.success("Password set. Share it with them securely.");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.email.trim() || !newStaff.password) return toast.error("Email and password are required.");
    setCreating(true);
    try {
      await adminCreateStaff(newStaff.email.trim(), newStaff.name.trim(), newStaff.password);
      toast.success("Staff account created — active and ready to log in.");
      setNewStaff({ email: "", name: "", password: "" });
      setShowAddForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to create staff account.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>Staff</h2>
        <button onClick={() => setShowAddForm((v) => !v)} style={{ ...s.btnPrimary, padding: "8px 16px", fontSize: 13 }} className="btn-primary">
          {showAddForm ? "✕ Cancel" : "+ Add Staff"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateStaff} style={{ ...s.card, padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }} className="grid-2-col">
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" value={newStaff.email} onChange={(e) => setNewStaff((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label style={s.label}>Name</label>
            <input style={s.input} value={newStaff.name} onChange={(e) => setNewStaff((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={newStaff.password} onChange={(e) => setNewStaff((f) => ({ ...f, password: e.target.value }))} minLength={6} required />
          </div>
          <button type="submit" disabled={creating} style={{ ...s.btnPrimary, padding: "10px 20px", whiteSpace: "nowrap" }} className="btn-primary">
            {creating ? <Spinner size={16} color="#fff" /> : "Create"}
          </button>
        </form>
      )}

      {!rows ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner size={28} /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon="👤" title="No accounts" subtitle="No self-registered accounts (outside the client payment funnel) yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ ...s.card, margin: 0, padding: "14px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{r.name || r.email}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.email} · joined {new Date(r.created_at).toLocaleDateString()}</div>
                {r.role === "employee" && (
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                    {r.lists_reviewed} list(s) reviewed · {r.lists_approved} approved
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                <Tag label={r.status} color={r.status === "active" ? "#16a34a" : r.status === "banned" ? "#dc2626" : "#d97706"} />
                <Tag label={r.role === "employee" ? "Staff" : "No staff access"} color={r.role === "employee" ? "#2563eb" : "#9ca3af"} />
                {r.status !== "active" && (
                  <button disabled={busyId === r.id} onClick={() => handleStatus(r.id, "active")} style={{ ...s.btnGhost, padding: "6px 12px", fontSize: 12 }}>Approve</button>
                )}
                {r.status !== "banned" && (
                  <button disabled={busyId === r.id} onClick={() => handleStatus(r.id, "banned")} style={{ ...s.btnDanger, padding: "6px 12px", fontSize: 12 }}>Ban</button>
                )}
                {r.role !== "employee" ? (
                  <button disabled={busyId === r.id} onClick={() => handleRole(r.id, "employee")} style={{ ...s.btnPrimary, padding: "6px 12px", fontSize: 12 }} className="btn-primary">Grant Staff Access</button>
                ) : (
                  <button disabled={busyId === r.id} onClick={() => handleRole(r.id, "student")} style={{ ...s.btnGhost, padding: "6px 12px", fontSize: 12 }}>Revoke</button>
                )}
                <button disabled={busyId === r.id} onClick={() => handleSetPassword(r.id, r.email)} style={{ ...s.btnGhost, padding: "6px 12px", fontSize: 12 }}>Set Password</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
