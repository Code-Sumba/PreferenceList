import { useEffect } from "react";

const ORIGIN = "https://collegelist.mindzspark.in";

// Updates the tab title + meta description + canonical URL per route. This
// is an SPA (client-rendered), so this only helps once JS has run — it
// doesn't replace the static SEO content in index.html for crawlers that
// don't execute JS, but Google's crawler does execute JS in most cases, and
// this also matters for social-share previews on client-side navigation
// and general UX (accurate tab titles).
//
// `path` must be the route's own path (e.g. "/about"). Without it, every
// route reuses index.html's static canonical (the homepage), which tells
// Google those pages are duplicates of "/" and to fold them into it instead
// of indexing them separately — this is what self-canonicalizing here fixes.
export function useDocumentMeta(title, description, path) {
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
    if (path) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${ORIGIN}${path}`);
    }
  }, [title, description, path]);
}
