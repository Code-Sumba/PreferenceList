import { useEffect } from "react";

// Updates the tab title + meta description per route. This is an SPA
// (client-rendered), so this only helps once JS has run — it doesn't
// replace the static SEO content in index.html for crawlers that don't
// execute JS, but Google's crawler does execute JS in most cases, and
// this also matters for social-share previews on client-side navigation
// and general UX (accurate tab titles).
export function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
