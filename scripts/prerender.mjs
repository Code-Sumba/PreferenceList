// Post-build prerender: writes a per-route copy of dist/index.html for every
// public route, with that route's own <title>, meta description, canonical,
// and Open Graph tags baked into the raw HTML.
//
// Why: this is an SPA behind a catch-all rewrite, so without this every URL
// serves index.html verbatim — including the homepage's canonical tag. To
// Google's first (non-JS) crawl pass, all routes then claim to be duplicates
// of "/", which is exactly the "Duplicate without user-selected canonical"
// failure that keeps the site out of the index. Vercel serves files that
// exist on disk before applying rewrites, so dist/about/index.html wins over
// the catch-all for /about, and React hydrates over it as normal.
//
// Keep titles/descriptions in sync with the useDocumentMeta() calls in
// src/components/pages/*.jsx — the client hook still runs and takes over
// after mount (and owns dynamic bits like the CAP page's "Updated:" suffix).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://collegelist.mindzspark.in";
const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

// Shared footer links block for the no-JS shells — the rendered app's only
// internal links live in the React footer, so without these the raw HTML of
// the whole site contains no crawl paths at all.
const SHELL_LINKS = `
        <nav style="margin-top: 32px; font-size: 14px; line-height: 2;">
          <strong>Explore:</strong>
          <a href="/">Home</a> ·
          <a href="/cap-round-2026">CAP Round 2026 Live Updates</a> ·
          <a href="/how-it-works">How It Works</a> ·
          <a href="/sample-list">Sample List</a> ·
          <a href="/option-form-order-guide">Option Form Order Guide</a> ·
          <a href="/about">About</a> ·
          <a href="/apply">Get Your List</a>
        </nav>`;

const ROUTES = [
  {
    path: "/cap-round-2026",
    title: "MHT-CET CAP Round 2026: Live Updates & All Dates",
    description:
      "MHT-CET CAP Round 2026 live status — registration, document verification, merit list, and option form dates for every CAP round, updated daily.",
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">MHT-CET CAP Round 2026 — Live Updates &amp; All Dates</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Track every MHT-CET CAP 2026 milestone in one place: registration and document verification windows,
          provisional and final merit lists, option form filling dates, and seat allotment results for
          CAP Rounds 1, 2, and 3 — updated daily through the admission season.</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          When option form filling opens, the order you list colleges in decides which seat you get.
          MindzSpark builds a counsellor-reviewed preference list from your percentile and rank for ₹349.</p>`,
  },
  {
    path: "/how-it-works",
    title: "How the MHT-CET Preference List Is Made — Percentile to Counsellor-Approved List | MindzSpark",
    description:
      "See exactly how MindzSpark turns your MHT-CET percentile and rank into a counsellor-reviewed CAP preference list, step by step, in under 6 hours.",
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">How Your MHT-CET Preference List Is Made</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          You enter your CET percentile, rank, category, seat type, and preferred cities and branches.
          Our engine ranks Maharashtra engineering colleges against historical CAP cutoff data, and then a real
          counsellor reviews and adjusts the draft — reordering colleges and correcting anything — before you see it.</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          The counsellor-approved list is ready within 6 hours, downloadable as PDF or Excel from your dashboard.</p>`,
  },
  {
    path: "/sample-list",
    title: "MHT-CET Preference List Sample — What a Counsellor-Reviewed List Looks Like | MindzSpark",
    description:
      "See a real MHT-CET preference list sample built from published 2025 cutoff data — college, branch, and cutoff percentile, the same format every counsellor-reviewed list uses.",
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">MHT-CET Preference List — Sample</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          This sample shows the exact format every MindzSpark preference list uses: colleges in recommended
          option-form order with branch, college code, and last year's closing cutoff percentile for your category —
          built from published 2025 CAP cutoff data.</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Your own list is generated from your exact percentile, rank, and preferences, then reviewed by a counsellor before delivery.</p>`,
  },
  {
    path: "/option-form-order-guide",
    title: "MHT-CET CAP Option Form Order Guide 2026 — Kis Order Mein Bhare | MindzSpark",
    description:
      "Confused about what order to fill your MHT-CET CAP option form in? Here's why order matters, the strategy behind it, and how to avoid losing a seat you were eligible for.",
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">MHT-CET CAP Option Form Order Guide 2026</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          In CAP seat allotment, you get the first college on your option form whose cutoff your merit clears —
          so the order you list colleges in directly decides your seat. A wrong order can cost you a college you
          were actually eligible for.</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          This guide explains the strategy: how many options to fill, how to layer ambitious, realistic, and safe
          choices, and the common ordering mistakes students make in MHT-CET CAP rounds.</p>`,
  },
  {
    path: "/about",
    title: "About MindzSpark — Who Reviews Your MHT-CET Preference List",
    description:
      "MindzSpark's counsellor-reviewed MHT-CET preference list service: who builds and checks your list, and how the review process actually works.",
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">About MindzSpark</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          MindzSpark is an independent MHT-CET counselling service for Maharashtra engineering admissions.
          Every preference list is generated from your percentile, rank, and preferences, then reviewed and
          finalized by a real counsellor before delivery — you never receive a raw algorithm output.</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          MindzSpark is not affiliated with the State CET Cell, Maharashtra, or DTE. Official CAP registration and
          option-form submission happen only on the official CET Cell portal.</p>`,
  },
  {
    path: "/apply",
    title: "Get Your MHT-CET Preference List — Enter Percentile & Rank | MindzSpark",
    description:
      "Enter your MHT-CET percentile, rank, category, and preferred colleges to get a counsellor-reviewed CAP round preference list.",
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">Get Your MHT-CET Preference List</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Enter your MHT-CET percentile, rank, category, seat type, and preferred cities and branches to generate
          your draft preference list. A counsellor reviews and approves it within 6 hours — ₹349 for one
          personalized, counsellor-reviewed CAP round list.</p>`,
  },
  {
    path: "/login",
    title: "Log In | MindzSpark MHT-CET Preference List",
    description:
      "Log in to view your MHT-CET preference list status, download an approved list, or buy more credits.",
    noindex: true,
    shell: `
        <h1 style="font-size: 32px; font-weight: 900; line-height: 1.2;">Log In</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Log in with your email to view your MHT-CET preference list status, download an approved list,
          or buy more credits.</p>`,
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const base = readFileSync(join(distDir, "index.html"), "utf8");

// Add the crawl-path links block to the homepage shell too (the base file
// stays the catch-all fallback, so unknown URLs also get it — harmless).
const homeOut = base.replace(/(<\/main>)/, `${SHELL_LINKS}\n      $1`);
writeFileSync(join(distDir, "index.html"), homeOut);

for (const r of ROUTES) {
  const url = `${ORIGIN}${r.path}`;
  let html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${r.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    // Swap the homepage no-JS shell for this route's own content + links.
    .replace(/<main style="font-family[\s\S]*?<\/main>/, `<main style="font-family: 'Inter', sans-serif; max-width: 780px; margin: 60px auto; padding: 0 24px; color: #111827;">${r.shell}${SHELL_LINKS}\n      </main>`);

  if (r.noindex) {
    html = html.replace(/(<meta name="robots" content=")[^"]*(")/, `$1noindex, follow$2`);
  }

  // The homepage-specific Service + FAQPage JSON-LD must not ship on other
  // routes (FAQPage markup on pages without that visible FAQ violates
  // Google's structured-data rules). Organization stays site-wide; the
  // per-route schema is injected client-side by useJsonLd().
  html = html.replace(
    /<script type="application\/ld\+json">(?:(?!<\/script>)[\s\S])*?"@type": "(?:Service|FAQPage)"(?:(?!<\/script>)[\s\S])*?<\/script>\n?/g,
    ""
  );

  const outDir = join(distDir, ...r.path.split("/").filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerendered ${r.path}${r.noindex ? " (noindex)" : ""}`);
}
