// Single source of truth for the WhatsApp Business number, shared by
// WhatsAppFloat, the exit-intent popup, and anywhere else that needs it.
export const WHATSAPP_NUMBER = "917397901889";
export const WHATSAPP_IS_CONFIGURED = !WHATSAPP_NUMBER.includes("X");

export function whatsappChatUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Share-intent link (no business number needed — opens the SHARER's own
// WhatsApp with a pre-filled message so they can pick who to send it to).
export function whatsappShareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
