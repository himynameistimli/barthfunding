// Filter-driven calendar feed: /calendar/feed.ics?aud=…&cat=…&focus=…&q=…
//
// The four fixed feeds cover the common cases and stay prerendered. This one
// takes any combination the index can produce, so it cannot be built ahead of
// time — it is the only route in the project rendered on request.
export const prerender = false;

import {
  PROGRAMS, LAST_UPDATED, CAT_LABELS, TYPE_LABELS, FOCUS_LABELS
} from "../../data/programs.mjs";
import { buildEntries, buildICS, audiencesOf, AUD_LABEL } from "../../data/calendar.mjs";
import { SITE_NAME } from "../../data/site.mjs";

const AUD_KEYS = new Set(["researchers", "orgs", "patients"]);

export async function GET({ url }: { url: URL }) {
  const q = url.searchParams;
  const aud = q.get("aud");
  const cat = q.get("cat");
  const type = q.get("type");
  const focus = q.get("focus");
  const text = (q.get("q") || "").trim().toLowerCase();
  const includePast = q.get("past") === "1";

  const terms = text ? text.split(/\s+/).filter(Boolean) : [];

  const selected = PROGRAMS.filter((p: any) => {
    if (p.expired && !includePast) return false;
    if (aud && AUD_KEYS.has(aud) && !audiencesOf(p).includes(aud)) return false;
    if (cat && p.cat !== cat) return false;
    if (type && p.awardType !== type) return false;
    if (focus && !(p.focus || []).includes(focus)) return false;
    if (terms.length) {
      const hay = p.hay;
      if (!terms.every(t => hay.includes(t))) return false;
    }
    return true;
  });

  const entries = buildEntries(selected);

  // Name the calendar after the filters, so several subscriptions stay
  // distinguishable in a calendar app's sidebar.
  const parts: string[] = [];
  if (aud && AUD_LABEL[aud]) parts.push(AUD_LABEL[aud].toLowerCase());
  if (cat && CAT_LABELS[cat]) parts.push(CAT_LABELS[cat].toLowerCase());
  if (type && TYPE_LABELS[type]) parts.push(TYPE_LABELS[type].toLowerCase());
  if (focus && FOCUS_LABELS[focus]) parts.push(FOCUS_LABELS[focus].toLowerCase());
  if (text) parts.push(`“${text}”`);
  const name = parts.length
    ? `Barth funding — ${parts.join(", ")}`
    : "Barth funding deadlines";

  const body = buildICS({
    audience: "filtered",
    entries,
    name,
    description:
      `${entries.length} dated ${entries.length === 1 ? "entry" : "entries"} matching this ` +
      `filter, from the ${SITE_NAME}. Verify every date on the funder's own site.`,
    dtstamp: new Date(`${LAST_UPDATED} 12:00:00 UTC`)
      .toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="barth-funding.ics"',
      // Calendar clients poll often; a short edge cache keeps that cheap
      // without letting a correction sit stale for long.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
