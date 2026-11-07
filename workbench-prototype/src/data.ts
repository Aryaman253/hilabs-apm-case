// Synthetic, fictional data for the HiLabs Case Management Workbench prototype.
// Snapshot: Monday 09 Nov 2026, 08:00. No real PHI. 555-01xx numbers are fictional.

export type Src = "ADT" | "CCD" | "Pharmacy" | "Claims" | "Labs" | "UM/PA" | "Eligibility" | "Provider dir." | "Call centre" | "CM notes" | "SDOH screen" | "HRA" | "Carrier lookup" | "HEDIS" | "Derived";
export type Conf = "high" | "medium" | "low";

export interface Fact { text: string; src: Src[]; date: string; conf: Conf; conflict?: string }
export interface Clock { label: string; due: string; daysLeft: number }
export interface TimelineItem { when: string; received?: string; src: Src; text: string; flag?: "conflict" | "late" | "missing" | "match" }
export interface MedRow { med: string; plan: string; discharge: string; fills: string; status: "match" | "conflict" | "new" | "missing" | "danger"; proposal?: string }
export interface Action { title: string; why: string; kind: "call" | "task" | "clinical" | "admin"; ai: string; owner: "Clinician decides" | "One-click confirm" | "Automated" }
export interface ContactPoint { label: string; who: string; window: string; conf: Conf | "none"; note: string; consent: string }
export interface AssessField { field: string; value: string; src: Src | "Ask member"; state: "prefilled" | "ask" | "conflict" }
export interface Freshness { src: string; asOf: string; level: "fresh" | "aging" | "stale" | "none" }

export interface Member {
  id: string; rank: number; score: number; name: string; age: number; sex: string; plan: string; memberId: string; language: string;
  program: string; scenario: string; reasons: string[]; clock?: Clock; window: string; channel: string; newSince?: string;
  authRep?: string; pcp: Fact; brief: Fact[]; freshness: Freshness[]; timeline: TimelineItem[]; meds: MedRow[]; actions: Action[];
  contacts: ContactPoint[]; assessment: AssessField[]; sdoh: Fact[]; banner?: string; identity?: string; mondayLine: string;
}

export const ME = { name: "Maria R., RN, CCM", team: "Complex CM & TOC · Ohio", cases: 48, acuityPts: 71, capacityPts: 75 };
export const NOW = "Mon 09 Nov 2026 · 08:00";

// Example answers used only by the #outreach/<id>/draft demo link.
export const DEMO_ANSWERS: Record<string, Record<string, string>> = {
  P1: { "Symptoms today (dyspnea, edema, orthopnea)": "Mild ankle swelling, no breathlessness at rest, sleeping on 2 pillows (same as usual)", "Today's weight": "89.1 kg (+0.7 kg since discharge)", "Understands HF warning signs (teach-back)": "Margaret repeated: call if >2 kg in 2 days or more breathless" },
  P3: { "Asthma Control Test": "12 (not well controlled)", "Barriers to controller (cost, understanding, side effects)": "Thought the purple inhaler was 'only for emergencies'; never picked it up", "Preferred contact + SMS consent": "Text first; SMS consent given" },
};

export const MEMBERS: Member[] = [
 {
  id: "P1", rank: 1, score: 94, name: "Harold Brennan", age: 71, sex: "M", plan: "Medicare Advantage HMO", memberId: "LHP-M-204871", language: "English",
  program: "Transitions of Care", scenario: "Fresh heart-failure discharge", newSince: "Discharged Sat 11:05",
  reasons: ["New Entresto rejected (prior auth), lisinopril still at home", "Furosemide doubled at discharge", "PCP on file left the practice"],
  clock: { label: "TRC 2-business-day contact", due: "Tue 10 Nov", daysLeft: 1 }, window: "Now–11:00", channel: "Call home landline",
  authRep: "Margaret Brennan (spouse) · HIPAA authorization on file",
  pcp: { text: "Dr. A. Whitcomb is INACTIVE (left 30 Sep). Suggested: Dr. P. Nair, same group, accepting, Thu 12 Nov 10:30", src: ["Provider dir.", "Eligibility"], date: "06 Nov", conf: "high", conflict: "834 still lists Dr. Whitcomb" },
  brief: [
   { text: "Admitted Tue 3 Nov → discharged Sat 7 Nov for acute-on-chronic systolic heart failure (LVEF 30%). Discharge weight 88.4 kg.", src: ["ADT", "CCD"], date: "08 Nov", conf: "high" },
   { text: "New: sacubitril/valsartan 24/26 mg BID. Pharmacy REJECTED it Sat 15:20 (prior auth required). The PA team is asking for the LVEF, which is already in the CCD.", src: ["Pharmacy", "UM/PA", "CCD"], date: "08 Nov", conf: "high" },
   { text: "Lisinopril was refilled 20 Oct and is still at home. The discharge list says STOP. Taking it with Entresto risks angioedema, so the two need a 36 h washout.", src: ["Pharmacy", "CCD"], date: "08 Nov", conf: "high", conflict: "3 lists disagree" },
   { text: "Furosemide changed from 20 mg to 40 mg daily. His remaining supply now ends around 1 Dec.", src: ["CCD", "Pharmacy"], date: "08 Nov", conf: "high" },
   { text: "K+ 5.1, creatinine 1.6, eGFR 44 (6 Nov). NT-proBNP 4,850 (3 Nov).", src: ["Labs"], date: "08 Nov", conf: "high" },
   { text: "Discharge summary has no follow-up provider and no pending-results section. Nobody has booked the 7-day visit.", src: ["CCD"], date: "08 Nov", conf: "medium" },
  ],
  freshness: [
   { src: "ADT", asOf: "Sat 11:40", level: "fresh" }, { src: "Discharge CCD", asOf: "Sun 10:12 (partial)", level: "fresh" }, { src: "Pharmacy", asOf: "Sat 15:20", level: "fresh" },
   { src: "Labs", asOf: "Sun", level: "fresh" }, { src: "Claims", asOf: "complete through 18 Sep", level: "stale" }, { src: "SDOH", asOf: "Feb 2026", level: "aging" },
  ],
  timeline: [
   { when: "Sun 08 Nov 10:12", src: "CCD", text: "Discharge summary received · follow-up provider: not provided", flag: "missing" },
   { when: "Sat 07 Nov 16:02", src: "UM/PA", text: "PA-77812 opened · pending, LVEF documentation requested" },
   { when: "Sat 07 Nov 15:20", src: "Pharmacy", text: "Entresto 24/26 claim REJECTED · NCPDP 75 prior auth required", flag: "conflict" },
   { when: "Sat 07 Nov 11:05", received: "11:40", src: "ADT", text: "A03 discharge · home/self-care · I50.23" },
   { when: "Tue 03 Nov 14:12", received: "14:20", src: "ADT", text: "A01 inpatient admit · Riverton General · diagnosis: not sent", flag: "missing" },
   { when: "Tue 03 Nov 09:48", src: "ADT", text: "A04 ED registration · reason not sent" },
   { when: "Tue 20 Oct", src: "Pharmacy", text: "Lisinopril 20 mg ×30 and carvedilol filled" },
   { when: "Fri 21 Aug", received: "18 Sep (+28 d)", src: "Claims", text: "Cardiology visit 99214 · I50.22, I11.0", flag: "late" },
  ],
  meds: [
   { med: "lisinopril 20 mg daily", plan: "Listed", discharge: "STOP", fills: "Filled 20 Oct · at home", status: "danger", proposal: "Keep it until the Entresto switch, with a 36 h washout before the first dose. Confirm with the cardiologist." },
   { med: "sacubitril/valsartan 24/26 mg BID", plan: "—", discharge: "NEW", fills: "Rejected · PA pending", status: "new", proposal: "Send the LVEF 30% excerpt to the PA team" },
   { med: "furosemide", plan: "20 mg daily", discharge: "40 mg daily", fills: "40 mg tabs, taking ½", status: "conflict", proposal: "Confirm 1 full tablet daily, plus daily weights" },
   { med: "carvedilol 12.5 mg BID", plan: "Listed", discharge: "Continue", fills: "Filled 20 Oct", status: "match" },
  ],
  actions: [
   { title: "Call Harold and Margaret now (home landline)", why: "TRC clock closes tomorrow; connects 2/2 times in the morning", kind: "call", ai: "Call guide pre-built from the 3-way med conflict", owner: "Clinician decides" },
   { title: "Reconcile meds: lisinopril / Entresto / furosemide", why: "The 3 lists disagree; 36 h ACE-inhibitor washout rule", kind: "clinical", ai: "Diff + proposed resolution drafted", owner: "Clinician decides" },
   { title: "Send the LVEF evidence to PA-77812", why: "PA pending for info that is already in the CCD", kind: "admin", ai: "Excerpt prepared", owner: "One-click confirm" },
   { title: "Book Dr. P. Nair, Thu 12 Nov 10:30", why: "PCP on file is inactive; this slot is inside the 7-day window", kind: "task", ai: "Slot found via provider directory", owner: "One-click confirm" },
   { title: "Start daily-weight check-ins (Margaret by SMS)", why: "Gain of more than 2 kg in 2 days means call the cardiologist", kind: "task", ai: "SMS schedule drafted", owner: "One-click confirm" },
  ],
  contacts: [
   { label: "555-0142 · home landline", who: "Harold", window: "Mornings 9–11 (2/2 connects)", conf: "high", note: "Verified 25 Aug", consent: "Voice" },
   { label: "555-0144 · mobile", who: "Margaret (spouse, authorized)", window: "Any time", conf: "high", note: "Manages his meds", consent: "Voice · SMS" },
  ],
  assessment: [
   { field: "Reason for admission", value: "Acute on chronic systolic HF", src: "CCD", state: "prefilled" },
   { field: "Discharge date / disposition", value: "07 Nov 2026 · home", src: "ADT", state: "prefilled" },
   { field: "LVEF", value: "30%", src: "CCD", state: "prefilled" },
   { field: "Discharge weight", value: "88.4 kg", src: "CCD", state: "prefilled" },
   { field: "Current medications", value: "4 meds · 3 in conflict", src: "Pharmacy", state: "conflict" },
   { field: "PCP / follow-up appointment", value: "PCP inactive · suggest Dr. Nair Thu 12 Nov", src: "Provider dir.", state: "conflict" },
   { field: "Caregiver / authorized rep", value: "Margaret (spouse)", src: "Eligibility", state: "prefilled" },
   { field: "Symptoms today (dyspnea, edema, orthopnea)", value: "", src: "Ask member", state: "ask" },
   { field: "Today's weight", value: "", src: "Ask member", state: "ask" },
   { field: "Understands HF warning signs (teach-back)", value: "", src: "Ask member", state: "ask" },
   { field: "Food security / transport", value: "No needs (Feb 2026 · 9 mo old)", src: "SDOH screen", state: "prefilled" },
  ],
  sdoh: [
   { text: "No food or transport needs (wife drives)", src: ["SDOH screen"], date: "Feb 2026", conf: "medium" },
  ],
  mondayLine: "",
 },
 {
  id: "P4", rank: 2, score: 91, name: "Tanya Brooks", age: 33, sex: "F", plan: "Medicaid MCO", memberId: "LHP-C-702264", language: "English",
  program: "Behavioral Health CM (co-owner: Jordan K., LCSW)", scenario: "BH discharge + housing loss + MAT continuity", newSince: "Discharged Thu 16:30",
  reasons: ["No BH visit booked for the FUH 7-day window", "Buprenorphine runs out ~Wed and is missing from the discharge list", "Now at a shelter; phone out of minutes"],
  clock: { label: "FUH 7-day follow-up", due: "Thu 12 Nov", daysLeft: 3 }, window: "09:00–11:00 (shelter desk)", channel: "Shelter desk, no-PHI callback",
  banner: "42 CFR Part 2: additional SUD treatment records exist but are restricted (no consent on file). Request consent on the call.",
  pcp: { text: "Riverton CHC (FQHC) · BH telehealth Tue 10 Nov 14:00 available", src: ["Provider dir."], date: "06 Nov", conf: "high" },
  brief: [
   { text: "Inpatient psych 29 Oct → 5 Nov for recurrent severe MDD. PHQ-9 went from 24 to 14. Safety plan attached.", src: ["ADT", "CCD"], date: "06 Nov", conf: "high" },
   { text: "Buprenorphine/naloxone 8/2 mg was filled 28 Oct for 14 days and runs out about 11 Nov. It is NOT on the discharge med list.", src: ["Pharmacy", "CCD"], date: "06 Nov", conf: "high", conflict: "Discharge list omits it" },
   { text: "The discharge address is Riverton Women's Shelter. The 834 still shows her old apartment, and her March SDOH screen said 'I have housing'.", src: ["ADT", "Eligibility", "SDOH screen"], date: "05 Nov", conf: "high", conflict: "Address and housing changed" },
   { text: "Her prepaid phone is out of minutes: Friday's calls failed and an SMS went unanswered. The shelter desk (555-0160) is listed as her contact.", src: ["CM notes", "ADT"], date: "06 Nov", conf: "medium" },
   { text: "BH referral REF-30011 is open but not scheduled. Co-owner Jordan K. (LCSW) has not been notified of the discharge.", src: ["UM/PA", "CM notes"], date: "05 Nov", conf: "high" },
  ],
  freshness: [
   { src: "ADT", asOf: "Thu 16:55", level: "fresh" }, { src: "Discharge CCD", asOf: "Fri 14:00", level: "fresh" }, { src: "Pharmacy", asOf: "Thu", level: "fresh" },
   { src: "Claims", asOf: "complete through 24 Sep", level: "stale" }, { src: "SDOH", asOf: "Mar 2026 (contradicted)", level: "stale" }, { src: "Part 2 records", asOf: "restricted", level: "none" },
  ],
  timeline: [
   { when: "Fri 06 Nov 14:00", src: "CCD", text: "Discharge summary: sertraline 100, trazodone 50 · buprenorphine not listed", flag: "conflict" },
   { when: "Fri 06 Nov 10:00", src: "CM notes", text: "Call to 555-0126: 'call cannot be completed'; SMS delivered, no reply" },
   { when: "Thu 05 Nov 16:30", received: "16:55", src: "ADT", text: "A03 discharge · F33.2 · address: shelter · NK1 shelter desk" },
   { when: "Thu 05 Nov", src: "Pharmacy", text: "Sertraline 100 mg + trazodone filled" },
   { when: "Thu 29 Oct 18:20", received: "next day 09:00", src: "ADT", text: "A01 admit · Northgate Behavioral Health · diagnosis not sent", flag: "late" },
   { when: "Wed 28 Oct", src: "Pharmacy", text: "Buprenorphine/naloxone 8/2 mg · 14 days" },
  ],
  meds: [
   { med: "buprenorphine/naloxone 8/2 mg SL daily", plan: "Listed (Jul)", discharge: "ABSENT", fills: "28 Oct · runs out ~11 Nov", status: "danger", proposal: "Ask the member and prescriber; bridge Rx before Wed" },
   { med: "sertraline", plan: "50 mg", discharge: "100 mg", fills: "100 mg · 5 Nov", status: "conflict", proposal: "Update plan list to 100 mg" },
   { med: "trazodone 50 mg qHS", plan: "—", discharge: "NEW", fills: "5 Nov", status: "new" },
  ],
  actions: [
   { title: "Call the shelter desk: no-PHI callback request", why: "Her phone is out of minutes; the desk is reachable mornings", kind: "call", ai: "Script drafted with minimum-necessary wording", owner: "Clinician decides" },
   { title: "Hold BH telehealth Tue 10 Nov 14:00 (Wi-Fi link by SMS)", why: "FUH window closes Thu", kind: "task", ai: "Slot found", owner: "One-click confirm" },
   { title: "Ask the prescriber for a buprenorphine bridge", why: "Supply ends ~Wed and she is missing from the discharge list", kind: "clinical", ai: "Message drafted", owner: "Clinician decides" },
   { title: "Notify the co-owner Jordan K. (LCSW)", why: "BH lead was not told about the discharge", kind: "admin", ai: "Hand-off note drafted", owner: "One-click confirm" },
   { title: "Start the phone benefit + housing navigator referrals", why: "Root cause of being unreachable", kind: "task", ai: "Referrals pre-filled", owner: "One-click confirm" },
  ],
  contacts: [
   { label: "555-0160 · shelter front desk", who: "Shelter staff (no PHI)", window: "Mornings", conf: "medium", note: "From ADT discharge NK1", consent: "Callback request only" },
   { label: "SMS telehealth link", who: "Tanya (Wi-Fi)", window: "Any", conf: "medium", note: "Works without minutes on Wi-Fi", consent: "SMS" },
   { label: "555-0126 · prepaid mobile", who: "Tanya", window: "—", conf: "low", note: "Out of minutes since Fri", consent: "Voice · SMS" },
  ],
  assessment: [
   { field: "Discharge diagnosis", value: "MDD recurrent severe, w/o psychotic features", src: "CCD", state: "prefilled" },
   { field: "PHQ-9 (admit / discharge)", value: "24 / 14", src: "CCD", state: "prefilled" },
   { field: "Current housing", value: "Shelter (ADT 5 Nov), was 'housed' in Mar", src: "ADT", state: "conflict" },
   { field: "Medications", value: "3 active · 1 missing from discharge list", src: "Pharmacy", state: "conflict" },
   { field: "Safety check today (C-SSRS screen)", value: "", src: "Ask member", state: "ask" },
   { field: "Part 2 consent for SUD records", value: "", src: "Ask member", state: "ask" },
   { field: "Phone access / best way to reach", value: "", src: "Ask member", state: "ask" },
  ],
  sdoh: [
   { text: "Housing: shelter since ~Oct (newer source overrides the March screen)", src: ["ADT"], date: "05 Nov", conf: "high", conflict: "March PRAPARE said 'housed'" },
   { text: "Phone: prepaid, frequently out of minutes", src: ["CM notes"], date: "06 Nov", conf: "high" },
  ],
  mondayLine: "",
 },
 {
  id: "P5", rank: 3, score: 86, name: "Thi Mai Tran", age: 82, sex: "F", plan: "D-SNP (dual)", memberId: "LHP-D-310455", language: "Vietnamese (daughter: English)",
  program: "D-SNP Model of Care", scenario: "Second fall · NSAID with CKD 4 · caregiver strain", newSince: "ED discharge Fri 23:50",
  reasons: ["ED prescribed ibuprofen 600 mg with eGFR 22 (CKD 4)", "Second fall in 5 months", "Daughter: 'I can't keep doing this'"],
  clock: { label: "Post-fall HRA reassessment", due: "06 Dec (plan policy)", daysLeft: 27 }, window: "Pharmacy now · daughter after 17:00", channel: "Pharmacist call, then daughter",
  authRep: "Linh Tran (daughter, caregiver) · HIPAA authorization on file",
  identity: "Probable duplicate record: LHP-C-118902 (legacy Medicaid) matches on name, DOB and address (99%). An open LTSS case is owned by Dana P.",
  pcp: { text: "Dr. H. Pham, Lakeside Geriatrics (speaks Vietnamese) · next slot Fri 13 Nov", src: ["Provider dir."], date: "06 Nov", conf: "high" },
  brief: [
   { text: "ED Fri 6 Nov: night-time fall at home, no fracture, scalp contusion. This is her second fall since June.", src: ["ADT", "CCD", "Claims"], date: "07 Nov", conf: "high" },
   { text: "The ED prescribed ibuprofen 600 mg TID ×10 days, filled Sat at a second pharmacy (NightOwl). She has CKD 4 (eGFR 22) and K+ 5.4 (Sep).", src: ["Pharmacy", "Labs", "CCD"], date: "07 Nov", conf: "high", conflict: "Drug–condition" },
   { text: "On 30 Oct her daughter told member services: 'Mom is up all night wandering, I can't keep doing this.' The note was never routed to case management.", src: ["Call centre"], date: "30 Oct", conf: "medium" },
   { text: "The personal care services (PCS) assessment has been pending with the state for 39 days. It sits on the legacy record (owner Dana P.).", src: ["UM/PA"], date: "06 Nov", conf: "high" },
  ],
  freshness: [
   { src: "ADT", asOf: "Sat 00:05", level: "fresh" }, { src: "ED CCD", asOf: "Sat 00:20", level: "fresh" }, { src: "Pharmacy", asOf: "Sat", level: "fresh" },
   { src: "Labs (eGFR)", asOf: "18 Sep · 51 d", level: "aging" }, { src: "Claims", asOf: "complete through 30 Aug", level: "stale" }, { src: "HRA", asOf: "Feb 2026", level: "aging" },
  ],
  timeline: [
   { when: "Sat 07 Nov", src: "Pharmacy", text: "Ibuprofen 600 mg filled at NightOwl 24h (not her usual pharmacy)", flag: "conflict" },
   { when: "Fri 06 Nov 23:50", received: "00:05", src: "ADT", text: "ED discharge · W19.XXXA · S0003XA normalised → S00.03XA" },
   { when: "Fri 30 Oct 18:20", src: "Call centre", text: "Daughter reports wandering at night and caregiver exhaustion" },
   { when: "Thu 01 Oct", src: "UM/PA", text: "PCS/HCBS assessment requested · pending state assessor" },
   { when: "Fri 18 Sep", src: "Labs", text: "eGFR 22 · K+ 5.4" },
   { when: "Wed 10 Jun", received: "08 Jul (+28 d)", src: "Claims", text: "ED · fall #1 · W19.XXXA, N18.4, G30.9", flag: "late" },
  ],
  meds: [
   { med: "ibuprofen 600 mg TID", plan: "—", discharge: "ED Rx 6 Nov", fills: "7 Nov · 2nd pharmacy", status: "danger", proposal: "Ask the ED prescriber or Dr. Pham for an alternative (e.g. acetaminophen). Clinician decides." },
   { med: "donepezil 10 mg qHS", plan: "Listed", discharge: "Not mentioned", fills: "15 Oct", status: "match" },
   { med: "amlodipine 5 mg", plan: "Listed", discharge: "Not mentioned", fills: "15 Oct", status: "match" },
   { med: "calcitriol 0.25 mcg", plan: "Listed", discharge: "Not mentioned", fills: "15 Oct", status: "match" },
  ],
  actions: [
   { title: "Call NightOwl pharmacy / ED prescriber about the ibuprofen", why: "NSAID + CKD 4 + K 5.4: act before the next dose", kind: "clinical", ai: "Drug–condition evidence packet drafted", owner: "Clinician decides" },
   { title: "Merge the duplicate record and coordinate with Dana P.", why: "Two cases, one member; the PCS assessment is stalled", kind: "admin", ai: "Merge request prepared (99% match)", owner: "One-click confirm" },
   { title: "Call Linh after 17:00: caregiver check (Zarit-4)", why: "Strain signal on 30 Oct + second fall", kind: "call", ai: "Call guide with respite and PCS options", owner: "Clinician decides" },
   { title: "Request home safety eval + PT/OT", why: "2 falls in 5 months; night wandering", kind: "task", ai: "Home-health request pre-filled", owner: "One-click confirm" },
   { title: "Trigger the post-fall HRA reassessment (interpreter: Vietnamese)", why: "SNP Model of Care: significant change", kind: "task", ai: "HRA pre-filled from known data", owner: "One-click confirm" },
  ],
  contacts: [
   { label: "555-0151 · daughter mobile", who: "Linh (authorized caregiver)", window: "After 17:00 (works days)", conf: "high", note: "Inbound 30 Oct", consent: "Voice · SMS" },
   { label: "NightOwl 24h pharmacy", who: "Pharmacist", window: "Now", conf: "high", note: "Filled the NSAID", consent: "Provider-to-provider" },
   { label: "555-0109 · legacy home line", who: "—", window: "—", conf: "none", note: "Disconnected: suppressed", consent: "—" },
  ],
  assessment: [
   { field: "Falls in last 6 months", value: "2 (Jun, Nov)", src: "Claims", state: "prefilled" },
   { field: "Cognition (MoCA)", value: "14/30 (Feb)", src: "HRA", state: "prefilled" },
   { field: "Kidney function", value: "eGFR 22 · K 5.4 (Sep)", src: "Labs", state: "prefilled" },
   { field: "Medication safety", value: "NSAID with CKD 4", src: "Pharmacy", state: "conflict" },
   { field: "Caregiver burden (Zarit-4)", value: "", src: "Ask member", state: "ask" },
   { field: "Night-time wandering / supervision", value: "", src: "Ask member", state: "ask" },
   { field: "Home hazards (rugs, stairs, lighting)", value: "", src: "Ask member", state: "ask" },
  ],
  sdoh: [
   { text: "Lives with daughter + 2 grandchildren; daughter works full-time", src: ["HRA"], date: "Feb 2026", conf: "medium" },
   { text: "Caregiver strain signal (call centre)", src: ["Call centre"], date: "30 Oct", conf: "medium" },
  ],
  mondayLine: "",
 },
 {
  id: "P3", rank: 4, score: 78, name: "Tyler Kowalski", age: 29, sex: "M", plan: "Medicaid MCO", memberId: "LHP-C-640127", language: "English",
  program: "Complex CM · high ED use", scenario: "Unreachable frequent ED user, severe asthma", newSince: "ED visit Sun 02:14",
  reasons: ["4 ED visits in 77 days (latest Sunday)", "6 rescue-inhaler fills, 0 controller fills (AMR 0.0)", "Number on file now belongs to someone else"],
  window: "12:00–14:00 (not driving hours)", channel: "SMS then call new mobile",
  identity: "Sunday's ED record ('Tyler Kowalsky', DOB 11/03 vs 03/11) matched at 92%. Confirm identity on the first call (below the 95% auto-merge threshold).",
  pcp: { text: "Dr. S. Okoye, Eastside Primary Care · attributed 18 months, never seen · Wed 11 Nov open", src: ["Provider dir.", "Claims"], date: "06 Nov", conf: "high" },
  brief: [
   { text: "4 ED visits for severe persistent asthma exacerbations: 24 Aug, 19 Sep, 21 Oct and 8 Nov. Claims show only 2 of them so far.", src: ["ADT", "Claims"], date: "08 Nov", conf: "high", conflict: "Claims lag" },
   { text: "Albuterol filled 6 times in 10 weeks, always on Saturdays 18:00–20:00 at QuickRx #214. The Symbicort controller was prescribed twice (Aug, Nov) and never filled.", src: ["Pharmacy", "CCD"], date: "07 Nov", conf: "high" },
   { text: "555-0177 was reassigned in Sep (a 'Rita' answered on 2 Nov). Sunday's ED registration captured a new mobile, 555-0193.", src: ["Carrier lookup", "ADT", "CM notes"], date: "08 Nov", conf: "medium" },
   { text: "No labs and no SDOH screen on file. Rideshare driver (ED note).", src: ["CCD"], date: "08 Nov", conf: "low" },
  ],
  freshness: [
   { src: "ADT", asOf: "Sun 05:52", level: "fresh" }, { src: "ED CCD", asOf: "Sun 06:30", level: "fresh" }, { src: "Pharmacy", asOf: "Sat", level: "fresh" },
   { src: "Claims", asOf: "complete through 27 Oct", level: "aging" }, { src: "SDOH", asOf: "never screened", level: "none" }, { src: "Labs", asOf: "none in 12 mo", level: "none" },
  ],
  timeline: [
   { when: "Sun 08 Nov 02:14", received: "05:52", src: "ADT", text: "ED · St. Brigid · J45.51 · new phone 555-0193 · identity match 92%", flag: "match" },
   { when: "Sat 07 Nov 18:40", src: "Pharmacy", text: "Albuterol MDI fill #6 · QuickRx #214" },
   { when: "Mon 02 Nov 12:40", src: "CM notes", text: "Outreach to 555-0177: 'wrong number, this is Rita'", flag: "conflict" },
   { when: "Wed 21 Oct 23:40", received: "23 Oct (+2 d)", src: "ADT", text: "ED · St. Brigid · reason not sent", flag: "late" },
   { when: "Sat 19 Sep 01:05", received: "21 Sep (+2 d)", src: "ADT", text: "ED · St. Brigid", flag: "late" },
   { when: "Mon 24 Aug 22:31", src: "ADT", text: "ED · Riverton General · J45.51 · Symbicort prescribed" },
  ],
  meds: [
   { med: "budesonide/formoterol 160/4.5, 2 puffs BID", plan: "—", discharge: "Prescribed Aug + Nov", fills: "Never filled", status: "missing", proposal: "Ask why (cost? understanding?). Medicaid $0 copay; arrange a fill at QuickRx #214" },
   { med: "albuterol MDI PRN", plan: "Listed", discharge: "Continue", fills: "6 fills / 10 wks", status: "conflict", proposal: "Over-use signals poor control: flag for the PCP" },
   { med: "prednisone 20 mg burst", plan: "—", discharge: "5 days", fills: "25 Aug", status: "match" },
  ],
  actions: [
   { title: "SMS, then call 555-0193 at 12:00 (identity check first)", why: "The old number is reassigned; this one came from Sunday's ED registration", kind: "call", ai: "SMS text drafted; identity questions pre-loaded", owner: "Clinician decides" },
   { title: "Suppress 555-0177 in the dialler", why: "Reassigned number: TCPA risk and wasted attempts", kind: "admin", ai: "Detected by carrier lookup", owner: "Automated" },
   { title: "Leave a pharmacist note at QuickRx #214 (Sat pickup)", why: "The one place he reliably shows up", kind: "task", ai: "Note drafted (Rx-only content)", owner: "One-click confirm" },
   { title: "Book Dr. Okoye Wed 11 Nov · asthma action plan", why: "Attributed PCP never seen; AMR 0.0", kind: "task", ai: "Slot found", owner: "One-click confirm" },
  ],
  contacts: [
   { label: "555-0193 · new mobile", who: "Tyler (match 92%)", window: "12:00–14:00", conf: "medium", note: "From ED registration 08 Nov", consent: "Ask on the first call" },
   { label: "QuickRx #214", who: "Pharmacist", window: "Sat 18:00–20:00", conf: "medium", note: "6/6 fills here", consent: "Rx-only message" },
   { label: "555-0177", who: "Not Tyler (reassigned Sep)", window: "—", conf: "none", note: "Suppressed", consent: "—" },
  ],
  assessment: [
   { field: "ED visits last 90 days", value: "4", src: "ADT", state: "prefilled" },
   { field: "Controller medication", value: "Prescribed, never filled", src: "Pharmacy", state: "conflict" },
   { field: "Asthma Control Test", value: "", src: "Ask member", state: "ask" },
   { field: "Barriers to controller (cost, understanding, side effects)", value: "", src: "Ask member", state: "ask" },
   { field: "SDOH: housing, food, transport, utilities", value: "Never screened", src: "Ask member", state: "ask" },
   { field: "Preferred contact + SMS consent", value: "", src: "Ask member", state: "ask" },
  ],
  sdoh: [{ text: "Never screened. Three priority questions have been added to the call guide.", src: ["Derived"], date: "—", conf: "low" }],
  mondayLine: "",
 },
 {
  id: "P2", rank: 5, score: 61, name: "Denise Carter", age: 54, sex: "F", plan: "Medicaid MCO (expansion)", memberId: "LHP-C-558213", language: "English",
  program: "Diabetes · rising risk", scenario: "Stopped refills (access, not willpower)",
  reasons: ["A1c 7.4% → 9.8% in 5 months", "Metformin refills ran out; Jardiance rejected after a formulary change", "Answers only in the evening (works days)"],
  window: "After 18:30", channel: "SMS now, call 18:30",
  pcp: { text: "Riverton CHC (FQHC) · evening clinic Tue/Thu until 19:00", src: ["Provider dir."], date: "06 Nov", conf: "high" },
  brief: [
   { text: "A1c rose from 7.4% (May) to 9.8% (22 Oct). A second feed reported the same result as 84 mmol/mol, so it is shown once.", src: ["Labs"], date: "24 Oct", conf: "high" },
   { text: "The metformin Rx has 0 refills left, so she ran out around 31 Aug. She needs a PCP renewal and has not been seen since May.", src: ["Pharmacy", "Claims"], date: "06 Nov", conf: "high" },
   { text: "Jardiance was REJECTED on 16 Aug because the state removed it from the preferred drug list on 1 Aug. On 14 Oct she called member services about a $580 cash price, and the call was never routed to case management.", src: ["Pharmacy", "Call centre"], date: "14 Oct", conf: "high" },
   { text: "Two daytime calls failed (voicemail full). Her inbound call came at 19:42, and she works days plus night shifts.", src: ["CM notes", "Call centre"], date: "30 Oct", conf: "medium" },
   { text: "The plan risk model still says LOW (0.9). It uses only June claims and cannot see labs or fills.", src: ["Derived"], date: "30 Jun", conf: "low", conflict: "Stale model" },
  ],
  freshness: [
   { src: "Labs", asOf: "24 Oct", level: "aging" }, { src: "Pharmacy", asOf: "06 Nov", level: "fresh" }, { src: "Claims", asOf: "complete through 02 Jun", level: "stale" },
   { src: "SDOH", asOf: "Jan 2026 · 10 mo", level: "stale" }, { src: "Risk model", asOf: "30 Jun", level: "stale" },
  ],
  timeline: [
   { when: "Thu 22 Oct", received: "24 Oct", src: "Labs", text: "HbA1c 9.8% (+ duplicate 84 mmol/mol, merged)", flag: "match" },
   { when: "Wed 14 Oct 19:42", src: "Call centre", text: "'Why is my diabetes pill not covered anymore? Pharmacy wanted $580'", flag: "missing" },
   { when: "Sun 16 Aug", src: "Pharmacy", text: "Jardiance REJECTED · NCPDP 70 not covered (PDL change 1 Aug)", flag: "conflict" },
   { when: "Tue 02 Jun", src: "Pharmacy", text: "Metformin 1000 mg ×90 · last refill on the Rx" },
   { when: "Tue 12 May", received: "02 Jun (+21 d)", src: "Claims", text: "PCP visit 99213 · A1c 7.4%" },
  ],
  meds: [
   { med: "metformin 1000 mg BID", plan: "Listed", discharge: "—", fills: "Ran out ~31 Aug (0 refills)", status: "missing", proposal: "Ask the FQHC for a 90-day renewal" },
   { med: "empagliflozin 10 mg [Jardiance]", plan: "Listed", discharge: "—", fills: "Rejected 16 Aug (PDL)", status: "conflict", proposal: "Preferred SGLT2 inhibitor or a PA (prescriber decides)" },
   { med: "atorvastatin 40 mg", plan: "Listed", discharge: "—", fills: "02 Sep ×90", status: "match" },
  ],
  actions: [
   { title: "Send an SMS now asking for a call after 18:30", why: "Her only connects are in the evening; SMS consent on file", kind: "call", ai: "Plain-language SMS drafted", owner: "One-click confirm" },
   { title: "Ask the FQHC for a metformin renewal + preferred SGLT2i", why: "Access barrier, not adherence", kind: "clinical", ai: "Provider message drafted with the PDL info", owner: "Clinician decides" },
   { title: "Book the Thursday evening clinic (until 19:00)", why: "Not seen since May; A1c 9.8%", kind: "task", ai: "Slot found", owner: "One-click confirm" },
   { title: "Re-screen for food insecurity on the call", why: "Last screen 10 months old said 'sometimes'", kind: "task", ai: "Question added to the call guide", owner: "Automated" },
  ],
  contacts: [
   { label: "555-0118 · mobile", who: "Denise", window: "After 18:30", conf: "medium", note: "Voicemail full · inbound 19:42", consent: "Voice · SMS" },
  ],
  assessment: [
   { field: "Latest A1c", value: "9.8% (22 Oct)", src: "Labs", state: "prefilled" },
   { field: "Diabetes medications", value: "2 of 3 not being taken (access)", src: "Pharmacy", state: "conflict" },
   { field: "Work schedule / constraints", value: "Two jobs (days + nights)", src: "CM notes", state: "prefilled" },
   { field: "Food insecurity (re-screen)", value: "'Sometimes' (Jan · stale)", src: "SDOH screen", state: "conflict" },
   { field: "Hypoglycaemia / symptoms", value: "", src: "Ask member", state: "ask" },
   { field: "Goal she chooses", value: "", src: "Ask member", state: "ask" },
  ],
  sdoh: [
   { text: "Food insecurity: 'sometimes true'", src: ["SDOH screen"], date: "Jan 2026 · 10 mo", conf: "low" },
   { text: "Works two jobs: days and nights", src: ["CM notes"], date: "May 2026", conf: "medium" },
  ],
  mondayLine: "",
 },
];

// Background cases so the queue looks like a real Monday (48 active).
export const OTHERS = [
 { name: "R. Alvarez", program: "TOC · COPD", reason: "Day 9 post-discharge · visit kept", score: 44, window: "Any" },
 { name: "J. Whitaker", program: "Complex CM · CKD 4", reason: "Monthly check-in due this week", score: 38, window: "Afternoon" },
 { name: "P. Moreau", program: "DM · HF", reason: "Daily weights stable 14 days", score: 22, window: "Morning" },
 { name: "S. Iyer", program: "Maternity · 32 wks", reason: "BP log normal · prenatal visit kept", score: 35, window: "Evening" },
 { name: "D. Novak", program: "D-SNP MOC", reason: "Quarterly ICP review due 20 Nov", score: 30, window: "Morning" },
 { name: "L. Haddad", program: "BH CM", reason: "FUH 30-day met · step-down candidate", score: 18, window: "Any" },
];
