// Carries the student's academic/personal details collected on
// InfoFormPage through /payment to /tool. sessionStorage (not localStorage)
// is intentional — this is scoped to a single funnel run, not a durable
// session artifact.
const KEY = "mspub_pending_form";

export function getPendingForm() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPendingForm(form) {
  sessionStorage.setItem(KEY, JSON.stringify(form));
}

export function clearPendingForm() {
  sessionStorage.removeItem(KEY);
}
