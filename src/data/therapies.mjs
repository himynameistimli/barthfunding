// Therapy landscape, from barth-therapy-comparison.pdf (August 2026 comparative review).
// stage scale: 0 concept · 1 preclinical · 2 phase 1 · 3 phase 2/3 · 4 approved / in use
export const STAGE_LABELS = ["Concept", "Preclinical", "Phase 1", "Phase 2/3", "Approved"];

export const THERAPIES = [
  {
    slug: "supportive-care",
    name: "Standard & supportive care",
    family: "care",
    tagline: "The foundation of care today — not a cure, but what keeps children stable and well.",
    how: "Manages heart failure, neutropenia, nutrition",
    route: "Varies",
    cl: "none", mlcl: "none", atp: "na",
    stage: 4,
    stageNote: "Standard of care, in use everywhere",
    leads: "Not a lab but a clinical network. The main Barth-specific centers are Hilary Vernon (Johns Hopkins, Director of the Mitochondrial Medicine Center) and Barry Byrne (University of Florida). The Barth Syndrome Foundation's Scientific & Medical Advisory Board coordinates guidance across them.",
    mechanism: "Doesn't touch cardiolipin. Treats the downstream problems: heart-failure medications (ACE inhibitors, beta-blockers) for the cardiomyopathy, G-CSF and infection vigilance for neutropenia, nutritional and growth support, physical therapy, and — in the most severe cardiac cases — heart transplant.",
    onLipid: "No change — it manages consequences, not the lipid.",
    onAtp: "No direct effect; supports the tissues that are energy-starved.",
    takeaway: "Everything else is layered on top of this. Even the newly approved drug — and any future disease-modifying therapy — sits alongside good cardiac and immune management, it doesn't replace it."
  },
  {
    slug: "elamipretide",
    name: "Elamipretide / Forzinity (SS-31)",
    family: "compensatory",
    badge: "APPROVED",
    tagline: "The first-ever approved Barth drug — a cardiolipin-binding peptide.",
    how: "Binds cardiolipin; stabilizes cristae & supercomplexes",
    route: "Injection (SC)",
    cl: "none", mlcl: "none", atp: "up",
    stage: 4,
    stageNote: "Approved (accelerated pathway) — available now for eligible patients",
    leads: "Stealth BioTherapeutics (the sponsor). The peptide chemistry traces to Hazel Szeto and Peter Schiller — the “SS” in SS-31 is their initials. The pivotal TAZPOWER trial was designed and run by Hilary Vernon at Johns Hopkins.",
    mechanism: "A small peptide that concentrates in the inner mitochondrial membrane and physically binds the (malformed) cardiolipin already there, stabilizing membrane curvature and holding the respiratory-chain supercomplexes together. Better-organized machinery means more ATP.",
    onLipid: "Unchanged. In tafazzin-knockdown hearts it improved respiration without shifting total cardiolipin or the MLCL:CL ratio. It makes the bad lipid work better; it doesn't fix it — a textbook compensatory drug.",
    onAtp: "Improves — via supercomplex stabilization.",
    routeDetail: "Daily subcutaneous injection (40 mg). Most common side effect is injection-site reactions.",
    approval: "FDA accelerated approval, Sept 19, 2025 (brand Forzinity, Stealth BioTherapeutics), for patients ≥30 kg. Based on TAZPOWER (NCT03098797) plus its long open-label extension.",
    takeaway: "Three things sit together. Elamipretide exists and is prescribable, which is a first for this disease. But it cleared on accelerated approval against a surrogate endpoint — improvement in knee-extensor muscle strength, an intermediate measure rather than a hard clinical outcome — and the evidence path was uneven: the blinded 12-week portion of TAZPOWER did not cleanly meet its primary endpoint, and the benefit emerged in open-label follow-up. Confirmatory evidence is still owed. The label also excludes children under 30 kg; Stealth has said it intends to pursue expanded access for lighter children and generate more data."
  },
  {
    slug: "ma-5",
    name: "MA-5 (Mitochonic Acid 5)",
    family: "compensatory",
    tagline: "An oral mitochondria-homing molecule — same goal as elamipretide, different target and delivery.",
    how: "Binds mitofilin; boosts ATP-synthase assembly",
    route: "Oral (pill)",
    cl: "none", mlcl: "none", atp: "up",
    stage: 2,
    stageNote: "Phase 1 safety done in healthy adults (Japan); Abe's group says it is preparing a Phase 2 trial",
    leads: "Takaaki Abe and Takafumi Toyohara at Tohoku University Graduate School of Medicine, Japan; Yoshiyasu Tongu first-authored the 2025 Barth paper. Abe's group developed MA-5 originally.",
    mechanism: "Derived from a natural plant compound; homes to mitochondria, interacts with mitofilin (part of the cristae-shaping MICOS complex) and promotes ATP-synthase assembling into its efficient oligomers. Result: more ATP without burning more oxygen — which also lowers oxidative stress.",
    onLipid: "Unchanged — like elamipretide, it's an efficiency booster, not a lipid fix.",
    onAtp: "Improves. In Barth iPSC cells and fruit flies: better mitochondrial structure, higher ATP, less cell stress, and improved heart function plus climbing (muscle) in flies.",
    routeDetail: "Oral — a meaningful practical advantage over injected elamipretide.",
    takeaway: "A real pill that has cleared an initial human-safety bar, and the Tohoku group has said publicly that it is preparing to start Phase 2 — which would make it the second Barth-specific drug to reach patients. The Barth evidence underneath it is still cells and flies, so a Phase 2 would be testing a hypothesis that has never been through a mammal."
  },
  {
    slug: "nr-nad-boosting",
    name: "NR / NAD⁺ boosting",
    family: "compensatory",
    tagline: "Nicotinamide riboside — raise the cell's NAD⁺ to restart mitochondrial quality control.",
    how: "Raises NAD⁺ → stimulates mitophagy & biogenesis",
    route: "Oral (supplement)",
    cl: "none", mlcl: "none", atp: "up",
    stage: 1,
    stageNote: "Preclinical in Barth models; NR itself is trialed/available for other conditions",
    leads: "No single lab owns “NR for Barth” — it's an inference from two lines of work. The mitophagy defect was established by Yuguang Shi's lab at the Barshop Institute, UT Health San Antonio (first author Jun Zhang). Riekelt Houtkooper (Amsterdam UMC) works on NAD⁺ and mitochondrial metabolism and holds a current BSF grant. NR itself is sold by supplement companies, not developed for Barth by anyone.",
    mechanism: "NR is a vitamin-B3 precursor to NAD⁺, a central metabolic coenzyme that falls in many failing and mitochondrial hearts. Raising NAD⁺ activates sirtuins → PGC-1α (the master switch for building new mitochondria) and revs up mitophagy (clearing damaged mitochondria). In Barth models, restoring this quality-control cycle improved cardiac function — though the Shi lab did that with rapamycin, not with NR.",
    onLipid: "Unchanged. It works entirely downstream — it doesn't repair cardiolipin; it improves the turnover and replacement of the mitochondria that contain it.",
    onAtp: "Improves — through more, healthier mitochondria (biogenesis) and better cleanup (mitophagy).",
    routeDetail: "Oral — sold as a nutritional supplement, with a good human safety record from trials in other conditions. Unusually accessible relative to experimental drugs.",
    takeaway: "NR targets the mitophagy defect directly, and because it sells as a supplement the accessibility gap is unusually small. Against that: Barth-specific human evidence is lacking, “available supplement” is not “proven for Barth,” and using NR to get there is an inference from NAD⁺ biology rather than something demonstrated in a Barth mammal."
  },
  {
    slug: "abhd18-inhibition",
    name: "ABHD18 inhibition",
    family: "root-cause",
    tagline: "The genetic-suppressor approach — fix the lipid by removing the enzyme that destroys it. No working TAZ required.",
    how: "Blocks CL-degrading enzyme → preserves nascent CL, cuts MLCL",
    route: "Oral / oligo (envisioned)",
    cl: "up", mlcl: "corrects", atp: "up",
    stage: 1,
    stageNote: "Preclinical proof-of-concept (cells + mice); target validated and patented; drug discovery funded, no molecule yet",
    leads: "Jason Moffat (University of Toronto) with Vincent Blomen and Sebastian Nijman (Scenic Biotech, Netherlands), drawing on the Brummelkamp genetic-screening approach, plus Charles Boone (Toronto), Chad Myers (Minnesota) and Ian Scott (SickKids). Moffat currently holds a Barth Syndrome Foundation grant on TAZ genetic interactions.",
    mechanism: "ABHD18 is the enzyme that deacylates nascent cardiolipin into MLCL (and degrades it further). Block ABHD18 and you never generate the toxic MLCL in the first place — nascent cardiolipin is preserved instead. And nascent (unremodeled) CL is functional enough to support the ATP machinery, so you bypass the need for TAZ entirely.",
    onLipid: "Corrects both: cardiolipin rises, MLCL falls, the diagnostic ratio moves toward normal, and respiratory-chain assembly is restored.",
    onAtp: "Improves — at the source, by rebuilding the machinery correctly rather than propping it up. Rescued survival in Barth mice.",
    routeDetail: "Envisioned as an oral pill (ABHD18 is a serine hydrolase — an unusually druggable enzyme class), or as an siRNA/ASO that lowers the enzyme (this is where a muscle-homing conjugate would matter).",
    takeaway: "Mechanistically the most elegant option in the pipeline — it corrects the actual lipid defect and rescued survival in Barth mice — but there is no drug molecule yet. What exists is a validated target, a patent, and funded discovery work in the Moffat and Blomen labs. Years, not months. The druggable enzyme class is the reason for optimism."
  },
  {
    slug: "gene-therapy-taz-replacement",
    name: "Gene therapy (TAZ replacement)",
    family: "root-cause",
    tagline: "The most literal fix — give the body a working copy of the gene.",
    how: "Delivers a working TAZ gene → restores tafazzin",
    route: "One-time infusion",
    cl: "restores", mlcl: "normalizes", atp: "up",
    stage: 1.6,
    stageNote: "Late preclinical — optimized vector characterized in mice, heading into pre-IND and large-animal toxicity testing. No human trial yet.",
    leads: "William (Bill) Pu, Boston Children's Hospital / Harvard — the TAZ-02 program. In parallel, Barry Byrne and Christina Pacak (University of Florida) ran the other major AAV-TAZ effort. Pu also sits on the BSF Scientific & Medical Advisory Board.",
    mechanism: "Deliver a functional TAZ gene (packaged in an AAV viral vector) so cells make real tafazzin again and remodel cardiolipin normally. The gene is tiny (under 1 kb) and fits an AAV easily — so, unlike Duchenne, Barth's challenge was never fitting the gene. It's delivery: reaching heart and skeletal muscle at once, and durability over a lifetime.",
    evidence: "Bill Pu's lab (Circulation Research 2020) showed an AAV9-TAZ vector prevented and reversed cardiomyopathy in TAZ-knockout mice. Two other groups — Byrne & Pacak at the University of Florida, and a separate Duke/Minnesota/WashU effort — did parallel AAV-TAZ work. The payload clearly works in mice; the 2020 vector's weakness was skeletal muscle and dose.",
    onLipid: "Fully corrects — restores normal remodeling, so mature cardiolipin returns and MLCL normalizes. Confirmed in quadriceps for TAZ-02: cardiolipin back to wild-type levels, MLCL down, MLCL:CL ratio corrected.",
    onAtp: "Improves at the source.",
    routeDetail: "Potentially a one-time infusion. Limits seen with the 2020 vector: needed roughly 70% of heart cells transduced for durable benefit; skeletal-muscle levels declined over time; no re-dosing once neutralizing antibodies form.",
    unpublished: true,
    taz02: {
      note: "Source: conference presentation, 2026 Barth Syndrome Foundation International Scientific, Medical & Family Conference (July 19–26, 2026, Bonita Springs, FL). Not peer-reviewed.",
      rows: [
        ["Capsid", "AAV9", "A myotropic capsid designated C4"],
        ["Transgene", "TAZ, full length", "TAZΔ5 — the predominant human isoform — codon-optimized (PCTZO)"],
        ["Promoter", "Desmin / CAG", "Pr1, a strong striated-muscle-specific promoter"],
        ["Genome", "Single-stranded", "Self-complementary (scITR), with an HBB2 intron — faster, stronger onset"],
        ["Skeletal muscle", "Low transduction, low efficacy", "Efficient delivery and functional rescue"],
        ["Dose", "1–2 × 10¹³ vg/kg", "3 × 10¹² vg/kg — a 6.7-fold reduction"]
      ],
      results: "Tested in the cardiac-and-skeletal-muscle knockout (mKO) mouse Pu's lab published in 2025. Safety: maximum tolerated dose 3 × 10¹³ vg/kg against a minimum effective dose of 3 × 10¹² — a roughly ten-fold therapeutic window; histology across heart, quadriceps, liver, kidney, lung, spleen, brain, spinal cord and gut was normal-to-mild, and serum markers (troponin, CK, ALT, AST, BUN, creatinine, glucose) were mostly unchanged. Efficacy: normalized mitochondrial morphology in heart and quadriceps, and corrected the cardiolipin profile in skeletal muscle. Cardiolipin data credited to Seul Kee Byeon.",
      nextSteps: "As stated on the slide: a pre-IND meeting with the FDA, and large-animal toxicity testing. That is the standard runway into a first-in-human trial."
    },
    takeaway: "The furthest-along root-cause program. The long-standing bottleneck was the capsid, addressed in-house with C4 rather than by licensing an outside capsid. The TAZ-02 dose and safety figures come from a conference presentation rather than peer review and may shift. A pre-IND meeting opens the regulatory process; large-animal toxicity testing alone typically runs a year or more before a first patient is dosed."
  },
  {
    slug: "gene-correction-base-editing",
    name: "Gene correction / base editing",
    family: "root-cause",
    tagline: "Instead of adding a spare gene copy, rewrite the original typo so the native gene works.",
    how: "Rewrites the DNA typo in place → the native gene works",
    route: "LNP or viral",
    cl: "restores", mlcl: "normalizes", atp: "up",
    stage: 0.5,
    stageNote: "Concept / early preclinical for Barth (the tools are advancing fast in other diseases)",
    leads: "Nobody, for Barth specifically — this is the one entry with no named program. The relevant precedent is the bespoke base editor built for an infant with CPS1 deficiency by Rebecca Ahrens-Nicklas (CHOP) and Kiran Musunuru (Penn), which BSF has flagged for families as the template. The underlying chemistry comes from David Liu's lab at the Broad Institute.",
    mechanism: "A base editor (a guided enzyme, delivered as mRNA plus a guide RNA, often in a lipid nanoparticle) changes a single mis-spelled DNA letter back to the correct one — repairing the patient's own TAZ gene in place. No foreign gene copy left behind.",
    onLipid: "Corrects — the native gene is restored, so remodeling resumes.",
    onAtp: "Improves at the source.",
    routeDetail: "LNP infusion (transient — the editor does its job and clears) or a viral vector. Mutation-specific: each family's exact TAZ variant needs its own guide.",
    takeaway: "Conceptually the cleanest cure — fix the original, leave nothing extra — and LNP delivery sidesteps the anti-viral-antibody problem. But reaching heart and skeletal muscle with an editor is still unsolved, and mutation-specificity makes it a per-family effort. This is the furthest-out of the root-cause options."
  },
  {
    slug: "enzyme-replacement",
    name: "Enzyme replacement (recombinant TAZ protein)",
    family: "root-cause",
    tagline: "Skip the gene entirely — manufacture the tafazzin protein and deliver it directly.",
    how: "Inject the tafazzin protein itself, tagged to enter cells",
    route: "Repeat infusion",
    cl: "principle", mlcl: "principle", atp: "up",
    stage: 0.8,
    stageNote: "Early academic / preclinical (Chin lab lineage; Dinca UW thesis 2017)",
    leads: "Michael T. Chin, Molecular Cardiology Research Institute, Tufts Medical Center — the lineage runs from Ana Dinca's 2017 UW thesis (Chin was at the University of Washington then) to the 2024 penetratin paper. Related peptide-engineering work: Nathan Alder (UConn) on mitochondria-targeted peptides and Steven Glynn (Stony Brook) on tafazzin's structure — both BSF-funded.",
    mechanism: "Make purified human tafazzin in a bioreactor and infuse it, decorated with peptide tags that carry it into cells. Reading the construct name (HIS6-EEP-hTAFAZZINv2-CPP) left to right: HIS6 is a purification handle; EEP is an endosomal-escape peptide (springs the cargo out of the uptake bubble before it's digested); hTAFAZZIN v2 is the enzymatically active human isoform lacking exon 5; CPP is a cell-penetrating peptide (e.g. penetratin/TAT) that crosses the cell membrane.",
    onLipid: "Corrects in principle — if the enzyme reaches the inner mitochondrial membrane in working form, it remodels cardiolipin like the real thing.",
    onAtp: "Improves in principle.",
    routeDetail: "Repeat infusions (like enzyme replacement for Fabry, Gaucher, Pompe). Redoseable and titratable — no permanent genetic change, no antibody wall against re-dosing.",
    takeaway: "The redoseable, no-permanent-change profile is attractive, but the delivery problem is the hardest of any approach in the pipeline. Approved enzyme-replacement drugs target the lysosome, which has a natural cell-surface delivery highway; mitochondria have no such receptor, and tafazzin must clear four membranes to reach its post. A related twist: when the Chin lab moved to delivering the gene with a penetratin tag, the plain gene fixed the MLCL:CL ratio but didn't improve heart function — only the penetratin version did, for reasons still unknown."
  }
];

export const DELIVERY = [
  {
    name: "AAV capsid",
    carries: "A gene (e.g. TAZ)",
    relevance: "Natural AAV9 works but under-doses muscle. Engineered muscle-tropic capsids aim far more vector at heart and skeletal muscle and detarget liver: POLARIS-101 / AAV-SLB101 (Solid Biosciences), MyoAAV (Sharif Tabebordbar & Amy Wagers, Broad/Harvard), AAVMYO (Dirk Grimm, Heidelberg). Pu's lab went its own way — TAZ-02 uses an in-house myotropic capsid called C4, not a licensed one.",
    stage: "C4 characterized in Barth mice; POLARIS-101 clinical for other targets"
  },
  {
    name: "LNP (lipid nanoparticle)",
    carries: "mRNA / base editor + guide RNA",
    relevance: "Transient, non-viral, re-doseable, no anti-viral immunity — the vehicle for base editing. Today LNPs go mainly to liver; heart and muscle targeting is the open problem.",
    stage: "Proven in vaccines; muscle targeting unsolved"
  },
  {
    name: "Bicycle / TfR1 conjugate & AOCs",
    carries: "siRNA / ASO (e.g. anti-ABHD18)",
    relevance: "A small peptide (Bicycle Therapeutics) or antibody (AOC — Dyne Therapeutics, Avidity Biosciences) binds transferrin receptor 1 on muscle to haul an oligonucleotide inside — finally making siRNA/ASO viable in heart and skeletal muscle. The natural route for an anti-ABHD18 knockdown or a splice-correcting ASO.",
    stage: "Preclinical for Barth; clinical in other programs"
  },
  {
    name: "CPP + EEP peptides",
    carries: "A protein (e.g. tafazzin)",
    relevance: "Cell-penetrating plus endosomal-escape peptides drag a protein across the cell membrane — the delivery half of enzyme replacement. Still can't solve the mitochondrial-targeting step. Chin lab, Tufts.",
    stage: "Early academic"
  }
];

export const WHO = [
  { therapy: "Supportive care", people: "Hilary Vernon; Barry Byrne", where: "Johns Hopkins (Mitochondrial Medicine Center); University of Florida" },
  { therapy: "Elamipretide", people: "Stealth BioTherapeutics (sponsor); Hilary Vernon (TAZPOWER); Hazel Szeto & Peter Schiller (original chemistry)", where: "Company; Johns Hopkins" },
  { therapy: "MA-5", people: "Takaaki Abe; Takafumi Toyohara; Yoshiyasu Tongu", where: "Tohoku University, Japan" },
  { therapy: "NR / NAD⁺", people: "Yuguang Shi & Jun Zhang (mitophagy defect); Riekelt Houtkooper (NAD⁺ metabolism)", where: "Barshop Institute, UT Health San Antonio; Amsterdam UMC" },
  { therapy: "ABHD18", people: "Jason Moffat; Vincent Blomen; Sebastian Nijman; with Boone, Myers, Scott", where: "University of Toronto; Scenic Biotech (NL); Minnesota; SickKids" },
  { therapy: "Gene therapy", people: "William (Bill) Pu — TAZ-02; Seul Kee Byeon (cardiolipin data); Barry Byrne & Christina Pacak (parallel program)", where: "Boston Children's / Harvard; University of Florida" },
  { therapy: "Base editing", people: "Nobody, for Barth. Precedent: Rebecca Ahrens-Nicklas & Kiran Musunuru (CPS1); David Liu (base-editing chemistry)", where: "CHOP; Penn; Broad Institute" },
  { therapy: "Enzyme replacement", people: "Michael T. Chin; Nathan Alder (mito-targeted peptides); Steven Glynn (tafazzin structure)", where: "Tufts Medical Center; UConn; Stony Brook" },
  { therapy: "Muscle-tropic capsids", people: "Solid Biosciences (POLARIS-101); Sharif Tabebordbar & Amy Wagers (MyoAAV); Dirk Grimm (AAVMYO)", where: "Company; Broad/Harvard; Heidelberg" },
  { therapy: "Oligo delivery to muscle", people: "Bicycle Therapeutics; Dyne Therapeutics; Avidity Biosciences", where: "Companies" },
  { therapy: "Underlying biology", people: "Steven Claypool; Michael Schlame; Vishal Gohil; Colin Phoon; Mauro Corrado", where: "Johns Hopkins; NYU; Texas A&M; NYU; Cologne" }
];

export const REFERENCES = [
  {
    group: "Approved therapy — elamipretide (Forzinity)",
    items: [
      { text: "Long-term efficacy and safety of elamipretide in Barth syndrome: 168-week open-label extension of TAZPOWER — Genetics in Medicine 2024; the open-label data the approval leaned on", url: "https://pubmed.ncbi.nlm.nih.gov/38602181/" },
      { text: "SS-31 ameliorates cardiac mitochondrial morphology and defective mitophagy in a murine model of Barth syndrome — Scientific Reports 2024 (mechanism)", url: "https://pubmed.ncbi.nlm.nih.gov/38871974/" },
      { text: "FDA elamipretide updates and regulatory timeline — Barth Syndrome Foundation", url: "https://www.barthsyndrome.org/" },
      { text: "FDA grants accelerated approval to elamipretide, first treatment for Barth syndrome — Pharmacy Times, Sept 2025 (approval details, ≥30 kg, surrogate endpoint)" },
      { text: "FDA approves first mitochondrial disease therapy: Stealth's elamipretide for Barth syndrome — UMDF" }
    ]
  },
  {
    group: "Gene therapy — TAZ replacement",
    items: [
      { text: "AAV Gene Therapy Prevents and Reverses Heart Failure in a Murine Knockout Model of Barth Syndrome — Wang S, … Pu WT (senior author); Circulation Research 2020;126(8):1024–1039. The definitive Pu paper — uses AAV9." },
      { text: "AAV-Mediated TAZ Gene Replacement Restores Mitochondrial and Cardioskeletal Function in Barth Syndrome — Suzuki-Hatano, … Byrne BJ, Pacak CA; Human Gene Therapy 2019 (University of Florida group)" },
      { text: "Cell-Penetrating Peptide Enhances Tafazzin Gene Therapy in Mouse Model of Barth Syndrome — Raghav, … Chin MT; Int. J. Mol. Sci. 2024 (the “ratio fixed but function not” result)", url: "https://pubmed.ncbi.nlm.nih.gov/39769321/" },
      { text: "Yazawa E, … Pu WT. A murine model of Barth syndrome with cardiac and skeletal muscle selective inactivation of tafazzin — Dis. Model. Mech. 2025 (a model, not a therapy)" },
      { text: "TAZ-02 — conference presentation, 2026 Barth Syndrome Foundation International Scientific, Medical & Family Conference, July 19–26 2026, Bonita Springs FL. Not peer-reviewed." },
      { text: "Directed evolution of a family of AAV capsid variants enabling potent muscle-directed gene delivery across species — Tabebordbar, … Wagers; Cell 2021 (MyoAAV). Companion: AAVMYO, Grimm lab, Science Advances." }
    ]
  },
  {
    group: "Root-cause — ABHD18 inhibition",
    items: [
      { text: "Genetic suppression features ABHD18 as a Barth syndrome therapeutic target — Nature 2025; corresponding authors Jason Moffat (University of Toronto), Vincent Blomen and Sebastian Nijman (Scenic Biotech)" },
      { text: "Rebalancing cardiolipin biosynthesis to treat cardiomyopathy — Nature Reviews Drug Discovery highlight (plain-language context)" },
      { text: "BSF research summary of the ABHD18 paper — Barth Syndrome Foundation", url: "https://www.barthsyndrome.org/research/research-home.html" }
    ]
  },
  {
    group: "Compensatory — MA-5 and NR / NAD⁺",
    items: [
      { text: "Mitochondria-Homing Drug Mitochonic Acid 5 Improves Barth Syndrome Myopathy in a Human iPSC Model and Drosophila Model — Tongu et al.; Abe & Toyohara labs, Tohoku University; FASEB J. 2025", url: "https://pubmed.ncbi.nlm.nih.gov/40542649/" },
      { text: "First oral drug shows promise for Barth syndrome — Tohoku University press release; the source for “preparing to start Phase 2”" },
      { text: "Restoration of mitophagy ameliorates cardiomyopathy in Barth syndrome — Jun Zhang et al., Yuguang Shi lab, Barshop Institute, UT Health San Antonio; Autophagy 2022. Establishes the mitophagy defect — the rescue used rapamycin, not NR." }
    ]
  },
  {
    group: "Base editing — the precedent, not a Barth program",
    items: [
      { text: "World's first patient treated with personalized CRISPR gene editing therapy — Rebecca Ahrens-Nicklas (CHOP) and Kiran Musunuru (Penn), CPS1 deficiency, 2025" },
      { text: "BSF's summary of the CPS1 case for Barth families — why the foundation is watching it", url: "https://www.barthsyndrome.org/" }
    ]
  },
  {
    group: "Delivery platforms & enzyme replacement",
    items: [
      { text: "A transferrin-receptor-binding bicyclic peptide enhances oligonucleotide delivery to heart and skeletal muscle — Nucleic Acids Research 2025 (Bicycle/TfR1 — the route for an anti-ABHD18 oligo)" },
      { text: "Dinca A. Development of Enzyme Replacement Therapy in Mammalian Models of Barth Syndrome — PhD thesis, University of Washington 2017 (the recombinant tafazzin + CPP lineage)" }
    ]
  },
  {
    group: "Emerging",
    items: [
      { text: "Allogenic mitochondria transfer improves cardiac function in iPSC-derived cardiomyocytes of a patient with Barth syndrome — Experimental & Molecular Medicine 2025" }
    ]
  }
];
