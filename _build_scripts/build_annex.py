import sys, json, os
sys.path.insert(0, os.path.dirname(__file__))
from patients import *
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

OUT = sys.argv[1]
NAVY = "0B1F4B"; AMBER = "FFF2CC"; GREEN = "E2F0D9"; GREY = "F2F2F2"
thin = Side(style="thin", color="D0D0D0")
B = Border(left=thin, right=thin, top=thin, bottom=thin)
wb = Workbook()
names = {p["pid"]: p["name"] for p in PATIENTS}

def sheet(title, cols, rows, widths=None, imp_cols=("Planted imperfection",), note=None):
    ws = wb.create_sheet(title)
    r0 = 1
    if note:
        ws.cell(1, 1, note).font = Font(italic=True, color="555555")
        r0 = 3
    for j, c in enumerate(cols, 1):
        cell = ws.cell(r0, j, c)
        cell.font = Font(bold=True, color="FFFFFF"); cell.fill = PatternFill("solid", fgColor=NAVY)
        cell.alignment = Alignment(wrap_text=True, vertical="center"); cell.border = B
    imp_idx = [cols.index(c) for c in imp_cols if c in cols]
    for i, row in enumerate(rows, r0 + 1):
        row = list(row)
        if cols[0] == "Patient" and row[0] in names:
            row[0] = f"{row[0]} - {names[row[0]]}"
        flagged = any(str(row[k]).strip() for k in imp_idx)
        for j, v in enumerate(row, 1):
            cell = ws.cell(i, j, v)
            cell.alignment = Alignment(wrap_text=True, vertical="top"); cell.border = B
            if flagged and (j - 1) in imp_idx + [len(cols) - 1]:
                cell.fill = PatternFill("solid", fgColor=AMBER)
    for j, c in enumerate(cols, 1):
        w = (widths or {}).get(c)
        if not w:
            longest = max([len(str(c))] + [len(str(r[j - 1])) for r in rows])
            w = min(max(10, longest * 0.9), 55)
        ws.column_dimensions[get_column_letter(j)].width = w
    ws.freeze_panes = ws.cell(r0 + 1, 2)
    ws.auto_filter.ref = f"A{r0}:{get_column_letter(len(cols))}{r0 + len(rows)}"
    return ws

# ---------------- README ----------------
ws = wb.active; ws.title = "README"
lines = [
 ("HiLabs APM Case - Synthetic Data Annex: Case Management Workbench", True),
 (f"Snapshot: {AS_OF}. Plan: {PLAN}", False),
 ("ALL DATA IS FICTIONAL. No real PHI. Phone numbers use the reserved fictional 555-01xx range; people, hospitals, pharmacies and the plan are invented.", True),
 ("", False),
 ("How to read this workbook", True),
 ("1. Patient_Summary: the 5 patients, the scenario each one stresses, the Monday 8 am queue rank and the '8 am Monday' line.", False),
 ("2. One tab per dataset (14 datasets). Every row carries real, verified codes (ICD-10-CM, CPT/HCPCS, NDC, RxNorm, LOINC, SNOMED CT).", False),
 ("3. Amber cells = planted imperfections, plus how the workbench handles each one.", False),
 ("4. Insights: how datasets COMBINE into what Maria sees, and what she does differently because of it.", False),
 ("5. Dataset_Inventory: every dataset with source, freshness, quality issues, handling and priority (feeds slide B).", False),
 ("6. Day_Lost_Model: assumptions to minutes to share of the day. Edit the blue input cells and the model recalculates (feeds slide A).", False),
 ("7. Metrics: baseline to target (feeds slide E). 8. Code_Verification and Sources.", False),
 ("", False),
 ("Datasets used per patient (at least 6 required; each patient has 11-14)", True),
]
for i, (t, b) in enumerate(lines, 1):
    c = ws.cell(i, 1, t); c.font = Font(bold=b, size=14 if i == 1 else 11, color=NAVY if b else "000000")
ws.column_dimensions["A"].width = 130

# coverage matrix
datasets = [("Eligibility", ELIGIBILITY), ("ADT alerts", ADT), ("Medical claims", CLAIMS), ("Pharmacy fills", PHARM),
            ("Labs & observations", LABS), ("Clinical documents", DOCS), ("Med reconciliation", MEDREC), ("Prior auth / UM", UM),
            ("Contact history", CONTACTS), ("Contact points", CONTACTPTS), ("SDOH / HRA", SDOH), ("Care plan / case", CAREPLAN),
            ("Care gaps & clocks", GAPS), ("Provider directory", PROV), ("Appointments", APPTS), ("Risk scores", RISK)]
r = len(lines) + 1
ws.cell(r, 1, "Dataset  |  " + "  |  ".join(f"{p['pid']} {p['name']}" for p in PATIENTS)).font = Font(bold=True)
for name, rows in datasets:
    r += 1
    marks = []
    for p in PATIENTS:
        n = sum(1 for x in rows if x[0] == p["pid"] and not str(x[1]).startswith("-"))
        marks.append(f"{p['pid']}:{n}")
    ws.cell(r, 1, f"{name:<22} " + "   ".join(marks))
ws.cell(r + 1, 1, "").font = Font()

# ---------------- Patient summary ----------------
sheet("Patient_Summary",
      ["Queue rank (Mon 08:00)", "Priority score", "Patient", "Age/Sex", "Plan", "Member ID", "Language", "Program", "Scenario stressed", "Why now (top 3 reasons shown in queue)", "8 am Monday: what Maria should see and do"],
      [[p["rank"], p["priority_score"], f"{p['pid']} - {p['name']}", f"{p['age']} {p['sex']}", p["plan"], p["member_id"], p["language"], p["program"], p["scenario"], " | ".join(p["why_now"]), p["monday_line"]] for p in sorted(PATIENTS, key=lambda x: x["rank"])],
      widths={"8 am Monday: what Maria should see and do": 90, "Why now (top 3 reasons shown in queue)": 50, "Scenario stressed": 40})

sheet("1_Eligibility", ELIGIBILITY_COLS, ELIGIBILITY)
sheet("2_ADT_Alerts", ADT_COLS, ADT)
sheet("3_Medical_Claims", CLAIMS_COLS, CLAIMS)
sheet("4_Pharmacy_Fills", PHARM_COLS, PHARM)
sheet("5_Labs_Observations", LAB_COLS, LABS)
sheet("6_Clinical_Docs", DOCS_COLS, DOCS)
sheet("7_Med_Reconciliation", MEDREC_COLS, MEDREC, imp_cols=("Conflict type",))
sheet("8_PriorAuth_UM", UM_COLS, UM)
sheet("9_Contact_History", CONTACT_COLS, CONTACTS, imp_cols=())
sheet("10_Contact_Points", CONTACTPT_COLS, CONTACTPTS, imp_cols=("Validation result",))
sheet("11_SDOH_HRA", SDOH_COLS, SDOH)
sheet("12_Care_Plan_Case", CAREPLAN_COLS, CAREPLAN)
sheet("13_Care_Gaps_Clocks", GAPS_COLS, GAPS, imp_cols=())
sheet("14_Provider_Directory", PROV_COLS, PROV)
sheet("15_Appointments", APPT_COLS, APPTS)
sheet("16_Risk_Scores", RISK_COLS, RISK)
sheet("Insights", INSIGHTS_COLS, INSIGHTS, imp_cols=(), widths={"Derived insight shown on screen": 60, "What Maria does differently because she saw it": 55})

# ---------------- Dataset inventory ----------------
INV_COLS = ["#", "Dataset", "Source / standard", "What it tells Maria (decision it enables)", "Freshness", "Expected quality problems", "How we handle it on screen", "Priority"]
INV = [
 [1, "Member & eligibility", "834 enrollment; plan MDM", "Who, active?, PCP, language, dual status, authorized rep: whom she may talk to", "Daily", "Stale PCP/address; duplicate IDs (legacy Medicaid + D-SNP)", "Identity resolution with match %, merge request; never auto-merge <95%", "MVP"],
 [2, "ADT event notifications", "HL7 v2 A01/A03/A04/A08 via HIE or notification vendor (CMS CoP 482.24(d))", "Something happened NOW: triggers TOC/FUH clocks and re-ranks the queue", "Minutes; some batch feeds 1-2 days", "No diagnosis (optional by rule); name/DOB mismatches; late batches", "'Reason unknown' chip + auto CCD request; received-vs-event time shown", "MVP"],
 [3, "Discharge summary / CCD", "C-CDA or FHIR via HIE; Provider Access API (CMS-0057, 2027)", "Why admitted, discharge meds, follow-up plan: the core of med rec", "Hours to never (12-34% available at first visit)", "Missing sections; free text; problem lists in SNOMED", "'Not provided' sections shown explicitly; SNOMED -> plain language", "MVP"],
 [4, "Pharmacy claims incl. REJECTS", "NCPDP via PBM; NDC -> RxNorm", "What was actually picked up; gaps; rejected new meds", "1-3 days", "Cash/discount fills invisible; rejects hidden on paid-claims screens; dose changes skew supply", "Rejects in timeline; 'unknown' not 'non-adherent'; supply recalculated at new dose", "MVP"],
 [5, "Plan med list vs. discharge vs. fills", "Derived from 3, 4, 13", "Med discrepancies (~50% of discharges)", "On each new source", "Three lists disagree", "Side-by-side diff; AI proposes, clinician resolves", "MVP"],
 [6, "Lab results & observations", "HL7 ORU / FHIR Observation; LOINC", "Control & safety (A1c, NT-proBNP, K+, eGFR, PHQ-9)", "1-3 days", "Duplicate feeds; units (mmol/mol vs %); missing ranges", "Unit-normalised, de-duplicated, trend sparkline, age badge", "MVP"],
 [7, "Medical claims", "837I/P; ICD-10-CM, CPT/HCPCS, DRG, POS", "History, diagnoses, utilisation pattern", "30-60+ days", "Lag hides recent events; rule-out codes", "'Complete through <date>'; never infer absence from claims", "MVP"],
 [8, "Prior auth / UM", "Plan UM system; CMS-0057 PA API", "Is a needed drug/service blocked? What evidence unblocks it?", "Real-time", "Free-text notes; siloed from CM", "PA status inline on the med; 'evidence available' link", "MVP"],
 [9, "Contact history & outcomes", "CM system, dialer, SMS, member services CRM", "What was tried; what worked; buried signals from the call centre", "Real-time", "Unlogged attempts; call-centre notes not routed", "Auto-logged; AI tags inbound notes (cost, caregiver strain) for review", "MVP"],
 [10, "Contact-point quality", "Carrier lookup / reassigned-numbers DB, NCOA, ADT PID-13, HiLabs Intelligent Outreach", "Which number to dial first, when, and whether it is safe (TCPA)", "Weekly + on each event", "20-25% wrong numbers; reassigned numbers", "Per-number confidence, owner, best window; suppress reassigned", "MVP"],
 [11, "Care gaps & regulatory clocks", "HEDIS engine (TRC, FUH, AMR, GSD), SNP MOC, plan policy", "What is due when: ranks urgency", "Daily", "Lag in gap closure", "Countdown clocks in the queue ('FUH: 3 days left')", "MVP"],
 [12, "Provider directory & attribution", "HiLabs MCheck Provider; NPPES", "Is the PCP real/active/accepting? Next slot?", "Weekly", "Directories notoriously inaccurate", "Inactive PCP flagged + in-group alternative", "MVP"],
 [13, "Care plan & case notes", "CM system", "Goals, barriers, open tasks, last conversation", "Real-time", "Long free text; duplicate cases across teams", "AI 'since last contact' brief with links; duplicate-case banner", "MVP"],
 [14, "SDOH screens & HRA", "AHC-HRSN / PRAPARE (LOINC), D-SNP HRA, Z codes", "Barriers: housing, food, transport, phone, caregiver", "Point-in-time (often 8-12 months old)", "Stale; Z codes on only ~1-1.6% of claims", "Age badge; newer conflicting source wins display; 're-ask' prompts", "MVP"],
 [15, "Risk scores", "LACE, plan ML, HCC (not shown as a number)", "Long-run risk as ONE input to ranking", "Monthly", "Stale; blind to labs/fills; opaque", "Show drivers, not scores; recompute rising-risk signals daily", "MVP (as input)"],
 [16, "Workload & routing", "CM system: acuity, licensure, language, capacity", "Is this mine? Who co-owns? Spike coming?", "Real-time", "Raw case counts mislead", "Acuity-weighted workload; co-owner shown", "MVP"],
 [17, "Appointments", "Practice scheduling feeds / HIE / scheduling vendors", "Is the 7-day visit booked and kept?", "Daily (when available)", "Patchy coverage", "'Unknown' + confirm task", "Phase 2"],
 [18, "Behavioral health & SUD (42 CFR Part 2)", "BH vendor, SUD programs", "Treatment continuity (MAT)", "Lag", "Consent-restricted", "Consent-gated banner; request-consent workflow", "Phase 2"],
 [19, "Remote patient monitoring", "RPM vendors (weight, BP, glucose)", "Early HF decompensation", "Daily", "Noise; device gaps", "Threshold + trend only", "Phase 2"],
 [20, "Community referrals (closed loop)", "findhelp / Unite Us", "Did the food/transport referral close?", "Real-time", "Open loops", "Referral status chips", "Phase 2"],
 [21, "Supplemental benefits (NEMT, meals, OTC, phone)", "Benefit vendors", "Book a ride / phone minutes in-flow", "Daily", "Vendor silos", "Action buttons in the next-best-action panel", "Phase 2"],
 [22, "Post-acute (OASIS/MDS), PDMP", "Home health / SNF, state PDMP", "Functional status; controlled-substance safety", "Days", "Access rules vary", "Read-only panels", "Later"],
 [23, "Death / hospice election", "SSA DMF, hospice NOE", "Stop outreach respectfully", "Weekly", "Lag", "Sensitive banner, suppress dialler", "MVP (safety)"],
]
sheet("Dataset_Inventory", INV_COLS, INV, imp_cols=(), widths={"What it tells Maria (decision it enables)": 45, "Expected quality problems": 40, "How we handle it on screen": 45})

# ---------------- Day lost model (formulas) ----------------
ws = wb.create_sheet("Day_Lost_Model")
ws["A1"] = "Where Maria's day is lost: transparent model (blue = editable assumption)"; ws["A1"].font = Font(bold=True, size=13, color=NAVY)
inputs = [
 ("Working minutes per day", 480, "8 h shift (remote telephonic RN)"),
 ("Members actively worked per day", 10, "48 active cases, ~3 contacts/case/month in CCM/TOC (plan protocols); assumption"),
 ("Screens opened per member", 6.5, "Case: 'six or seven screens'"),
 ("Minutes per screen (login, search, read)", 2.5, "Assumption; validate with a time-motion pilot"),
 ("Extra minutes reconciling conflicts per member", 5, "Assumption; ~50% of discharges have med discrepancies (systematic review)"),
 ("Outbound call attempts per day", 18, "Assumption (~2 attempts per worked member)"),
 ("Minutes per failed attempt (lookup, dial, voicemail, log)", 4, "Assumption"),
 ("Connect rate", 0.22, "Industry ~20-30%; Medicaid reach can be <20% (sources)"),
 ("Real clinical conversations per day", 2.5, "Case: 'two real conversations by 3 pm'"),
 ("Minutes per real conversation", 25, "Assumption"),
 ("Full assessments per day", 1, "40-field assessment (case)"),
 ("Minutes per full assessment", 35, "Assumption"),
 ("Contact notes per day", 10, "Every attempt and contact is documented (NCQA/state audit)"),
 ("Minutes per note", 5, "Assumption"),
 ("Care-plan / audit re-entry minutes per day", 25, "Same facts re-typed (case)"),
 ("Coordination tasks per day", 4, "PCP, pharmacy, DME, transport, auth"),
 ("Minutes per coordination task", 8, "Assumption"),
]
ws["A3"], ws["B3"], ws["C3"] = "Assumption", "Value", "Basis / source"
for c in ("A3", "B3", "C3"): ws[c].font = Font(bold=True, color="FFFFFF"); ws[c].fill = PatternFill("solid", fgColor=NAVY)
for i, (a, v, s) in enumerate(inputs, 4):
    ws.cell(i, 1, a); c = ws.cell(i, 2, v); c.font = Font(color="0000FF", bold=True); ws.cell(i, 3, s)
R = {a: f"B{i}" for i, (a, _, _) in enumerate(inputs, 4)}
start = 4 + len(inputs) + 2
hdr = ["Activity", "Minutes/day (formula)", "Share of day", "Bucket"]
for j, h in enumerate(hdr, 1):
    c = ws.cell(start, j, h); c.font = Font(bold=True, color="FFFFFF"); c.fill = PatternFill("solid", fgColor=NAVY)
acts = [
 ("Data hunting & prep", f"={R['Members actively worked per day']}*({R['Screens opened per member']}*{R['Minutes per screen (login, search, read)']}+{R['Extra minutes reconciling conflicts per member']})", "Lost"),
 ("Outreach dialling that does not connect", f"={R['Outbound call attempts per day']}*(1-{R['Connect rate']})*{R['Minutes per failed attempt (lookup, dial, voicemail, log)']}", "Lost"),
 ("Documentation (assessment + notes + re-entry)", f"={R['Full assessments per day']}*{R['Minutes per full assessment']}+{R['Contact notes per day']}*{R['Minutes per note']}+{R['Care-plan / audit re-entry minutes per day']}", "Lost (partly necessary)"),
 ("Real clinical conversations", f"={R['Real clinical conversations per day']}*{R['Minutes per real conversation']}", "Value"),
 ("Care coordination", f"={R['Coordination tasks per day']}*{R['Minutes per coordination task']}", "Value"),
]
for k, (a, f, b) in enumerate(acts, start + 1):
    ws.cell(k, 1, a); ws.cell(k, 2, f); ws.cell(k, 4, b)
last = start + len(acts)
ws.cell(last + 1, 1, "Huddles, email, admin (remainder)"); ws.cell(last + 1, 2, f"=MAX(0,{R['Working minutes per day']}-SUM(B{start+1}:B{last}))"); ws.cell(last + 1, 4, "Overhead")
for k in range(start + 1, last + 2):
    ws.cell(k, 3, f"=B{k}/{R['Working minutes per day']}"); ws.cell(k, 3).number_format = "0%"; ws.cell(k, 2).number_format = "0"
ws.cell(last + 3, 1, "Hunting + failed dialling + documentation").font = Font(bold=True)
ws.cell(last + 3, 3, f"=SUM(C{start+1}:C{start+3})").number_format = "0%"
ws.cell(last + 4, 1, "Clinical judgment (conversations)").font = Font(bold=True)
ws.cell(last + 4, 3, f"=C{start+4}").number_format = "0%"
ws.cell(last + 6, 1, "Target state with the workbench (assumptions)").font = Font(bold=True, color=NAVY)
tgt = [("Screens per member -> 1 (Member 360)", "prep falls to ~10 x (1 x 2.5 + 1.5) = 40 min"),
       ("Connect rate 22% -> 32% (best number, best time, alternate contacts)", "fewer wasted attempts"),
       ("Documentation -40% (AI pre-fill + note draft, clinician confirms)", "~110 -> ~66 min"),
       ("Freed time (~2.5-3 h) -> 2.5 -> 5 real conversations/day", "same headcount")]
for i, (a, b) in enumerate(tgt, last + 7):
    ws.cell(i, 1, a); ws.cell(i, 3, b)
ws.column_dimensions["A"].width = 58; ws.column_dimensions["B"].width = 22; ws.column_dimensions["C"].width = 70; ws.column_dimensions["D"].width = 22

# ---------------- Metrics ----------------
MET_COLS = ["Metric", "Type", "Baseline", "Baseline basis", "90-day pilot target", "How measured"]
MET = [
 ["Prep time per member before a call", "Efficiency", "~21 min", "Day_Lost_Model (6.5 screens x 2.5 min + 5 min)", "<= 5 min", "Workbench telemetry (open->call) vs. time-motion baseline"],
 ["Real conversations per CM per day", "North-star input", "2-3", "Case narrative", "5", "Dialler connects >= 5 min"],
 ["Documentation minutes per contact", "Efficiency", "~11 min (110 min / 10 notes)", "Model", "-40%", "Telemetry; after-hours edit timestamps"],
 ["After-hours documentation (share of notes finished after 17:30)", "Wellbeing", "Measure at baseline", "77% of clinicians work after hours (AMIA, broad)", "Halve", "Note timestamps"],
 ["Outreach connect rate", "Outreach", "~22%", "Industry 20-30%", "+10 pp", "Dialler/SMS outcomes"],
 ["Post-discharge contact within 2 business days", "Quality (TRC)", "Plan-specific (assume ~50%)", "Assumption", ">= 85%", "ADT discharge -> first connected contact"],
 ["FUH 7-day rate (BH discharges)", "Quality (HEDIS)", "Plan-specific", "HEDIS", "+10 pp", "Claims + workbench"],
 ["Med reconciliation within 30 days of discharge", "Quality (TRC)", "Plan-specific", "HEDIS TRC", "+15 pp", "Documented reconciliation"],
 ["Active cases per CM at the same quality", "Capacity", "48", "Case", "55-60 (acuity-weighted)", "Workload model"],
 ["30-day readmission (pilot TOC cohort)", "Outcome (lagging)", "~17% (Medicare)", "HCUP", "-1 to -2 pp (Year 1 signal only)", "Claims, 60-day run-out"],
 ["AI draft acceptance / edit rate", "Guardrail", "-", "-", "Track; investigate if >90% accepted unedited (automation bias)", "Telemetry"],
 ["Alerts dismissed as not useful", "Guardrail", "-", "-", "< 15%", "Dismiss reason codes"],
 ["CM satisfaction (NPS / burnout item)", "Guardrail", "Measure", "AMN: 58% of RNs report burnout", "+20 NPS", "Monthly pulse"],
]
sheet("Metrics", MET_COLS, MET, imp_cols=())

# ---------------- Code verification ----------------
CODE_COLS = ["Code system", "Code", "Meaning", "Used for", "Verified against"]
CODES = [
 ["ICD-10-CM", "I50.23", "Acute on chronic systolic (congestive) heart failure", "P1", "NLM Clinical Tables ICD-10-CM API, 7 Nov 2026"],
 ["ICD-10-CM", "I11.0", "Hypertensive heart disease with heart failure", "P1", "NLM"],
 ["ICD-10-CM", "E11.65", "Type 2 diabetes mellitus with hyperglycemia", "P2", "NLM"],
 ["ICD-10-CM", "J45.51", "Severe persistent asthma with (acute) exacerbation", "P3", "NLM"],
 ["ICD-10-CM", "F33.2", "Major depressive disorder, recurrent severe without psychotic features", "P4", "NLM"],
 ["ICD-10-CM", "F11.20", "Opioid dependence, uncomplicated", "P4", "NLM"],
 ["ICD-10-CM", "Z59.01", "Sheltered homelessness", "P4", "NLM"],
 ["ICD-10-CM", "G30.9", "Alzheimer's disease, unspecified", "P5", "NLM"],
 ["ICD-10-CM", "N18.4", "Chronic kidney disease, stage 4 (severe)", "P5", "NLM"],
 ["ICD-10-CM", "W19.XXXA", "Unspecified fall, initial encounter", "P5", "NLM"],
 ["ICD-10-CM", "S00.03XA", "Contusion of scalp, initial encounter", "P5", "NLM"],
 ["ICD-10-CM", "Z91.81", "History of falling", "P5", "NLM"],
 ["LOINC", "4548-4", "Hemoglobin A1c/Hemoglobin.total in Blood", "P2", "NLM Clinical Tables LOINC API"],
 ["LOINC", "59261-8", "Hemoglobin A1c ... per IFCC (mmol/mol)", "P2", "NLM"],
 ["LOINC", "33762-6", "NT-proBNP [Mass/volume] in Serum or Plasma", "P1", "NLM"],
 ["LOINC", "2823-3", "Potassium [Moles/volume] in Serum or Plasma", "P1, P5", "NLM"],
 ["LOINC", "2160-0", "Creatinine [Mass/volume] in Serum or Plasma", "P1", "NLM"],
 ["LOINC", "98979-8", "eGFR by creatinine (CKD-EPI 2021)", "P1, P5", "NLM"],
 ["LOINC", "29463-7", "Body weight", "P1", "NLM"],
 ["LOINC", "44261-6", "PHQ-9 total score", "P4", "NLM"],
 ["LOINC", "72133-2", "Montreal Cognitive Assessment [MoCA]", "P5", "NLM"],
 ["LOINC", "88122-7 / 93030-5 / 71802-3", "Food worry / transportation / housing status (SDOH items)", "SDOH", "NLM"],
 ["RxNorm / NDC", "1656340 / 00904758004", "sacubitril 24 mg / valsartan 26 mg tablet", "P1", "NLM RxNav API"],
 ["RxNorm / NDC", "314077 / 00143971301", "lisinopril 20 mg tablet", "P1", "RxNav"],
 ["RxNorm / NDC", "313988 / 00054429925", "furosemide 40 mg tablet", "P1", "RxNav"],
 ["RxNorm / NDC", "200032 / 00093729501", "carvedilol 12.5 mg tablet", "P1", "RxNav"],
 ["RxNorm / NDC", "861004 / 00185022101", "metformin 1000 mg tablet", "P2", "RxNav"],
 ["RxNorm / NDC", "1545664 / 00597015207", "empagliflozin 10 mg tablet [Jardiance]", "P2", "RxNav"],
 ["RxNorm / NDC", "617311 / 00093505810", "atorvastatin 40 mg tablet", "P2", "RxNav"],
 ["RxNorm / NDC", "2123072 / 00093317431", "albuterol 0.09 mg/actuation MDI, 200 actuations", "P3", "RxNav"],
 ["RxNorm / NDC", "1246306 / 00186037020", "budesonide/formoterol 160/4.5 MDI [Symbicort]", "P3", "RxNav"],
 ["RxNorm / NDC", "312615 / 00054001820", "prednisone 20 mg tablet", "P3", "RxNav"],
 ["RxNorm / NDC", "1010604 / 00378876716", "buprenorphine 8 mg / naloxone 2 mg SL film", "P4", "RxNav"],
 ["RxNorm / NDC", "312938 / 00378418801", "sertraline 100 mg tablet", "P4", "RxNav"],
 ["RxNorm / NDC", "856377 / 00378347101", "trazodone 50 mg tablet", "P4", "RxNav"],
 ["RxNorm / NDC", "997223 / 00378514505", "donepezil 10 mg tablet", "P5", "RxNav"],
 ["RxNorm / NDC", "197361 / 00378520905", "amlodipine 5 mg tablet", "P5", "RxNav"],
 ["RxNorm / NDC", "308867 / 00054000713", "calcitriol 0.25 mcg capsule", "P5", "RxNav"],
 ["RxNorm / NDC", "197806 / 00904585461", "ibuprofen 600 mg tablet", "P5", "RxNav"],
 ["SNOMED CT", "443253003", "Acute on chronic systolic heart failure (maps to WHO ICD-10 I50.9; to ICD-10-CM I50.23)", "P1", "SNOMED CT International 2026-10-01 (DH 308 subset)"],
 ["SNOMED CT", "426656000", "Severe persistent asthma", "P3", "SNOMED CT Intl"],
 ["SNOMED CT", "66344007 / 75544000 / 32911000", "Recurrent major depression / Opioid dependence / Homeless", "P4", "SNOMED CT Intl"],
 ["SNOMED CT", "161898004 / 26929004 / 431857002", "Falls / Alzheimer's disease / CKD stage 4", "P5", "SNOMED CT Intl"],
 ["CPT", "99214, 99213, 99283, 99284, 83036, 99496", "Office visits, ED visits, HbA1c test, TCM (high complexity, visit within 7 days)", "Claims / clocks", "CMS public fee-schedule references (CPT is AMA-licensed; short descriptors are our own)"],
 ["HCPCS II / Revenue", "G0299; Rev 0450", "Home health RN services; Emergency room revenue code", "P5, P3", "CMS HCPCS file (public)"],
 ["NCPDP reject codes", "70, 75", "Product/service not covered; Prior authorization required", "P2, P1", "NCPDP standard reject codes"],
]
sheet("Code_Verification", CODE_COLS, CODES, imp_cols=())

SRC_COLS = ["#", "Source", "Used for", "URL"]
SRC = [
 [1, "HiLabs Product Caselet 2026-27", "Problem, deliverables, workload ranges", "(provided)"],
 [2, "CMS ADT CoP FAQ, 42 CFR 482.24(d)", "ADT minimum content; diagnosis optional", "https://www.cms.gov/priorities/burden-reduction/overview/interoperability/frequently-asked-questions/admission-discharge-transfer-patient-event-notification-conditions-participation-cop-42-cfr-482-24d"],
 [3, "Kripalani et al., JAMA 2007 (via JABFM 2017)", "Discharge summary at first visit 12-34%", "https://www.jabfm.org/content/jabfp/30/6/758.full.pdf"],
 [4, "Systematic review of post-discharge medication discrepancies", "~50% of patients", "https://pmc.ncbi.nlm.nih.gov/articles/PMC7235049"],
 [5, "NBER w34191 (Medicaid outreach field experiment)", ">= 24% inaccurate phone numbers", "https://www.nber.org/system/files/working_papers/w34191/w34191.pdf"],
 [6, "CMS OMH Z-code data highlights", "Z codes on ~1.1-1.6% of beneficiaries", "https://www.cms.gov/files/document/data-highlight-april-2022.pdf"],
 [7, "HCUP Statistical Brief 248", "Medicare readmission ~17%; cost ~$15.2k", "https://hcup-us.ahrq.gov/reports/statbriefs/sb248-Hospital-Readmissions-2010-2016.jsp"],
 [8, "KFF Medicare Advantage 2026", "MA/SNP/D-SNP enrollment", "https://www.kff.org/medicare/medicare-advantage-enrollment-update-and-key-trends/"],
 [9, "KFF: Medicaid and pregnancy", "41% of births", "https://www.kff.org/medicaid/issue-brief/5-key-facts-about-medicaid-and-pregnancy/"],
 [10, "CMS-0057-F fact sheet", "FHIR APIs by 1 Jan 2027; PA timeframes", "https://www.cms.gov/files/document/fact-sheet-cms-interoperability-and-prior-authorization-final-rule-cms-0057-f.pdf"],
 [11, "NCQA Case Management standards", "File review of assessments", "https://ncqa.org/programs/health-plans/case-management-cm/benefits-support/standards/"],
 [12, "CA DHCS D-SNP reporting specs", "HRA/ICP within 90 days", "https://www.dhcs.ca.gov/provgovpart/Documents/D-SNP-Reporting-Requirements-Technical-Specifications.pdf"],
 [13, "Plan TRC tip sheets (e.g. MVP Health Care)", "TRC components and timing", "https://mvphealthcare.com/-/media/project/mvp/healthcare/documents/hedis/2025/transitions-of-care-trc.pdf"],
 [14, "Norton Rose Fulbright on CMS AI FAQ (Feb 2024); CA SB 1120", "AI guardrails", "https://www.nortonrosefulbright.com/en/knowledge/publications/644bd9a2/cms-clarifies-medicare-advantage-organizations-use-of-ai-and-algorithms-in-coverage-decisions"],
 [15, "Becker's: Surgeon General, nurses up to 41% of day in EHR", "Documentation burden", "https://www.beckershospitalreview.com/quality/nursing/systems-ramp-up-efforts-to-reduce-documentation-time/"],
 [16, "Care managers & multiple HIT applications (PMC6557451)", "Multi-system burden", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6557451"],
 [17, "KLAS 2025 Best in KLAS payer CM", "Competitive landscape", "https://klasresearch.com/best-in-klas-ranking/care-management-solutions-payer/2025/306"],
 [18, "Innovaccer CM copilot press release (vendor claim)", "AI competitor claim (-28% documentation)", "https://businesswire.com/news/home/20250422661645/en/"],
 [19, "HiLabs Series B / MCheck coverage", "HiLabs positioning", "https://fiercehealthcare.com/health-tech/hilabs-closes-39-million-funding-round-company-enters-next-phase-growth"],
 [20, "SNOMED International & LOINC renewed agreement (2025)", "Terminology strategy", "https://www.snomed.org/news/snomed-international-and-loinc%C2%AE-announce-renewed-collaboration-agreement-and-upcoming-production-release-of-the-loinc-ontology"],
 [21, "CMAJ LACE derivation (van Walraven 2010)", "Readmission risk", "https://cmaj.ca/content/182/6/551"],
 [22, "NLM Clinical Tables & RxNav APIs", "Code verification", "https://clinicaltables.nlm.nih.gov ; https://rxnav.nlm.nih.gov"],
]
sheet("Sources", SRC_COLS, SRC, imp_cols=())

wb.save(OUT)
json.dump({"as_of": AS_OF, "plan": PLAN, "patients": PATIENTS}, open(os.path.join(os.path.dirname(__file__), "patients.json"), "w"), indent=1)
print("saved", OUT)
