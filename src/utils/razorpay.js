// Standard Razorpay Checkout.js integration — no npm package needed, it
// exposes a global `Razorpay` constructor once the script tag loads.
//
// `callback_url` + `redirect: true` are required, not optional: Razorpay's
// in-page JS `handler` callback only reliably fires for card payments that
// never leave the modal. UPI/netbanking/wallet payments navigate the
// browser away and back, and `handler` is not guaranteed to run for those —
// discovered live (see backend/app/routers/client_payments.py's /callback
// endpoint docstring). Once callback_url is set, Razorpay uses the
// server-redirect flow for ALL payment methods and ignores `handler`
// entirely, so this is the one unified confirmation path rather than two
// parallel ones.

let scriptPromise = null;

export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Opens Razorpay Checkout. Success is NOT reported via a callback here —
 * the browser navigates away to Razorpay and back to our backend's
 * /callback endpoint, which redirects into /payment?rzp_status=success|failed.
 * `onDismiss` only fires for a pre-payment cancel (closing the modal, or a
 * synchronous payment.failed), since those never involve a redirect.
 */
export function openRazorpayCheckout({ order, brandName, prefill, onDismiss }) {
  const rzp = new window.Razorpay({
    key: order.key_id,
    amount: order.amount,
    currency: order.currency,
    order_id: order.order_id,
    name: brandName || "MindzSpark",
    description: "MHT-CET Preference List — 2 lists",
    prefill,
    theme: { color: prefill?.themeColor || "#2563eb" },
    callback_url: `${window.location.origin}/api/client/payments/callback`,
    redirect: true,
    modal: {
      ondismiss: () => onDismiss?.(),
    },
  });
  rzp.on("payment.failed", (resp) => onDismiss?.(resp.error));
  rzp.open();
}
