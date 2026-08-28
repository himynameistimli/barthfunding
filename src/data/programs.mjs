// Program data lives in programs.json — that file is the single source of truth.
// This module loads it, derives slugs, and validates them.
// To change program data, edit programs.json.
import data from "./programs.json";

export const LAST_UPDATED = data.lastUpdated;
export const AWARD_MAX_USD = data.awardMaxUSD;
export const PROGRAMS = data.programs;

export const CAT_LABELS = {
  government: "Government",
  nonprofit: "Foundation",
  corporate: "Corporate",
  general: "General"
};

export const TYPE_LABELS = {
  cash: "Cash grant",
  "in-kind": "In-kind support",
  access: "Data & infrastructure",
  incentive: "Regulatory incentive",
  partnership: "Partnership route"
};

export const FOCUS_LABELS = {
  basic: "Basic science",
  preclinical: "Preclinical & therapeutics",
  clinical: "Clinical research",
  "natural-history": "Registries & biomarkers",
  training: "Training & careers",
  capacity: "Org capacity",
  tools: "Tools & compute",
  "patient-support": "Patient & family support"
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

const badType = PROGRAMS.filter(p => !TYPE_LABELS[p.awardType]).map(p => p.name);
if (badType.length) throw new Error("Missing/invalid awardType: " + badType.join(", "));
const badFocus = PROGRAMS.filter(p => !Array.isArray(p.focus) || !p.focus.length || p.focus.some(f => !FOCUS_LABELS[f])).map(p => p.name);
if (badFocus.length) throw new Error("Missing/invalid focus: " + badFocus.join(", "));

// Award-max keys are matched by program name; a typo would silently show "—".
const unknown = Object.keys(AWARD_MAX_USD).filter(n => !PROGRAMS.some(p => p.name === n));
if (unknown.length) throw new Error("awardMaxUSD keys with no matching program: " + unknown.join(", "));

// Optional `dates[]` drives the calendar and the .ics feeds. A malformed date
// would silently drop an event or land it on the wrong day, so fail the build.
const DATE_KINDS = new Set(["deadline", "loi", "opens", "closes", "decision", "start", "window"]);
for (const p of PROGRAMS) {
  if (p.dates === undefined) continue;
  if (!Array.isArray(p.dates)) throw new Error(`dates must be an array on: ${p.name}`);
  for (const d of p.dates) {
    const where = `${p.name} (${d.on})`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.on || "")) throw new Error(`Bad or missing date "on" in ${where}`);
    if (new Date(`${d.on}T00:00:00Z`).toISOString().slice(0, 10) !== d.on) {
      throw new Error(`Date does not exist: ${where}`);
    }
    if (!d.label) throw new Error(`Missing date label in ${where}`);
    if (d.kind !== undefined && !DATE_KINDS.has(d.kind)) throw new Error(`Bad date kind "${d.kind}" in ${where}`);
    if (!["verified", "projected"].includes(d.status)) throw new Error(`Bad date status "${d.status}" in ${where}`);
    if (d.status === "verified" && !d.checked) throw new Error(`Verified date needs a "checked" date: ${where}`);
    if (d.precision !== undefined && !["day", "month"].includes(d.precision)) {
      throw new Error(`Bad date precision "${d.precision}" in ${where}`);
    }
    if (d.time !== undefined) {
      if (!/^\d{2}:\d{2}$/.test(d.time)) throw new Error(`Bad time "${d.time}" in ${where}`);
      if (!d.tz) throw new Error(`Time given without a tz in ${where}`);
    }
  }
}
