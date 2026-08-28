// Deadline calendar. Flattens every program's `dates[]` into one chronological
// stream, tags each entry with the audiences it serves, and renders iCalendar
// feeds. The page and the .ics feeds both read from here so they cannot drift.
import { PROGRAMS, CAT_LABELS, FOCUS_LABELS } from "./programs.mjs";
import { SITE_URL } from "./site.mjs";

export const AUDIENCES = [
  {
    key: "researchers",
    label: "Researchers",
    blurb:
      "Investigators, postdocs, and trainees applying for research funding — grant deadlines, fellowship cycles, and letters of intent."
  },
  {
    key: "orgs",
    label: "Advocacy organizations",
    blurb:
      "Patient organizations and foundations — capacity grants, conference and education funding, registry and infrastructure programs."
  },
  {
    key: "patients",
    label: "Patients & families",
    blurb:
      "Assistance programs, scholarships, and travel support. Most run rolling, so this list is short by design — the dated entries are the ones with real windows."
  }
];

export const AUD_LABEL = Object.fromEntries(AUDIENCES.map(a => [a.key, a.label]));

// Mirrors the index page's audience filter exactly. A program with no audience
// tag is treated as aimed at researchers, which is the index's default.
export function audiencesOf(p) {
  const tags = p.tags || [];
  const out = [];
  if (tags.includes("for organizations")) out.push("orgs");
  if (tags.includes("for patients")) out.push("patients");
  if (tags.includes("for researchers") || !out.length) out.push("researchers");
  return out;
}

export const KIND_LABEL = {
  deadline: "Deadline",
  loi: "Letter of intent",
  opens: "Opens",
  closes: "Closes",
  decision: "Decision",
  start: "Award start",
  window: "Window"
};

// Entries that are not a thing you submit by — they inform planning but
// missing one costs nothing.
const SOFT_KINDS = new Set(["decision", "start", "opens", "window"]);

export function isSoft(e) {
  return SOFT_KINDS.has(e.kind);
}

/** Every dated entry across all programs, sorted chronologically. */
export function buildEntries() {
  const out = [];
  for (const p of PROGRAMS) {
    for (const dRec of p.dates || []) {
      out.push({
        ...dRec,
        kind: dRec.kind || "deadline",
        precision: dRec.precision || "day",
        program: p.name,
        slug: p.slug,
        sponsor: p.sponsor,
        amount: p.amount,
        bths: p.bths,
        eligibility: p.eligibility,
        apply: p.apply,
        cat: p.cat,
        catLabel: CAT_LABELS[p.cat] || "",
        focus: (p.focus || []).map(f => FOCUS_LABELS[f]).filter(Boolean),
        expired: !!p.expired,
        audiences: audiencesOf(p),
        url: `${SITE_URL}/grants/${p.slug}/`,
        year: Number(dRec.on.slice(0, 4))
      });
    }
  }
  out.sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : a.program.localeCompare(b.program)));
  return out;
}

export const ENTRIES = buildEntries();

export function entriesFor(audience) {
  return audience === "all" ? ENTRIES : ENTRIES.filter(e => e.audiences.includes(audience));
}

/**
 * Open programs for an audience that carry no dated entry — rolling intake or
 * ad hoc. Nothing to diarise, which is itself worth saying: most patient and
 * family assistance works this way.
 */
export function rollingFor(audience) {
  return PROGRAMS.filter(
    p => !p.expired && !(p.dates || []).length && audiencesOf(p).includes(audience)
  );
}

// --- formatting -------------------------------------------------------------
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const MON_SHORT = MONTHS.map(m => m.slice(0, 3));

export function monthKey(iso) {
  return iso.slice(0, 7);
}

export function monthLabel(key) {
  const [y, m] = key.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** "Oct 30, 2026" — or "March 2027" when only the month is known. */
export function formatDate(e) {
  const [y, m, d] = e.on.split("-");
  if (e.precision === "month") return `${MONTHS[Number(m) - 1]} ${y}`;
  return `${MON_SHORT[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export function formatTime(e) {
  if (!e.time || e.precision === "month") return "";
  const [hh, mm] = e.time.split(":").map(Number);
  const suffix = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 || 12;
  const clock = mm ? `${h12}:${String(mm).padStart(2, "0")}` : `${h12}`;
  const zone = e.tz === "local" ? "local time" : TZ_ABBR[e.tz] || e.tz;
  return `${clock} ${suffix} ${zone}`;
}

const TZ_ABBR = {
  "America/New_York": "ET",
  "America/Toronto": "ET",
  "America/Chicago": "CT",
  "America/Los_Angeles": "PT"
};

/** Group an entry list into [{key, label, entries}] by calendar month. */
export function groupByMonth(entries) {
  const map = new Map();
  for (const e of entries) {
    const k = monthKey(e.on);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(e);
  }
  return [...map.entries()].map(([key, es]) => ({ key, label: monthLabel(key), entries: es }));
}

// --- iCalendar --------------------------------------------------------------
// RFC 5545. Content lines are folded at 75 octets and text values escaped;
// otherwise Google Calendar and Outlook reject or mangle the feed.
function escapeText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function fold(line) {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Never split a multi-byte character across a fold boundary.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // continuation lines carry a leading space
  }
  return out.join("\r\n ");
}

function stamp(dateObj) {
  return dateObj.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function tzOffsetMs(ts, tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  }).formatToParts(new Date(ts));
  const v = Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  const asUTC = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour % 24, +v.minute, +v.second);
  return asUTC - ts;
}

/** Wall-clock time in `tz` -> the UTC instant, DST included. */
function zonedToUTC(iso, time, tz) {
  const [y, m, d] = iso.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  let ts = naive;
  for (let i = 0; i < 2; i++) ts = naive - tzOffsetMs(ts, tz);
  return new Date(ts);
}

function plusDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

function describe(e) {
  const lines = [];
  lines.push(e.program);
  lines.push(`Sponsor: ${e.sponsor}`);
  lines.push(`What: ${KIND_LABEL[e.kind] || "Date"} — ${e.label}`);
  lines.push(`When: ${formatDate(e)}${formatTime(e) ? ` at ${formatTime(e)}` : ""}`);
  if (e.status === "projected") {
    lines.push(
      "CONFIDENCE: PROJECTED — this date is inferred from the program's past " +
      "cycles and has not been published by the funder. Treat it as a prompt to " +
      "go check, not as a deadline."
    );
  } else if (e.status === "unconfirmed") {
    lines.push(
      "CONFIDENCE: UNCONFIRMED — this is a real published date, but we have not " +
      "confirmed it against the funder's own page. Check the source before you " +
      "rely on it."
    );
  } else {
    lines.push(`CONFIDENCE: Verified on the funder's own page on ${e.checked} — ${e.source}`);
  }
  if (e.expired) {
    lines.push("STATUS: This program has no currently open call. The date above is a watch-for-reopening prompt.");
  }
  if (e.note) lines.push(`Note: ${e.note}`);
  if (e.bths) lines.push(`Why it is in this index: ${e.bths}`);
  if (e.amount) lines.push(`Award: ${e.amount}`);
  if (e.eligibility) lines.push(`Eligibility: ${e.eligibility}`);
  if (e.apply) lines.push(`How to apply: ${e.apply}`);
  if (e.focus.length) lines.push(`Focus: ${e.focus.join(" · ")}`);
  lines.push(`Audience: ${e.audiences.map(a => AUD_LABEL[a]).join(", ")}`);
  lines.push("");
  lines.push(`Full entry: ${e.url}`);
  lines.push(
    "Always confirm on the funder's own site before relying on any date here. " +
    "Corrections: " + `${SITE_URL}/suggest-update/`
  );
  return lines.join("\n");
}

function alarms(e) {
  // Reminders only for things you act on. Lead times are generous because
  // grant applications need institutional sign-off well before the date.
  if (isSoft(e)) return [];
  const leads = e.precision === "month"
    ? [{ trig: "-P14D", text: "approaching (month only — go check the exact date)" }]
    : [
        { trig: "-P30D", text: "in 30 days" },
        { trig: "-P7D", text: "in 7 days" },
        { trig: "-P1D", text: "tomorrow" }
      ];
  return leads.map(l => [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `TRIGGER:${l.trig}`,
    `DESCRIPTION:${escapeText(`${e.program} — ${e.label} ${l.text}`)}`,
    "END:VALARM"
  ]);
}

function vevent(e, dtstamp) {
  const uid = `${e.slug}-${e.on}-${e.kind}@barthfunding.org`;
  const timed = e.time && e.tz && e.tz !== "local" && e.precision === "day";

  const lines = ["BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${dtstamp}`];

  if (timed) {
    const start = zonedToUTC(e.on, e.time, e.tz);
    lines.push(`DTSTART:${stamp(start)}`);
    lines.push(`DTEND:${stamp(new Date(start.getTime() + 30 * 60000))}`);
  } else {
    // All-day. DTEND is exclusive, so it is the following day.
    lines.push(`DTSTART;VALUE=DATE:${e.on.replace(/-/g, "")}`);
    lines.push(`DTEND;VALUE=DATE:${plusDays(e.on, 1).replace(/-/g, "")}`);
  }

  const mark = e.status === "verified" ? "" : ` (${e.status})`;
  const verb = KIND_LABEL[e.kind] || "Date";
  lines.push(`SUMMARY:${escapeText(`${e.program} — ${verb}${mark}`)}`);
  lines.push(`DESCRIPTION:${escapeText(describe(e))}`);
  lines.push(`URL:${e.url}`);
  lines.push(`CATEGORIES:${escapeText(e.audiences.map(a => AUD_LABEL[a]).join(","))}`);
  // Only a date read off the funder's own page is CONFIRMED; anything we have
  // not checked there is TENTATIVE so a calendar client can show it differently.
  lines.push(`STATUS:${e.status === "verified" ? "CONFIRMED" : "TENTATIVE"}`);
  lines.push("TRANSP:TRANSPARENT");
  for (const a of alarms(e)) lines.push(...a);
  lines.push("END:VEVENT");
  return lines;
}

/**
 * Build an .ics feed. `dtstamp` is derived from the dataset's lastUpdated so a
 * rebuild with unchanged data produces a byte-identical feed.
 */
export function buildICS({ audience = "all", entries, name, description, dtstamp }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Barth Syndrome Research Funding Index//Deadline Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-CALDESC:${escapeText(description)}`,
    "X-WR-TIMEZONE:America/New_York",
    // Ask subscribers to re-poll daily; dates change between our updates.
    "REFRESH-INTERVAL;VALUE=DURATION:P1D",
    "X-PUBLISHED-TTL:P1D",
    `X-WR-RELCALID:barthfunding-${audience}`
  ];
  for (const e of entries) lines.push(...vevent(e, dtstamp));
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
