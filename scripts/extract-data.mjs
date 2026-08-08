// Extracts the PROGRAMS array, AWARD_MAX_USD map, and LAST_UPDATED from
// bsf-funding.html into the Astro site's data module.
// NOTE: styles are NOT extracted — src/styles/site.css is hand-authored
// (the funding-index design) and must not be overwritten from the HTML.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const html = readFileSync("/Users/tim/code/bsf/bsf-funding.html", "utf8");

function sliceBetween(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  if (start === -1) throw new Error("start marker not found: " + startMarker);
  const end = src.indexOf(endMarker, start + startMarker.length);
  if (end === -1) throw new Error("end marker not found: " + endMarker);
  return src.slice(start, end + endMarker.length);
}

const updatedLine = sliceBetween(html, 'const LAST_UPDATED = "', '";');
const awardBlock = sliceBetween(html, "const AWARD_MAX_USD = {", "\n};");
const programsBlock = sliceBetween(html, "const PROGRAMS = [", "\n];");

const dataModule = `// Generated from bsf-funding.html — the single-file page remains the canonical
// data source; re-run scratchpad/extract-data.mjs after editing it.
export ${updatedLine}

export ${awardBlock}

export ${programsBlock}

export const CAT_LABELS = {
  government: "Government",
  nonprofit: "Foundation",
  corporate: "Corporate",
  general: "General"
};

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

for (const p of PROGRAMS) p.slug = slugify(p.name);

const slugs = PROGRAMS.map(p => p.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) throw new Error("Duplicate slugs: " + dupes.join(", "));
`;

mkdirSync("/Users/tim/code/bsf/funding-site/src/data", { recursive: true });
writeFileSync("/Users/tim/code/bsf/funding-site/src/data/programs.mjs", dataModule);

// sanity check: import the module back and report counts
const mod = await import("/Users/tim/code/bsf/funding-site/src/data/programs.mjs");
console.log("programs:", mod.PROGRAMS.length);
console.log("award map entries:", Object.keys(mod.AWARD_MAX_USD).length);
console.log("sample slugs:", mod.PROGRAMS.slice(0, 3).map(p => p.slug));
