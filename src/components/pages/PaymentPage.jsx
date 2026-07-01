import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useBrand } from "../../contexts/BrandContext";
import { useAuth } from "../../hooks/useAuth";
import { AppLayout } from "../layout/AppLayout";
import { Spinner } from "../ui";
import { createOrder } from "../../api";
import { loadRazorpayScript, openRazorpayCheckout } from "../../utils/razorpay";
import { getPendingForm } from "../../utils/pendingForm";

export default function PaymentPage() {
  const { brand, C, s } = useBrand();
  const { student } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paying, setPaying] = useState(false);

  // Falls back to the logged-in student's own profile (name/email) when
  // there's no pendingForm — a RETURNING student logging in via /login to
  // buy more credits never went through /apply in this session, so
  // sessionStorage won't have it. Only a brand-new, never-logged-in visitor
  // genuinely needs to go fill in the info form first.
  const pendingForm = getPendingForm() || (student ? { student_name: student.name, student_email: student.email, mobile: "" } : null);

  // Return trip from Razorpay: the browser was redirected away to complete
  // payment and back to /api/client/payments/callback, which redirects
  // here with this status. Credit balance refresh happens on /tool itself
  // (its useCredits() hook fetches fresh on mount), so we just navigate.
  useEffect(() => {
    const status = searchParams.get("rzp_status");
    if (status === "success") {
      toast.success("Payment successful! You have 2 more credits.");
      navigate("/tool", { replace: true });
    } else if (status === "failed") {
      toast.error("Payment failed. Please try again.");
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!student) return <Navigate to="/login" replace />;
  if (!pendingForm) return <Navigate to="/apply" replace />;

  const handlePay = async () => {
    setPaying(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Could not load payment gateway. Check your connection.");

      const order = await createOrder();
      openRazorpayCheckout({
        order,
        brandName: brand.name,
        prefill: {
          name: pendingForm.student_name,
          email: pendingForm.student_email,
          contact: pendingForm.mobile || undefined,
          themeColor: brand.primary_color,
        },
        onDismiss: () => {
          setPaying(false);
          toast("Payment cancelled.", { icon: "ℹ️" });
        },
      });
      // Intentionally not resetting `paying` on the happy path — the
      // browser is about to navigate away to Razorpay, so leaving the
      // button in its loading state avoids a flash right before that.
    } catch (e) {
      setPaying(false);
      toast.error(e.response?.data?.detail || e.message || "Payment failed. Please try again.");
    }
  };

  return (
    <AppLayout showCredits={false}>
      <div style={{ maxWidth: 420, margin: "40px auto" }} className="fade-in">
        <div style={s.priceCard} className="price-card">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Order Summary</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: C.text, marginTop: 6 }}>₹349</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>2 preference lists · reviewed by our team</div>
          </div>
          <div style={{ background: C.surfaceHigh, borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: C.muted }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 8px", marginBottom: 6 }}>
              <span>Student</span><span style={{ color: C.text, fontWeight: 600, overflowWrap: "anywhere", textAlign: "right" }}>{pendingForm.student_name}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 8px" }}>
              <span>Email</span><span style={{ color: C.text, fontWeight: 600, overflowWrap: "anywhere", textAlign: "right" }}>{pendingForm.student_email}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={paying} style={{ ...s.btnPrimary, width: "100%", padding: 14, fontSize: 15, opacity: paying ? 0.6 : 1 }} className="btn-primary">
            {paying ? <Spinner size={16} color="#fff" /> : "Pay ₹349 & Continue"}
          </button>
          <p style={{ fontSize: 11, color: C.faint, textAlign: "center", marginTop: 12 }}>Secure payment via Razorpay</p>
        </div>
      </div>
    </AppLayout>
  );
}
