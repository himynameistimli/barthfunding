import { PROGRAMS, LAST_UPDATED, CAT_LABELS, TYPE_LABELS } from "../data/programs.mjs";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "../data/site.mjs";

export function GET() {
  const active = PROGRAMS.filter((p: any) => !p.expired);
  const past = PROGRAMS.filter((p: any) => p.expired);

  const line = (p: any) =>
    `- [${p.name}](${SITE_URL}/grants/${p.slug}/): ${TYPE_LABELS[p.awardType]} from ${p.sponsor} (${CAT_LABELS[p.cat]}). ${p.amount || ""}`.trimEnd();

  const body = `# ${SITE_NAME}

> A maintained index of ${PROGRAMS.length} funding programs open to researchers and advocacy
> organizations working on Barth syndrome (BTHS), a rare X-linked mitochondrial disease
> caused by TAFAZZIN mutations. Covers government, foundation, corporate, and general
> biomedical sources. Last updated ${LAST_UPDATED}. Award amounts and deadlines change;
> confirm on each funder's site before applying. Corrections: ${CONTACT_EMAIL}.

## Pages

- [Funding index](${SITE_URL}/): searchable, sortable table of all programs with facets for funder, audience, award type, research focus, and status
- [Deadline calendar](${SITE_URL}/calendar/): every dated deadline, opening, and decision in chronological order, split by audience, with subscribable iCalendar feeds
- [What is Barth syndrome](${SITE_URL}/what-is-barth-syndrome/): the disease, how it presents, and how it is diagnosed
- [Therapy progress](${SITE_URL}/therapies/): every current and emerging BTHS therapy by mechanism, effect on the cardiolipin defect, delivery route, and development stage
- [Suggest an update](${SITE_URL}/suggest-update/): how to report corrections or missing programs

Each program has a permanent page at ${SITE_URL}/grants/<slug>/ with award details,
eligibility, application steps, and links.

## Calendar feeds (iCalendar / .ics)

Subscribable feeds of every dated deadline. Each event carries the award amount,
eligibility, how to apply, whether the date is verified or projected, and reminders
at 30, 7, and 1 day before.

- ${SITE_URL}/calendar/all.ics: every dated entry
- ${SITE_URL}/calendar/researchers.ics: investigator and trainee funding deadlines
- ${SITE_URL}/calendar/orgs.ics: advocacy-organization deadlines
- ${SITE_URL}/calendar/patients.ics: patient and family assistance windows

## Active programs (${active.length})

${active.map(line).join("\n")}

## Past programs (${past.length})

Application windows closed with no confirmed reopening; kept for reference.

${past.map(line).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
