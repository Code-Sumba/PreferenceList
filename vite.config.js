import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // No IE11/legacy-browser support needed, so target modern evergreen
    // browsers directly and skip esbuild's down-level transforms/polyfills.
    target: "es2020",
  },
  server: {
    port: 5174,
    // Same-origin-via-proxy in dev (mirrors frontend/vite.config.js) so the
    // backend's CORS config never needs to know about this app's origin —
    // and so raw hostname/subdomain never has to be forwarded through a
    // cross-origin request (see BrandContext, which passes the resolved
    // hostname as an explicit query param instead of relying on headers).
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
      "/engine": { target: "http://localhost:8000", changeOrigin: true },
      "/generated_pdfs": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
