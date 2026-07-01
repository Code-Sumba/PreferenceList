import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTheme, DEFAULT_BRAND } from "../utils/theme";
import { getBrandTheme } from "../api";

const BrandContext = createContext(null);

function slugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || "";
}

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(null); // null = not resolved yet, DEFAULT_BRAND shape once resolved
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Subdomain is the real mechanism in production; ?ref= is kept only
        // as a secondary fallback for local testing / plain shared links.
        const resolved = await getBrandTheme(window.location.hostname + (window.location.port ? `:${window.location.port}` : ""), slugFromQuery());
        if (!cancelled) setBrand(resolved || DEFAULT_BRAND);
      } catch {
        if (!cancelled) setBrand(DEFAULT_BRAND);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const theme = useMemo(() => getTheme(brand), [brand]);

  return (
    <BrandContext.Provider value={{ ...theme, loading, brandSlug: brand?.slug || "" }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}
