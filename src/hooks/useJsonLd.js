import { useEffect } from "react";

// Injects a JSON-LD <script> tag for the current route and removes it on
// unmount, so client-side navigation between pages doesn't leak one page's
// structured data into another. The static blocks in index.html only cover
// the homepage (for crawlers that never execute JS); this covers the SPA's
// other public pages for crawlers that do execute JS.
export function useJsonLd(id, data) {
  useEffect(() => {
    if (!data) return undefined;
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(data);
    return () => tag?.remove();
  }, [id, data]);
}
