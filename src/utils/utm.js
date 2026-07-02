// Captures utm_source/utm_medium/utm_campaign from the URL once, on first
// landing (an ad could land a visitor on any page, not just "/"), and keeps
// them for the rest of the session — sent along with OTP signup so every
// resulting order can be attributed to a channel (predictor CTA vs ads vs
// WhatsApp). sessionStorage (not localStorage): this is per-visit
// attribution, not a durable profile field.
const KEY = "mspub_utm";

export function captureUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");

  // Only write once per session — don't let a later page view without UTM
  // params (e.g. clicking around the site) erase the original attribution.
  if ((source || medium || campaign) && !sessionStorage.getItem(KEY)) {
    sessionStorage.setItem(KEY, JSON.stringify({
      utm_source: source || "",
      utm_medium: medium || "",
      utm_campaign: campaign || "",
    }));
  }
}

export function getUtmParams() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { utm_source: "", utm_medium: "", utm_campaign: "" };
  } catch {
    return { utm_source: "", utm_medium: "", utm_campaign: "" };
  }
}
