# HiLabs APM Case: Research Dossier (Phase 1)

**Case:** Reimagining the Case Management Workbench (MVP, web) for a US health plan
**Deliverables:** (1) an 8–12 slide deck/PDF and (2) a spreadsheet annex with 5 synthetic patients across at least 6 datasets, with planted imperfections
**Prepared:** 7 Nov 2026. Confidence tags: **[H]** primary or official source · **[M]** reputable secondary source · **[L]** vendor claim or my own estimate, to be defended as an assumption

---

## 0. The case decoded: what is actually being tested

| Section | Slides | Weight it feeds | What "great" means in practice |
|---|---|---|---|
| A. Understand | 1–2 | Problem depth 20% | Persona (case manager only), a day in the life, pain points **ranked by impact**, and **where the day is lost, with the arithmetic shown** |
| B. Data strategy | 2 | Data thinking 25% (the largest) | Every dataset with: source, what it tells the clinician, freshness, quality problems and how we handle them, priority. **Combinations that create insight** |
| C. Synthetic patients | 1–2 + annex | Synthetic data 20% | 5 *different* stress scenarios, at least 6 datasets each, realistic imperfections, and one "8 am Monday" line each |
| D. Product design | 3–4 | Product & prioritization 25% | At least 3 wireframes; above-the-fold logic; how **freshness, conflict and confidence** are shown; next best action; where AI helps and **what the clinician must confirm**; walk 2–3 patients through the screens |
| E. Prioritize & measure | 1 | Metrics/risks/comms 10% | MVP vs. later; metrics with **baseline and target**; risks (stale data, alert fatigue, trust) with mitigations |
| Brownie points | — | — | Pilot + go-to-market: buyer, pilot scope, pricing signal |

**The evaluator's test, quoted from the case:** "What would Maria do differently because she saw this?" Every dataset, widget and AI feature needs a sentence answering it.

**Explicit traps to avoid:**
- Do not reuse "Patient X" (the 74-year-old with COPD and diabetes).
- Use no real PHI, and make the fake data obviously fake.
- Do not design pipelines. The case assumes HiLabs ingests and standardizes the data; **our job is which data matters, why, and how it appears on screen.**
- Avoid buzzwords; show depth instead ("depth beats a long list of names").
- Cite sources and state assumptions.
- Be opinionated, including about what we deliberately leave out.

**Subtle signal in the case:** the example annex says "assume health plans have unique patient identifiers," yet the list of possible imperfections includes "duplicate ID." So one patient should carry a duplicate or merged ID (for example, Medicaid ID plus Medicare MBI for a dual-eligible member, or a re-enrolled member issued a new ID). That stresses identity resolution without contradicting the assumption.

---

## 1. Question bank (yours, expanded with ones the case implies)

**Users and work**
1. Who are case managers (credentials, background, licensure)? Who else is on the team (social workers, BH counselors, CHWs, pharmacists, non-clinical coordinators)?
2. How are they employed (in-house at the plan, delegated vendors, provider-delegated)? Is the work remote? What are the licensure constraints?
3. What case types and programs exist? What are realistic caseloads per type?
4. How are cases created, routed and closed (triggers, routing rules, acuity)?
5. What does a real day look like, and where exactly does time go? (Must be quantified.)
6. What regulatory clocks drive their work (TRC, TCM, FUH/FUM, D-SNP HRA within 90 days, NCQA file review, state contracts)?
7. What makes a "bad day" costly for Maria, for the member and for the plan?

**Payers and money**

8. What health plan types exist, and why does each invest in care management?
9. How do Stars, HEDIS, MLR, risk adjustment (V28) and Medicaid contracts turn CM work into dollars?
10. Who buys a workbench (VP Care Management, CMO, COO, CIO), and how is it priced?

**Data**

11. Which datasets exist beyond claims, and how fresh and reliable is each?
12. What is in an ADT message, and what is missing ("admitted but not why")?
13. How large is claims lag, and what fills the gap (ADT, pharmacy, labs, HIE, prior auth)?
14. What code systems are used (ICD-10-CM/PCS, CPT/HCPCS, NDC/RxNorm, LOINC, SNOMED CT, Z codes, DRG, revenue/POS codes)? How do we give them clinical context?
15. **Can SNOMED CT be the umbrella that unifies them?** (Answered in §8.)
16. How do we show freshness, provenance, conflict and confidence on screen?
17. What restrictions apply (HIPAA minimum necessary, 42 CFR Part 2 for SUD, TCPA for texts and auto-dialers, state consent rules)?

**Risk and prioritization**

18. What risk models are used (CMS-HCC V28, ACG, LACE/HOSPITAL, vendor ML)? What is "rising risk" versus "impactability"?
19. How should "who needs me today" be ranked: risk × urgency (regulatory clock) × impactability × reachability?

**Outreach**

20. Why do outreach attempts fail (bad numbers, timing, language, trust, phone minutes)? What are real connect rates?
21. Which channels exist (phone, SMS, IVR, mail, PCP office, pharmacy, caregiver, CHW home visit), and what consent does each need?

**AI**

22. What do incumbents already ship (note summarizers, assessment prefill, ambient listening)?
23. What can be automated, and what must a clinician confirm? What do CMS and the states say about AI in health plans?

**Competition and positioning**

24. Who are the incumbents (GuidingCare, ZeOmega Jiva, Epic, Salesforce, Medecision, Innovaccer, VirtualHealth), and what gap remains?
25. Where does HiLabs fit (data-quality DNA) and what is its right to win?

**Metrics**

26. What are baseline and target values for prep time, cases per CM, connect rate, TRC completion, 7-day follow-up, readmissions and documentation time?
27. What are the risks: stale data, alert fatigue, automation bias, trust, equity?

---

## 2. Health plans 101: who pays, and why they fund care management

| Market | Who is covered | Size (2026) | Why the plan invests in CM |
|---|---|---|---|
| **Medicare Advantage (MA)** (HMO, PPO, PFFS) | Age 65+ and disabled, enrolled in private plans | About 55% of eligible beneficiaries **[H]** ([KFF](https://www.kff.org/medicare/medicare-advantage-enrollment-update-and-key-trends/)) | Star Ratings (4+ stars brings a 5% benchmark bonus plus rebates), HEDIS/TRC, readmissions, risk adjustment accuracy |
| **Special Needs Plans (SNPs)** (D-SNP, C-SNP, I-SNP) | Dual-eligibles, chronic conditions, institutional members | 8.2M enrollees, 23% of MA; 78% of SNP enrollment is D-SNP **[H]** ([KFF](https://www.kff.org/medicare/medicare-advantage-enrollment-grew-by-about-1-million-people-mainly-due-to-special-needs-plans/)) | **CM is legally required**: a Model of Care with an HRA within 90 days, an individualized care plan (ICP) and an interdisciplinary care team (ICT) **[M]** ([CA DHCS D-SNP specs](https://www.dhcs.ca.gov/provgovpart/Documents/D-SNP-Reporting-Requirements-Technical-Specifications.pdf)) |
| **Medicaid managed care (MCO)** | Low-income adults, children, pregnant people, disabled | Most Medicaid enrollees are in managed care; Medicaid finances **41% of US births** **[H]** ([KFF](https://www.kff.org/medicaid/issue-brief/5-key-facts-about-medicaid-and-pregnancy/)) | State contracts mandate CM with timelines and penalties; quality withholds; HEDIS |
| **Commercial / employer** (HMO, PPO, EPO, POS, HDHP) | Workers and dependents | Largest by headcount | Cost of care (MLR), employer ROI; mostly disease management and maternity |
| **ACA Marketplace** | Individuals | Smaller | Risk adjustment, quality rating system |

**Money mechanics to cite:**
- MLR floor: 85% for MA and large group, 80% for individual and small group. Care management counts as a quality-improvement expense.
- MA risk scores are 100% on CMS-HCC V28 in payment year 2026 **[M]** ([ASPR summary](https://asprcmsolutions.com/insights/v28-fully-phased-in-2026-risk-scores/)). Accurate, documented chronic conditions matter, but **we deliberately keep risk-adjustment coding out of the clinician's workbench** (it creates a conflict of interest and erodes trust).
- Star weights shift: Part D adherence measures are temporarily single-weighted for MY2026 with sociodemographic adjustment **[M]** ([Rise Health](https://www.risehealth.org/insights-articles/star-ratings-measure-set-shrinks-cut-point-strategy/)). TRC remains an important HEDIS/Star measure **[M]** ([Oliver Wyman](https://www.oliverwyman.com/our-expertise/perspectives/health/2025/oct/how-plans-can-win-as-medicare-advantage-star-ratings-change.html)).

**Design implication:** pick **one primary buyer context for the MVP**. My recommendation is a mid-size regional plan with both MA/D-SNP and Medicaid lines. It has the densest regulatory clocks (TRC, HRA within 90 days, FUH) and the hardest outreach population, so it stresses the product most and matches all five suggested scenarios.

---

## 3. Who case managers are, and how they are employed

- **Credentials:** mostly RNs, plus LCSWs/LMSWs and BH counselors (LPC). Many hold CCM (Commission for Case Manager Certification) or ACM certification. Non-clinical **care coordinators/CHWs** handle scheduling, transport and mail. That split matters: **routing non-clinical tasks away from RNs is a product lever.**
- **Employment models:** (1) **in-house at the plan**, mostly remote and telephonic (Humana describes RN care managers as "work at home associates" on structured schedules); (2) **delegated vendors** (Optum, Carelon, Evolent, CVS/Aetna-style telephonic CM for self-insured clients), where the plan keeps approval authority and runs delegation oversight; (3) **provider-delegated** CM in capitated groups and ACOs **[M]** ([job-posting evidence](https://jobverse.io/jobs/18963846/case-manager-registered-nurse-at-cvshealth-remote), [Humana](https://findroles.com/jobs/5920745458-care-manager-telephonic-rn)).
- **Licensure:** a nurse must be licensed in the member's state. The Nurse Licensure Compact helps, but non-compact states (for example California) need individual licenses, and **routing by licensure is a hard constraint** **[M]**. (NLC membership: about 43 jurisdictions; verify the number before citing.)
- **Onboarding:** at least two weeks of platform training before plan-specific training **[L]** ([VirtualHealth via Fierce](https://careco.ai/blog/how-to-stop-burning-out-your-care-managers)). That supports a "learnable in a day" UX goal.
- **Burnout:** 58% of RNs report burnout on most days, and only 39% expect to stay 12 months (AMN 2025, all RNs) **[M]**. In the AMIA survey, more than 77% regularly work after hours because of administrative work **[M]**. The case states the same thing: "documentation after hours."

**Persona anchor (from the case, enriched):** Maria, RN, 20 years in the ICU, now a remote complex case manager at an MA/D-SNP + Medicaid plan, 48 active cases, licensed in 3 compact states. Superpower: pattern-spotting ("the med list doesn't add up"). Fears: missing a deteriorating member and failing an audit. Workarounds: a personal Excel tracker and sticky notes.

---

## 4. Case types, triggers and the regulatory clocks that drive them

### 4.1 Programs and typical caseloads

| Program | Typical caseload (from the case; to validate) | Typical duration | Clock or requirement |
|---|---|---|---|
| Complex case management (CCM) | 30–60 per RN | 60–180 days | NCQA PHM 5: initial assessment and ongoing management are **file-reviewed** **[H]** ([NCQA](https://ncqa.org/programs/health-plans/case-management-cm/benefits-support/standards/)) |
| Transitions of care (TOC) | 60–100+ | 30 days post-discharge | Contact within ~2 business days, visit within 7 days; HEDIS TRC |
| Telephonic disease management | 100–200+ | Ongoing | HF, COPD, diabetes, CKD; adherence |
| Behavioral health CM | Program-specific | Ongoing | HEDIS FUH/FUM: follow-up within 7 and 30 days after a BH hospitalization or ED visit |
| Maternity / high-risk pregnancy | Program-specific | Pregnancy + 12 months postpartum | 12-month postpartum Medicaid coverage in 46+ states **[M]** ([NASHP](https://nashp.org/?p=44019)) |
| D-SNP Model of Care | Whole SNP population | Annual | HRA within 90 days of enrollment and annually; ICP; ICT **[M]** |
| Oncology, transplant, CKD/ESRD, LTSS/HCBS | Specialized | Long | State LTSS rules |

Caseload literature gives **no single benchmark number**. The CMSA/AHC survey ranged from 16 to 75 active cases, and CMSA publishes a caseload capacity calculator **[M]** ([Relias](https://reliasmedia.com/articles/136210-theres-no-magic-number-for-case-management-caseloads)). **Implication:** the product should measure *workload* (acuity-weighted points), not raw case counts.

### 4.2 The five trigger types and the data behind each

| Trigger | Data source | What arrives | What is missing (product opportunity) |
|---|---|---|---|
| **Event (ADT)** | Hospital → HIE or notification vendor (Bamboo/PatientPing, Collective, CarePort) → plan. Hospitals must send ADT notifications under the CMS CoP 42 CFR 482.24(d), effective May 2021 **[H]** ([CMS FAQ](https://www.cms.gov/priorities/burden-reduction/overview/interoperability/frequently-asked-questions/admission-discharge-transfer-patient-event-notification-conditions-participation-cop-42-cfr-482-24d)) | HL7 v2 ADT A01 admit / A03 discharge / A04 ED registration / A08 update | **Minimum content is only patient name, treating practitioner and sending institution; diagnosis is optional.** This is the source of "admitted but not why." The discharge disposition is often absent. |
| **Risk model** | Claims + Rx + labs → CMS-HCC, ACG, LACE (0–19; ≥10 is high; C-statistic about 0.68, modest) **[H]** ([CMAJ](https://cmaj.ca/content/182/6/551)) | Monthly score | Scores are stale (claims lag) and say "who is expensive," not "who is **impactable** today" |
| **Referral** | UM nurse (concurrent review), PCP, call center, member/family, HRA result | Free-text referral | Reason and urgency are unstructured |
| **Program enrollment** | Eligibility + diagnosis rules (HF, COPD, DM, CKD, oncology, maternity, BH) | Batch lists | Duplicates across programs, so one member can have 3 case managers |
| **Transition of care** | ADT discharge + facility type | Discharge event | Discharge summary is often missing: available at only **12–34% of first post-discharge visits** **[H]** ([Kripalani, JAMA 2007](https://www.jabfm.org/content/jabfp/30/6/758.full.pdf)) |

### 4.3 Regulatory and quality clocks the queue must know about

- **HEDIS TRC** (MA): (1) notification of inpatient admission, (2) receipt of discharge information, (3) patient engagement after discharge (same-day engagement does not count), and (4) medication reconciliation post-discharge from the discharge date through 30 days, done by a prescriber, pharmacist or RN depending on the spec. TRC is a hybrid measure, so chart documentation matters **[M]** ([MVP tip sheet](https://mvphealthcare.com/-/media/project/mvp/healthcare/documents/hedis/2025/transitions-of-care-trc.pdf)). **Documentation by CMs is directly scored.**
- **TCM billing** (provider side; this is the source of "2 business days / 7 days"): CPT 99495 requires interactive contact within 2 business days and a face-to-face visit within 14 days (moderate complexity). CPT 99496 has the same contact rule with a visit within 7 days (high complexity).
- **FUH / FUM / FUA:** follow-up within 7 and 30 days after a mental-health hospitalization or a mental-health or SUD ED visit.
- **D-SNP:** HRA within 90 days of enrollment, then annually; ICP; ICT.
- **NCQA CM accreditation:** file review of initial assessment and ongoing management. The **40-field assessment** in the case exists because of these audits.
- **CMS-0057-F:** from **1 January 2027**, impacted payers must run Patient Access, **Provider Access**, **Payer-to-Payer** and **Prior Authorization** FHIR APIs. Prior-authorization decision timeframes (72 hours expedited, 7 days standard) have applied since 1 January 2026 **[H]** ([CMS fact sheet](https://www.cms.gov/files/document/fact-sheet-cms-interoperability-and-prior-authorization-final-rule-cms-0057-f.pdf)). This creates a tailwind: richer, faster clinical data reaches the plan.

---

## 5. The five obstacles, with evidence

| Obstacle | Evidence | Number to use | Conf. |
|---|---|---|---|
| **Messy data** | Unintentional medication discrepancies after discharge: median **50%** of patients (11 studies); errors 53% | 50% | [H] ([PMC7235049](https://pmc.ncbi.nlm.nih.gov/articles/PMC7235049)) |
| | SDOH Z codes appear on only **~1.6%** of Medicare FFS beneficiaries' claims (2019) and ~1.07% in MA. Claims are blind to social needs. | 1–1.6% | [H] (CMS OMH data highlights) |
| | SNOMED→ICD is many-to-one, so mapping down for billing loses clinical detail | qualitative | [M] |
| **Untimely data** | Claims: ~98% adjudicated within 30 days of *submission* (AHIP), but providers can submit up to the timely-filing limit (90–365 days). Incurred-to-paid completion takes months, and some claims are not 100% complete even 12 months out. | Plan on a 30–60 day median lag | [M] ([Tuva](https://thetuvaproject.com/knowledge/data-sources/claims-data/incurred-paid-runout)) |
| | ADT minimum content excludes diagnosis | qualitative | [H] |
| | Discharge summary available at only 12–34% of first follow-ups | 12–34% | [H] |
| **Work burden** | Care managers juggle 3–5+ applications; transferring information between apps and finding correct medication data are the top barriers **[M]** ([PMC6557451](https://pmc.ncbi.nlm.nih.gov/articles/PMC6557451), [Wolters Kluwer](https://www.wolterskluwer.com/en/expert-insights/build-efficiency-into-care-plans-and-help-care-managers-fight-burnout)). The case says 6–7 screens. | 6–7 screens | [M] |
| **Documentation** | Nurses spend **13–41%** of the workday documenting, depending on setting and method; the US Surgeon General cites up to 41% in the EHR | Use 30% ± 10% | [M] ([Becker's](https://www.beckershospitalreview.com/quality/nursing/systems-ramp-up-efforts-to-reduce-documentation-time/)) |
| | Innovaccer CM copilot claims a 28% documentation-time reduction (vendor) | 28% | [L] |
| **Hard outreach** | At least **24%** of Medicaid phone numbers inaccurate (NBER field experiment); vendors say 1 in 5 are invalid; Medicaid reach rates can fall below 20% | 20–25% bad numbers | [H]/[M] ([NBER w34191](https://www.nber.org/system/files/working_papers/w34191/w34191.pdf)) |
| | CM engagement: industry average ~20% (Tufts claims 50%); below 30% in high-risk groups; one MA telephonic campaign reached 14.2% (9.6% non-SNP vs 21.4% SNP) | ~20–30% | [L]/[M] |
| | The FCC estimates ~35M US phone numbers are disconnected and reassigned each year (Reassigned Numbers Database rationale) | 35M/yr | [M], verify |

**Cost of a bad outcome (for a "what a bad day costs" slide):** 30-day readmission averages **$15,200**; the Medicare readmission rate is ~17% **[H]** ([HCUP SB248](https://hcup-us.ahrq.gov/reports/statbriefs/sb248-Hospital-Readmissions-2010-2016.jsp)).

---

## 6. Where Maria's day is lost: first-pass model (to refine for slide A)

Assumptions: an 8-hour day (480 min), 48 active cases, about 10 members actively worked per day, and 6 new discharge alerts on Monday.

| Activity | Arithmetic | Minutes | Share |
|---|---|---|---|
| **Data hunting / prep** | 10 members × 6–7 screens × ~2.5 min + ~5 min reconciling conflicts | ~170–200 | **~38%** |
| **Outreach dialing (no connection)** | ~18 attempts × ~4 min (lookup, dial, voicemail, log). At ~20–25% connect, only ~4 connect, and 2 become real conversations by 3 pm (per the case) | ~70 | **~15%** |
| **Documentation** | 1 × 40-field assessment (~35 min) + ~10 contact notes × 5 min + care-plan/audit re-entry (~25 min) | ~110 | **~23%** |
| **Real conversations (clinical judgment)** | 2–3 × ~25 min | ~60 | **~13%** |
| **Coordination** (PCP, pharmacy, DME, transport, auth) | ~4 tasks × 8 min | ~35 | **~7%** |
| Huddles / email / admin | | ~20 | ~4% |

**Headline (draft):** about **75% of Maria's day goes to hunting, dialing and typing, and about 13% to clinical judgment.** Target: double the conversation time (2 → 4–5 real conversations per day) without adding headcount. Confidence: medium. Each row needs a stated assumption and a source on the slide. Running a quick survey or interviews would strengthen it, as the reference deck did.

---

## 7. Software already in place (competitive landscape)

| Category | Players | What they do | Gap we exploit |
|---|---|---|---|
| Payer CM workflow (system of record) | **ZeOmega Jiva** (Best in KLAS 2025 payer CM, 82.2) **[M]** ([KLAS](https://klasresearch.com/best-in-klas-ranking/care-management-solutions-payer/2025/306)), **HealthEdge GuidingCare**, Zyter TruCare, Medecision Aerial, VirtualHealth HELIOS, Salesforce Health Cloud / Member Care Mgmt, Epic Payer Platform/Healthy Planet, Pega, Optum | Cases, assessments, care plans, tasks, UM integration, audit | Built as forms-plus-workflow. **Data quality and freshness is the user's problem.** Long implementations. |
| AI add-ons | HealthEdge GuidingCare Notes Summarizer; HealthEdge + Suki ambient for CM (Jan 2026); Innovaccer CM Copilot (assessment prefill, care-plan suggestions, claims −28% documentation time) **[L]** ([HealthEdge](https://healthedge.com/resources/blog/leveraging-ai-to-summarize-guidingcare-notes-and-empower-care-managers), [Innovaccer](https://businesswire.com/news/home/20250422661645/en/Innovaccer-Launches-Copilots-and-Agents-for-Care-Management-Reducing-Documentation-Time-by-28-and-Boosting-Patient-Engagement-by-20)) | Summarize and prefill | Summarizing bad data produces confident bad output. **No visible provenance, freshness or conflict handling.** |
| Event notification | Bamboo Health (PatientPing/Collective), PointClickCare/CarePort, HIEs | ADT feeds | Alerts without context, plus alert fatigue |
| SDOH / referrals | findhelp, Unite Us | Community resource closed-loop referrals | Not wired to CM priorities |
| Outreach | mPulse, Carenet, Drips; **HiLabs MCheck Intelligent Outreach (voice AI)** | SMS, IVR, call centers | Not tied to the CM's queue or best-time data |
| Pop-health / analytics | Innovaccer, Arcadia, Lightbeam, Cotiviti | Risk stratification, gaps | Monthly batches, analyst-facing |

**HiLabs' right to win:** HiLabs' core is **MCheck**, a platform that ingests, cleans and enriches payer data. Its products cover provider data accuracy, NetworkIQ, ContractsAI and Intelligent Outreach (voice AI). HiLabs reports serving 6 of the top 10 US plans, raised a $39M Series B (2024), partners with CAQH, and holds HITRUST certification **[M]** ([Fierce](https://fiercehealthcare.com/health-tech/hilabs-closes-39-million-funding-round-company-enters-next-phase-growth), [GlobeNewswire](https://www.globenewswire.com/news-release/2022/06/15/2463266/0/en/HiLabs-Releases-New-Product-MCheck-Provider-to-all-Health-Plans-Nationally-at-AHIP-2022.html)).
**Positioning line (draft):** *"Incumbents digitize the form. HiLabs makes the facts trustworthy, so the form fills itself and the clinician only confirms."* Provider-data accuracy plugs straight in: the PCP on file is correct and accepting appointments, so the 7-day follow-up actually gets booked.

---

## 8. Code systems, and whether SNOMED CT can be the umbrella

### 8.1 What each code system is (and where it shows up in a CM's data)

| Code system | Domain | Owner | Where the CM sees it | Clinical-context problem |
|---|---|---|---|---|
| **ICD-10-CM** | Diagnoses (billing) | CDC/NCHS (US) | Claims, auths, problem lists | Classification built for billing; "rule-out" diagnoses get coded; no onset or severity |
| **ICD-10-PCS** | Inpatient procedures | CMS | Inpatient claims | Rarely meaningful to a CM |
| **CPT** (HCPCS Level I) | Outpatient procedures and visits | AMA (proprietary) | Professional claims | Shows that a visit happened, not what was found |
| **HCPCS Level II** | DME, supplies, drugs given in clinic, transport | CMS | DME/transport claims | Good for "is the oxygen delivered?" |
| **NDC** | Drug *package* (10/11 digits) | FDA | Pharmacy claims (NCPDP) | Thousands of NDCs per molecule; needs a roll-up |
| **RxNorm** | Normalized drug concepts (ingredient, strength, form) | NLM | Normalizes NDC; FHIR | **The US drug standard. Map NDC → RxNorm → ingredient/class** |
| **LOINC** | Lab tests and observations (the question) | Regenstrief | Lab results (HL7 ORU), vitals | Needs a result value, unit and reference range to mean anything |
| **SNOMED CT** | Clinical findings, disorders, procedures, body sites, social context (the clinical meaning) | SNOMED International; free in the US via NLM UMLS | EHR problem lists, C-CDA, FHIR, HIE | Not used for billing in the US |
| **ICD-10 Z codes** (Z55–Z65) | SDOH | NCHS | Rare on claims (~1.6%) | Under-coded |
| **MS-DRG**, revenue codes, POS, bill type | Inpatient grouping, facility setting | CMS/NUBC | Claims | Tell you the setting and length of stay |
| **CVX** | Vaccines | CDC | Immunization registries | — |
| **ICD-11** | Next-generation WHO classification (has its own Foundation ontology) | WHO | Not adopted for US use as of 2026 | Relevant to India/global (DH 308 used it) and as a future-proofing note |

### 8.2 Can SNOMED CT be the single umbrella?

**Short answer: not as a replacement, yes as the clinical meaning layer, and only together with RxNorm and LOINC.** This is a good "be opinionated" moment for the deck.

1. **Diagnoses: yes (SNOMED ↔ ICD-10).** The International release you supplied (20261001) includes `der2_iisssccRefset_ExtendedMapSnapshot` (SNOMED → **WHO ICD-10**) and simple maps. NLM publishes a SNOMED CT → **ICD-10-CM** map in the US Edition. The map is many-to-one and rule-based (age, gender), so you can roll *up* from SNOMED to ICD but not reliably *down*. **Use:** the SNOMED hierarchy groups conflicting source codes ("I50.9 on claims" and "SNOMED 84114007 Heart failure on the CCD" are the same condition). Its *is-a* relationships let rules say "any heart failure subtype."
2. **Labs: partially (LOINC + SNOMED).** The LOINC Ontology (production release in 2025, v2.0 in September 2025) links LOINC parts to SNOMED concepts. **LOINC stays the code for the question, and SNOMED codes the answer or finding** **[M]** ([SNOMED/LOINC](https://www.snomed.org/news/snomed-international-and-loinc%C2%AE-announce-renewed-collaboration-agreement-and-upcoming-production-release-of-the-loinc-ontology)). LOINC does not get replaced.
3. **Drugs: no (use RxNorm).** In the US, NDC → **RxNorm** is the standard path (USCDI, FHIR, OMOP). SNOMED's international drug model exists, but US pharmacy data does not speak it.
4. **Procedures (CPT): no official map.** CPT is AMA-proprietary. SNOMED has procedure concepts, but there is no maintained CPT↔SNOMED map. Keep CPT as the source and group into clinician-meaningful buckets ("PCP visit," "cardiology visit," "home health start").
5. **SDOH: yes, here SNOMED adds value.** SNOMED (with the Gravity Project value sets) codes social findings (for example homelessness, food insecurity) that claims never capture.

**Recommended architecture statement (no pipeline detail, just the principle):** follow the **OMOP / USCDI pattern: one "standard concept" per domain** (SNOMED for conditions and social findings, RxNorm for drugs, LOINC for observations), keep the **source code plus provenance** on every fact, and **translate everything into plain clinical language on screen**. Maria should never see "I50.9." She should see "Heart failure (claims, 12 Sep; confirmed on discharge CCD, 3 Nov)." This is exactly how the OMOP CDM works **[M]** ([FHIR-to-OMOP IG](https://build.fhir.org/ig/HL7/fhir-omop-ig/codemappings.html)).

**What we can do with your files:** the DH 308 project already holds a **112,520-concept SNOMED subset with ICD-10 maps** (`DH 308/Project/data/terminology/snomed-subset.tsv.gz`) and a build script. I will use it to code the 5 synthetic patients with **real SNOMED IDs and their ICD-10 maps**, showing the unification in practice in the annex. Note: those maps target WHO ICD-10, not ICD-10-CM, so I will hand-verify ICD-10-CM codes for the annex. The LOINC PDF you supplied is the IHE Lab Technical Framework, not the LOINC table, but DH 308 has 68 LOINC codes already verified against tx.fhir.org, and I will verify any new ones the same way.

---

## 9. Draft dataset inventory (seed for slide B; to be trimmed to the best ~18–22)

| # | Dataset | Source / standard | Tells Maria | Freshness | Typical quality issue → handling | Priority |
|---|---|---|---|---|---|---|
| 1 | Member & eligibility | 834 enrollment file | Who, which plan, active?, PCP, language, dual status | Daily | Stale PCP; dual has 2 IDs → identity resolution, merge flag | Must |
| 2 | ADT alerts | HL7 v2 via HIE/vendor | Admitted/ED/discharged *now* | Real-time | No diagnosis, missing discharge → show "reason unknown" and auto-request the summary | Must |
| 3 | Medical claims | 837I/P (ICD-10, CPT, DRG, POS) | Utilization history, diagnoses | 30–60+ day lag | Lag, rule-out codes → "as of" date; never treat absence as negative | Must |
| 4 | Pharmacy claims / fills | NCPDP via PBM (NDC → RxNorm) | What was actually picked up; PDC; gaps | 1–3 days | Cash fills, samples and 90-day mail fills are invisible → "unknown," not "non-adherent" | Must |
| 5 | Lab results | HL7 ORU / FHIR (LOINC) | A1c, BNP, eGFR, K+, trends | Days | Units, missing ranges → normalize units, show the trend | Must |
| 6 | Clinical documents (CCD / discharge summary) | C-CDA / FHIR via HIE, Provider Access API | Why admitted, discharge meds, follow-up plan | Days or never (12–34% at first visit) | Missing or late → "summary pending" chip plus an auto-request task | Must |
| 7 | Discharge medication list vs. pharmacy vs. plan list | Derived (6 + 4 + 13) | **Med discrepancy** (~50% of patients) | — | Conflicts → side-by-side diff; clinician resolves | Must |
| 8 | Prior auth / UM | Plan UM system; CMS-0057 PA API | Pending SNF/home health/DME, concurrent review notes | Real-time | Free text → AI summary with source link | Must |
| 9 | Contact history & outreach outcomes | CM system, dialer, SMS | What was tried, when, what worked | Real-time | Unlogged attempts → auto-log from dialer | Must |
| 10 | Contact-point quality | Phone validation / carrier lookup, NCOA, HiLabs Intelligent Outreach | Is the number live, mobile or landline, whose is it | Weekly | 20–25% bad → confidence score per number | Must |
| 11 | HRA / assessments | CM system (D-SNP HRA, PHQ-9, GAD-7) | Functional, behavioral, cognitive status | Point in time | Stale (>12 months) → age badge plus a re-ask prompt | Must |
| 12 | SDOH screen | AHC-HRSN / PRAPARE, Z codes, SNOMED/Gravity | Housing, food, transport, phone minutes | Point in time | Self-reported and stale; Z codes ~1.6% → age badge | Must |
| 13 | Care plan / prior case notes | CM system | Goals, barriers, open tasks, last conversation | Real-time | Long free text → AI "since last contact" summary | Must |
| 14 | Care gaps / HEDIS | Plan quality engine | TRC, FUH, A1c control, statin, adherence | Monthly | Lagged → show the clock, not just the gap | Must |
| 15 | Provider directory / PCP / attribution | **HiLabs MCheck Provider** | Who to call, is the PCP accepting, appointment availability | Weekly | ~Directories notoriously inaccurate → HiLabs core strength | Must |
| 16 | Appointments / scheduling | Provider EHR/practice management (via HIE or API), scheduling vendors | Is the 7-day visit booked? kept? | Daily | Often unavailable → "unknown" plus a confirm task | Later (MVP if available) |
| 17 | Risk scores | HCC/ACG/LACE/plan ML | Long-term risk; readmission risk | Monthly | Stale; opaque → show drivers, not just the number | Must (as input to ranking) |
| 18 | Caregiver / authorized representative | CM system, HIPAA authorization | Who else can talk, their number | Static | Missing authorization → block plus a prompt | Must |
| 19 | Language, accessibility, preferences | Eligibility, CM system | Interpreter, best time, channel | Static | Missing → learn from outreach outcomes | Must |
| 20 | Behavioral health (with Part 2 consent) | BH claims, BH vendor | SUD/MH treatment | Lag | 42 CFR Part 2 restrictions → consent-gated display | Later |
| 21 | PDMP | State PDMP | Controlled substances | Real-time | Access rules vary by state | Later |
| 22 | Home health / SNF (OASIS/MDS) | Post-acute provider, PointClickCare | Functional status, start of care | Days | Patchy | Later |
| 23 | Remote patient monitoring | RPM vendor | Daily weight (HF), BP, glucose | Real-time | Noise → thresholds plus a trend | Later |
| 24 | Community resource referrals | findhelp / Unite Us | Was the food/transport referral closed? | Real-time | Open loops → closure status | Later |
| 25 | Transport / benefits used | Plan supplemental benefit vendors (NEMT, meals, OTC) | Ride booked? meals delivered? | Daily | Vendor silos | Later |
| 26 | Call-center / member services logs | CRM | Member called about a bill or a fall | Real-time | Free text → AI tagging | Later |
| 27 | Death / hospice | SSA DMF, hospice election, obituary vendors | Stop outreach | Weekly | Lag → sensitive banner | Must (safety) |
| 28 | CM workload & capacity | CM system | Acuity-weighted caseload, licensure, language | Real-time | — | Must (for routing) |

**Insight recipes (combinations) for slide B, with more to come:**
- ADT discharge (HF) + no loop-diuretic fill within 3 days + no PCP visit booked = **"HF discharge, no diuretic picked up, no 7-day visit. Call today."**
- Pharmacy refill gap (metformin, PDC falling) + A1c rising (LOINC 4548-4) + cost-related SDOH flag = **"Stopped refills, likely cost. Offer the 90-day mail benefit or a generic switch."**
- 3+ ED visits in 60 days (ADT) + all outreach failed + phone confidence low + PCP office saw the member last week = **"Reach through the PCP office / ED navigator instead of the phone."**
- BH discharge (ADT) + FUH clock (day 4 of 7) + housing unstable + phone minutes limited = **"FUH 7-day window closes Thursday. Text-first, shelter-address mail."**
- Pregnancy (claims/ADT) + missed prenatal visit + elevated BP reading + transport barrier = **"Preeclampsia risk. Same-week OB visit plus a ride."**
- Dual-eligible + 2 member IDs + caregiver strain on the HRA + falls on claims = **"Merge records. Caregiver respite plus a home safety evaluation."**

---

## 10. AI: what to automate versus what the clinician must confirm (principles)

- **Regulatory guardrails:** CMS's February 2024 FAQ says MA plans may use AI, but medical-necessity decisions must rest on the individual's circumstances, not an algorithm alone **[H]** ([Norton Rose](https://www.nortonrosefulbright.com/en/knowledge/publications/644bd9a2/cms-clarifies-medicare-advantage-organizations-use-of-ai-and-algorithms-in-coverage-decisions)). **California SB 1120** (effective 1 January 2025) requires that a licensed clinician make any medical-necessity denial, delay or modification **[H]**. Our workbench is not UM, but the same human-in-the-loop principle applies.
- **Proposed 3-tier AI contract (draft):**
  1. **Automate silently:** de-duplication, code → plain language, freshness stamps, contact-number validation, auto-logging of calls, queue ranking inputs.
  2. **AI drafts, clinician confirms (one click with a visible source):** pre-call brief ("since last contact"), assessment pre-fill from known facts (with a source chip per field), med-list reconciliation proposal, call-note draft from the conversation, task creation.
  3. **Clinician only:** clinical judgment, care-plan goals, escalation to a provider, anything a member said that changes risk, closure decisions.
- **Trust UX:** every fact carries source + date + confidence. Conflicts are shown, never auto-resolved. Each "why is this member #1?" ranking explains itself in 3 reasons.

---

## 11. Metrics seed (baseline → target to finalize)

| Metric | Baseline (source/assumption) | Pilot target |
|---|---|---|
| Prep time per member | ~15–20 min (6–7 screens; my estimate) | ≤5 min |
| Real conversations per CM per day | 2 (case) to 3 | 4–5 |
| Documentation time per contact | ~25–35 min incl. assessment (estimate; nurses spend 13–41% of the day documenting) | −40% |
| Outreach connect rate | ~20–30% (industry) | +10 pp (better numbers, best time, alternate contacts) |
| Post-discharge contact within 2 business days | Plan-specific; assume ~50% | ≥85% |
| TRC medication reconciliation within 30 days | Plan-specific | +15 pp |
| After-hours documentation | 77% regularly work after hours (AMIA, broad) | Halve |
| 30-day readmissions (pilot cohort) | ~17% Medicare | −1–2 pp (lagging, Year-1 signal only) |
| Guardrails | Override rate on AI drafts, false-alert rate, CM NPS | Track |

---

## 12. Leverage from your prior work (credibility and speed)

- **VNH HMIS (live in a real nursing home):** you have shipped clinician software that is used daily. Transferable lessons for the deck: clinicians want **quick-select chips over free text**, **hide-empty sections** (from your report-print work, a part-filled visit went from ~4 pages to under 1), a **live status queue** (reception/vitals/doctor lines) that maps directly to a prioritized work queue, a full audit trail, and "never hard-delete." These can become a small "Why I'm credible" line, or design principles drawn from real deployment.
- **DH 308 CareConnect HIS:** a SNOMED CT + ICD-11 + LOINC + FHIR R4 implementation. **I will reuse its SNOMED subset (with ICD-10 maps) to code the synthetic annex**, and its FHIR resource mapping thinking to frame the "member 360" data model. It also gives first-hand proof for the SNOMED-umbrella opinion: you used SNOMED clinically, ICD for classification and LOINC for observations, which is exactly the recommended split.
- **Prototype path:** the reference deck had "high-fidelity interactive prototypes" (QR on the appendix). Your React + Vite + Tailwind stack plus Vercel deployment from VNH means we can build a **clickable Workbench prototype** (queue → member 360 → outreach/documentation) loaded with the 5 synthetic patients, and put a QR or link on the deck.

---

## 13. Decisions locked (7 Nov 2026)

- **Deck:** editable PPTX in the reference style, exported to PDF.
- **Research:** public sources only. Every number carries a confidence tag, and estimates are labelled as assumptions.
- **Prototype:** clickable React prototype loaded with the 5 synthetic patients, hosted on Vercel, with a small QR code on the deck.
- **Deadline:** not fixed, so we work fast in the order below.

## 14. Proposed plan from here

| Step | Output | Notes |
|---|---|---|
| **2. Lock framing** | Buyer context, persona, North-Star metric, storyline (12-slide skeleton mirroring the reference deck style) | Needs your answers to the questions below |
| **3. Day-lost model + pain ranking** | Small spreadsheet model (assumptions → minutes → %), pain points scored by impact × frequency × solvability | Optional: a 10-question survey or 3–5 calls with real case managers (Reddit r/casemanagement, LinkedIn, nursing contacts) would match the reference deck's primary research |
| **4. Data strategy** | Final dataset inventory (~20), freshness/quality matrix, 6–8 insight recipes, conflict/confidence rules | From §9 |
| **5. Synthetic annex (Excel)** | 5 patients × 8–10 datasets, SNOMED/ICD-10-CM/RxNorm/NDC/LOINC/CPT-coded, planted imperfections, 8 am Monday lines, a data dictionary tab | Built with openpyxl; codes verified |
| **6. Wireframes + prototype** | 3–4 screens: Today Queue, Member 360 (freshness/conflict), Outreach + Documentation (AI draft → confirm), optional manager capacity view. Walk 2–3 patients through. | Clickable HTML/React prototype; screenshots go into the deck |
| **7. Prioritize & measure + GTM** | MVP vs. later (RICE), metrics baseline → target, risks and mitigations, 90-day pilot, buyer, pricing signal (PMPM or per-seat) | |
| **8. Deck build** | 10–12 slides in the reference style (16:9, nav tabs, A/B/C panels, numbers-first headlines) + appendix + references | Format to confirm (PPTX vs designed PDF) |
| **9. QA** | Every number sourced, every dataset tied to a decision, no real PHI | |

---

## 15. Phase 2 status (7 Nov 2026)

| Deliverable | File | State |
|---|---|---|
| Deck (12 slides + references appendix) | `HiLabs_CM_Workbench_Deck.pptx` | Built, validated, visually checked in PowerPoint. The QR code is a placeholder until the prototype is deployed. |
| Synthetic annex (24 tabs, 16 datasets, 143 records) | `HiLabs_Synthetic_Patient_Annex.xlsx` | Built. Codes verified live against NLM ICD-10-CM, LOINC and RxNav APIs. |
| Clickable prototype | `workbench-prototype/` (React + Vite + Tailwind) | Builds clean. Deep links: `#queue`, `#member/P1`, `#outreach/P1/draft`. Not deployed yet. |
| Rebuild scripts | `_build_scripts/` | `patients.py` (data), `build_annex.py`, `build_deck.js` |

**Code databases:** we did not need the full databases.
- **ICD-10-CM, LOINC and RxNorm/NDC:** every code in the annex was checked against NLM's public APIs. Full downloads are free if ever needed: CMS (ICD-10-CM), loinc.org (free account), NLM UTS (RxNorm, free account), FDA NDC Directory.
- **CPT:** AMA-licensed, so there is no free database. We use only a handful of well-documented CPT/HCPCS codes, with our own short descriptions.
- **SNOMED CT:** used only where it occurs in real life (hospital CCD problem lists), via the DH 308 subset and the 2026-10 release.

## 16. What the two prior projects contribute

**VNH HMIS** (live; NestJS + Prisma + MySQL API; React/Vite/Tailwind app)
- *Real-time model:* every signed-in device polls `/patients` and `/queue` every **4 s** (`ClinicContext.tsx`, `REFRESH_MS`). A request-sequence guard drops stale replies. Patients from a refresh are *merged*, not replaced. Presence comes from `lastSeenAt` (`/analytics/presence`).
- *Interfaces that hand off live:* Reception → Vitals → Doctor → Lab/Sonography → Checkout → Ward/IPD → Admin. All of them share one status machine (`waiting_vitals → waiting_doctor → in_consultation → waiting_lab/sonography → awaiting_checkout → completed`), and test orders are kept separate from where the patient is standing.
- *Lessons we reused in the Workbench:* quick-select chips over free text; hide-empty sections; a live multi-line queue (it became the ranked Today queue); full audit trail with no hard deletes; role-scoped routing (reception can never open the clinical editor, which became our "clinician only" AI tier).

**DH 308 CareConnect HIS** (Next.js + Drizzle + PGlite)
- *Real-time model:* an `<AutoRefresh>` component calls `router.refresh()` every 5–15 s while the tab is visible (doctor 10 s, lab and billing 15 s, display board 5 s). It uses polling rather than websockets so it runs on free serverless hosting. A "Live · hh:mm:ss" indicator shows freshness.
- *Interfaces:* website booking → reception (registration, UHID, ABHA, check-in, token) → vitals (LOINC) → doctor (SNOMED CT + ICD-11 diagnoses, LOINC orders) → lab → billing → wards. Also a patient portal, a FHIR R4 explorer and a simulated ABDM gateway.
- *Lessons we reused:* the "Live · last updated" indicator became our per-source freshness pills; one record per UHID became identity resolution with match %; the doctor's "full patient context before consultation" pattern became Member 360; the terminology split (SNOMED clinical, ICD classification, LOINC observations) became the deck's SNOMED verdict.
- *Production note for the Workbench:* both projects poll. A payer workbench would instead push ADT events (webhook or SSE) into the queue, because a 4-second poll across thousands of CMs is wasteful. Polling is fine for the prototype.
