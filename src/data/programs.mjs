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
  tools: "Tools & compute"
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
