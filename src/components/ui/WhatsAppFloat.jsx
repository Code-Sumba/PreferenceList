// Floating WhatsApp button for pre-payment doubts — India's paid-edu
// products sell on WhatsApp trust, so this needs to be reachable from every
// public (pre-login) page, not tucked in a footer.
import { WHATSAPP_IS_CONFIGURED, whatsappChatUrl } from "../../config/whatsapp";

const DEFAULT_MESSAGE = "Hi! I have a question about the MHT-CET preference list.";

export function WhatsAppFloat() {
  const isConfigured = WHATSAPP_IS_CONFIGURED;
  const href = whatsappChatUrl(DEFAULT_MESSAGE);

  return (
    <a
      href={isConfigured ? href : undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!isConfigured) {
          e.preventDefault();
          // eslint-disable-next-line no-console
          console.warn("WhatsAppFloat: set a real WHATSAPP_NUMBER in src/config/whatsapp.js before launch.");
        }
      }}
      title={isConfigured ? "Chat with us on WhatsApp" : "WhatsApp number not configured yet"}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: isConfigured ? "#25D366" : "#9ca3af",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        zIndex: 50,
        cursor: "pointer",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.821.487 3.53 1.338 5.003L2.058 22l5.128-1.267A9.955 9.955 0 0 0 12 22c5.523 0 10-4.478 10-10S17.523 2 12 2zm0 18.062a8.03 8.03 0 0 1-4.086-1.117l-.293-.174-3.043.752.79-2.966-.19-.304A8.03 8.03 0 0 1 3.938 12C3.938 7.55 7.55 3.938 12 3.938S20.062 7.55 20.062 12 16.451 20.062 12 20.062z" />
      </svg>
    </a>
  );
}
