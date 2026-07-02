// Fires the purchase/conversion event to GA4 + Meta Pixel once payment
// succeeds. Base tracking scripts (with placeholder IDs — see index.html's
// TODO comments) load globally; this is the one event that actually needs
// code, not just a script tag, since it carries the real order value.
export function trackPurchase({ orderId, amountInr }) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", {
        transaction_id: orderId,
        value: amountInr,
        currency: "INR",
        items: [{ item_name: "MHT-CET Preference List (2 lists)", price: amountInr, quantity: 1 }],
      });
    }
  } catch { /* tracking must never break the actual payment flow */ }

  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Purchase", { value: amountInr, currency: "INR" });
    }
  } catch { /* same — swallow, don't let a blocked/missing pixel break navigation */ }
}
