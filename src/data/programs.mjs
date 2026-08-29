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

// Audience is derived once, here, and read everywhere else. It used to be
// re-implemented per page, which is how the index and the calendar could have
// silently disagreed about who a program is for.
export const AUDIENCE_KEYS = ["researchers", "orgs", "patients"];
for (const p of PROGRAMS) {
  const tags = p.tags || [];
  const out = [];
  if (tags.includes("for organizations")) out.push("orgs");
  if (tags.includes("for patients")) out.push("patients");
  if (tags.includes("for researchers") || !out.length) out.push("researchers");
  p.auds = out;
}

// Everything the search box looks at, lowercased once at build time.
for (const p of PROGRAMS) {
  p.hay = [
    p.name, p.sponsor, p.desc, p.bths, p.eligibility, p.apply, p.amount, p.deadline,
    (p.tags || []).join(" "),
    CAT_LABELS[p.cat] || "",
    TYPE_LABELS[p.awardType] || "",
    (p.focus || []).map(f => FOCUS_LABELS[f]).join(" ")
  ].join(" ").toLowerCase();
}

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

// `desc` describes the program on its own terms; `bths` carries the Barth
// relevance. Keeping them apart stops a general mechanism from reading as
// though it were created for BTHS, and lets `desc` alone feed meta
// descriptions and search snippets.
const noBths = PROGRAMS.filter(p => !p.bths || !p.bths.trim()).map(p => p.name);
if (noBths.length) throw new Error("Missing bths relevance note: " + noBths.join(", "));

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
    if (!["verified", "unconfirmed", "projected"].includes(d.status)) {
      throw new Error(`Bad date status "${d.status}" in ${where}`);
    }
    // "Verified" is a claim about provenance that ships to subscribers in the
    // .ics, so it has to be backed by the page it was read off.
    if (d.status === "verified" && !(d.checked && d.source)) {
      throw new Error(`Verified date needs both "checked" and "source": ${where}`);
    }
    if (d.status !== "verified" && d.checked) {
      throw new Error(`Only verified dates may carry "checked": ${where}`);
    }
    if (d.precision !== undefined && !["day", "month"].includes(d.precision)) {
      throw new Error(`Bad date precision "${d.precision}" in ${where}`);
    }
    if (d.time !== undefined) {
      if (!/^\d{2}:\d{2}$/.test(d.time)) throw new Error(`Bad time "${d.time}" in ${where}`);
      if (!d.tz) throw new Error(`Time given without a tz in ${where}`);
    }
  }
}
