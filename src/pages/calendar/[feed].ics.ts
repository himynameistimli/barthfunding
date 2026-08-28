// Subscribable iCalendar feeds: one per audience plus a combined feed.
//   /calendar/all.ics  /calendar/researchers.ics  /calendar/orgs.ics  /calendar/patients.ics
//
// Note: `astro dev` serves these only at /calendar/<feed>.ics/ (with a trailing
// slash) because trailingSlash is "always" and this is a nested dynamic route.
// The build writes real files at dist/calendar/<feed>.ics, and the host serves
// extension paths without redirecting — same as the existing /sitemap.xml.
import { AUDIENCES, entriesFor, buildICS } from "../../data/calendar.mjs";
import { LAST_UPDATED } from "../../data/programs.mjs";
import { SITE_NAME } from "../../data/site.mjs";

const FEEDS = [
  {
    feed: "all",
    audience: "all",
    name: "Barth syndrome funding deadlines",
    description:
      "Every dated funding deadline, opening, and decision tracked by the Barth Syndrome Research Funding Index."
  },
  ...AUDIENCES.map(a => ({
    feed: a.key,
    audience: a.key,
    name: `Barth syndrome funding deadlines — ${a.label.toLowerCase()}`,
    description: a.blurb
  }))
];

export function getStaticPaths() {
  return FEEDS.map(f => ({ params: { feed: f.feed }, props: f }));
}

// A fixed DTSTAMP tied to the dataset, so rebuilding without a data change
// yields an identical feed rather than churning every subscriber's calendar.
const dtstamp =
  new Date(`${LAST_UPDATED} 12:00:00 UTC`).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function GET({ props }: { props: (typeof FEEDS)[number] }) {
  const entries = entriesFor(props.audience);
  const body = buildICS({
    audience: props.audience,
    entries,
    name: props.name,
    description: `${props.description} Maintained by the ${SITE_NAME}. Verify every date on the funder's own site.`,
    dtstamp
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="barth-funding-${props.feed}.ics"`
    }
  });
}
