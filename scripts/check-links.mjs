// Mechanical health check for the funding index.
//
//   node scripts/check-links.mjs           # active programs only
//   node scripts/check-links.mjs --all     # include past programs
//
// Reports: dead links, passed deadlines, and pages whose text contains
// closure language. Exits 1 if anything needs a human look, so it can gate CI.
//
// This catches loud failures only. A page can return 200 while announcing the
// program is discontinued, and only some of those say so in words we can match,
// so a periodic human/agent read of flagged entries is still required.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(resolve(root, "src/data/programs.json"), "utf8"));
const includeAll = process.argv.includes("--all");

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126 Safari/537.36";

// Phrases that suggest a program has stopped, seen in page text.
const CLOSURE = [
  "no longer offered", "no longer offering", "no longer accepting", "discontinued",
  "program has ended", "program has closed", "permanently closed", "is now closed",
  "not accepting applications", "not currently accepting", "applications are closed",
  "suspended", "on hiatus", "paused", "check back", "no longer available"
];

const MONTHS = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";

function latestDeadline(str) {
  if (!str) return null;
  let latest = null;
  const re = new RegExp(`(${MONTHS})[a-z.]*\\s+(\\d{1,2}),?\\s+(\\d{4})`, "g");
  for (const m of String(str).matchAll(re)) {
    const d = new Date(`${m[3]} ${m[1]} ${m[2]}`);
    if (!isNaN(d) && (!latest || d > latest)) latest = d;
  }
  return latest;
}

async function fetchPage(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, {
      redirect: "follow", signal: ctl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" }
    });
    const text = r.headers.get("content-type")?.includes("text/html")
      ? (await r.text()).slice(0, 400000) : "";
    return { status: r.status, text, finalUrl: r.url };
  } catch (e) {
    return { status: 0, error: String(e.cause?.code || e.message).slice(0, 60), text: "" };
  } finally {
    clearTimeout(timer);
  }
}

const stripTags = html => html.replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ").toLowerCase();

const programs = data.programs.filter(p => includeAll || !p.expired);
const deadLinks = [];
const blockedLinks = [];
const closureHits = [];
const passedDeadlines = [];
const now = new Date();

for (const p of programs) {
  const d = latestDeadline(p.deadline);
  if (d && d < now) passedDeadlines.push({ name: p.name, deadline: p.deadline });

  for (const l of p.links || []) {
    const r = await fetchPage(l.url);
    // A WAF answering a non-browser client is not a broken link. Sucuri returns
    // 307, Cloudflare-style protection returns 403/429, and some hosts send 422
    // or 451. TLS failures mean we could not look, not that the page is gone.
    // Keeping these apart matters: mixed in, they bury the real 404s.
    const BLOCKED = [401, 403, 405, 406, 407, 418, 422, 429, 451];
    const isRedirect = r.status >= 300 && r.status < 400;
    const isTlsOrNetwork = r.status === 0;
    if (r.status !== 200) {
      if (BLOCKED.includes(r.status) || isRedirect || isTlsOrNetwork) {
        blockedLinks.push({ name: p.name, url: l.url, status: r.status || r.error });
      } else {
        deadLinks.push({ name: p.name, url: l.url, status: r.status || r.error });
      }
    }
    if (r.text) {
      const body = stripTags(r.text);
      const hits = CLOSURE.filter(c => body.includes(c));
      if (hits.length) closureHits.push({ name: p.name, url: l.url, phrases: hits.slice(0, 3) });
    }
  }
}

const section = (title, rows, fmt) => {
  console.log(`\n## ${title} (${rows.length})`);
  if (!rows.length) console.log("none");
  else rows.forEach(r => console.log("- " + fmt(r)));
};

console.log(`Funding index check — ${programs.length} programs (${data.lastUpdated} data)`);
section("Dead links — page is gone", deadLinks, r => `${r.name}: ${r.url} [${r.status}]`);
section("Could not verify — bot protection, redirect, or TLS (usually fine)", blockedLinks,
  r => `${r.name}: ${r.url} [${r.status}]`);
section("Closure language on page — verify by reading", closureHits,
  r => `${r.name}: ${r.url} — "${r.phrases.join('", "')}"`);
section("Deadline has passed — needs a new cycle or expired:true", passedDeadlines,
  r => `${r.name}: ${r.deadline}`);

const total = deadLinks.length + closureHits.length + passedDeadlines.length;
console.log(`\n${total} item(s) need review` +
  (blockedLinks.length ? `, plus ${blockedLinks.length} unverifiable (not counted).` : "."));
process.exit(total ? 1 : 0);
