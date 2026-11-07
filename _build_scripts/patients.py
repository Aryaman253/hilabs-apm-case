# Single source of truth for the 5 synthetic patients.
# Used by the Excel annex builder AND exported as JSON for the prototype.
# All people, phone numbers (555-01xx fictional range), addresses, hospitals,
# pharmacies and the health plan are fictional.

AS_OF = "Mon 09 Nov 2026, 08:00"

PLAN = "Lakeview Health Plan (fictional) - Medicare Advantage, D-SNP and Medicaid MCO lines, Ohio"

PATIENTS = [
 {
  "pid": "P1", "name": "Harold Brennan", "age": 71, "sex": "M", "plan": "Medicare Advantage HMO (MA-PD)",
  "member_id": "LHP-M-204871", "language": "English", "program": "Transitions of Care (TOC)",
  "scenario": "Fresh heart-failure discharge with a three-way medication conflict",
  "rank": 1, "priority_score": 94,
  "why_now": ["TRC 2-business-day contact clock closes Tue 10 Nov", "New Entresto rejected (prior auth) while old lisinopril is still at home", "PCP on file has left the practice"],
  "monday_line": "Discharged Sat after an HF exacerbation (LVEF 30%). His new Entresto was rejected at the pharmacy pending prior auth, lisinopril is still at home and his furosemide dose doubled. Call Harold and his wife Margaret this morning. Confirm he takes furosemide 40 mg and keeps lisinopril until the switch, and that he never takes it within 36 h of Entresto. Chase the PA with the cardiologist, book Dr. P. Nair (accepting) for Thu 12 Nov because his PCP has left, and start daily weights.",
 },
 {
  "pid": "P2", "name": "Denise Carter", "age": 54, "sex": "F", "plan": "Medicaid MCO (expansion adult)",
  "member_id": "LHP-C-558213", "language": "English", "program": "Diabetes - rising risk",
  "scenario": "Rising-risk diabetic who quietly stopped refills (cost) and works two jobs",
  "rank": 5, "priority_score": 61,
  "why_now": ["A1c 7.4% -> 9.8% in 5 months", "No metformin or Jardiance fill for 60-115 days", "Jardiance rejected after a formulary change; metformin refills exhausted"],
  "monday_line": "Not today's emergency but this week's. Refills stopped about 70 days ago while A1c rose from 7.4% to 9.8% (the second lab feed sent the same result as 84 mmol/mol). The reasons are access, not willpower: her metformin Rx ran out of refills and Jardiance was rejected after a formulary change (her call to member services about it was never routed to case management). Daytime calls fail because she works days. Text her (SMS consent on file) to book a call after 6 pm, ask the FQHC for a metformin renewal and a preferred SGLT2i, and book the Thursday evening clinic.",
 },
 {
  "pid": "P3", "name": "Tyler Kowalski", "age": 29, "sex": "M", "plan": "Medicaid MCO",
  "member_id": "LHP-C-640127", "language": "English", "program": "Complex CM - high ED utiliser",
  "scenario": "Unreachable frequent ED user: severe asthma, no controller, reassigned phone",
  "rank": 4, "priority_score": 78,
  "why_now": ["4 ED visits in 77 days (latest Sun 02:14)", "6 rescue-inhaler fills and 0 controller fills (AMR 0.0)", "Number on file now belongs to someone else"],
  "monday_line": "4 ED visits in 77 days, 6 rescue-inhaler fills and zero controller fills put him at risk of a fatal attack. The plan's number is reassigned, but Sunday's ED registration captured a new mobile (555-0193, match confidence 92%: confirm identity on the call). Text, then call at midday, not while he's driving. Backup: he fills albuterol every Saturday at QuickRx #214, so ask the pharmacist to hand over a callback card and his $0 Symbicort. Book an asthma visit.",
 },
 {
  "pid": "P4", "name": "Tanya Brooks", "age": 33, "sex": "F", "plan": "Medicaid MCO",
  "member_id": "LHP-C-702264", "language": "English", "program": "Behavioral Health CM",
  "scenario": "Behavioural-health discharge + housing loss + buprenorphine about to run out",
  "rank": 2, "priority_score": 91,
  "why_now": ["FUH 7-day follow-up window closes Thu 12 Nov", "Discharge med list omits buprenorphine; supply ends ~Wed 11 Nov", "Now at a shelter; prepaid phone out of minutes"],
  "monday_line": "Discharged Thu from inpatient psych (MDD). The FUH 7-day window closes Thursday and no BH visit is booked. The discharge med list omits her buprenorphine, and her fill runs out about Wednesday, a high relapse and overdose risk. Her phone is out of minutes and the ADT shows a shelter address. Leave a no-PHI callback request with the shelter desk, text a Wi-Fi telehealth link, book a BH visit by Wednesday, ask the prescriber to bridge buprenorphine, co-assign the BH counsellor, and start the phone benefit and housing referrals.",
 },
 {
  "pid": "P5", "name": "Thi Mai Tran", "age": 82, "sex": "F", "plan": "D-SNP (dual: Medicare + Medicaid)",
  "member_id": "LHP-D-310455", "language": "Vietnamese (daughter: English)", "program": "D-SNP Model of Care",
  "scenario": "Dual-eligible senior: second fall, NSAID with CKD 4, duplicate record, caregiver strain",
  "rank": 3, "priority_score": 86,
  "why_now": ["Second fall in 5 months (ED Fri 6 Nov)", "ED prescribed ibuprofen 600 mg with eGFR 22 (CKD 4)", "Daughter: 'I can't keep doing this'"],
  "monday_line": "Second fall in 5 months (ED Friday). The ED sent her home on ibuprofen 600 mg despite CKD 4 (eGFR 22, K 5.4), so ask the pharmacist or prescriber to stop it this morning. Merge her old Medicaid record (LHP-C-118902), which still has an open LTSS case with another case manager. Call her daughter Linh after 5 pm in English (Vietnamese interpreter for Mrs. Tran), trigger a post-fall HRA reassessment and home-safety evaluation, and escalate the pending personal-care-services (PCS) assessment and respite.",
 },
]

# ---------------------------------------------------------------------------
# Dataset records. Each row: (pid, record fields...). Columns defined per tab.
# "imp" = planted imperfection text ("" if none). "handle" = how the product shows/handles it.
# ---------------------------------------------------------------------------

ELIGIBILITY_COLS = ["Patient","Member ID","Line of business","Eligibility status","Effective","PCP on file","Language","Phone on file (type)","Address on file","Authorized rep / caregiver","Dual status","Source","Last updated","Planted imperfection","How the workbench handles it"]
ELIGIBILITY = [
 ["P1","LHP-M-204871","MA-PD HMO","Active","2024-01-01","Dr. Alan Whitcomb, Riverton Family Medicine","English","555-0142 (home landline)","18 Example Ln, Riverton OH","Margaret Brennan (spouse) - HIPAA auth on file","Non-dual","834 enrollment file","2026-11-06","PCP left practice 30 Sep 2026; 834 still lists him","Provider-directory check (HiLabs MCheck) flags 'PCP inactive'; suggests in-group PCP accepting new patients"],
 ["P2","LHP-C-558213","Medicaid expansion adult","Active (renewal due 2027-03)","2024-04-01","Riverton Community Health Center (FQHC)","English","555-0118 (mobile)","77 Sample St Apt 3, Riverton OH","None","Non-dual","834 enrollment file","2026-11-06","",""],
 ["P3","LHP-C-640127","Medicaid","Active","2025-02-01","Dr. S. Okoye, Eastside Primary Care (never seen)","English","555-0177 (mobile)","12 Demo Ct Apt 9, Riverton OH","None","Non-dual","834 enrollment file","2026-11-06","Phone 555-0177 reassigned to a new subscriber in Sep 2026","Phone confidence = LOW (carrier reassignment); ADT-captured number promoted as candidate"],
 ["P4","LHP-C-702264","Medicaid","Active","2023-07-01","Riverton Community Health Center (FQHC)","English","555-0126 (prepaid mobile)","5 Placeholder Rd Apt 2, Riverton OH","None","Non-dual","834 enrollment file","2026-11-06","Address stale: evicted Oct 2026; now at shelter per ADT","Address conflict chip: 834 vs ADT (newer) - ADT shown first, 834 kept for mail"],
 ["P5","LHP-D-310455","D-SNP (FIDE)","Active","2026-01-01","Dr. H. Pham, Lakeside Geriatrics","Vietnamese","555-0151 (daughter's mobile)","240 Fictive Ave, Riverton OH","Linh Tran (daughter) - HIPAA auth + caregiver","Full-benefit dual","834 enrollment file","2026-11-06","",""],
 ["P5","LHP-C-118902","Medicaid MCO (legacy)","Terminated 2025-12-31","2019-05-01","Dr. H. Pham","Vietnamese","555-0109 (home - disconnected)","240 Fictive Ave, Riverton OH","None","-","Legacy Medicaid 834","2025-12-31","DUPLICATE: same person under old Medicaid ID; an LTSS case is still open under this ID","Identity resolution: 'Probable same member (name+DOB+address, 99%)' -> one-click merge request + notify other CM"],
]

ADT_COLS = ["Patient","Msg ID","HL7 event","Facility","Event time","Received by plan","Patient class","Diagnosis in message","Discharge disposition","Demographics sent","Planted imperfection","How the workbench handles it"]
ADT = [
 ["P1","ADT-88123","A04 ED registration","Riverton General Hospital (fictional)","2026-11-03 09:48","2026-11-03 09:51","Emergency","(blank)","-","Harold Brennan, DOB 1955-03-14","No diagnosis in alert (allowed under CoP minimum content)","Shows 'Reason unknown - request sent'; auto-creates task to pull CCD from HIE"],
 ["P1","ADT-88140","A01 admit","Riverton General Hospital","2026-11-03 14:12","2026-11-03 14:20","Inpatient","(blank)","-","same","No diagnosis","Same as above"],
 ["P1","ADT-88702","A03 discharge","Riverton General Hospital","2026-11-07 11:05","2026-11-07 11:40","Inpatient","I50.23 (in DG1)","01 Home/self-care","same","",""],
 ["P3","ADT-71001","A04 ED registration","Riverton General Hospital","2026-08-24 22:31","2026-08-24 22:40","Emergency","J45.51","01 Home","Tyler Kowalski, DOB 1997-03-11","",""],
 ["P3","ADT-71877","A04 ED registration","St. Brigid Medical Center (fictional)","2026-09-19 01:05","2026-09-21 08:00","Emergency","(blank)","01 Home","Tyler Kowalsky, DOB 1997-11-03","Name misspelled + DOB day/month swapped; arrived 2 days late (batch feed)","Probabilistic match 92% -> shown with 'confirm identity' chip; never auto-merged below 95%"],
 ["P3","ADT-72510","A04 ED registration","St. Brigid Medical Center","2026-10-21 23:40","2026-10-23 08:00","Emergency","(blank)","01 Home","Tyler Kowalsky, DOB 1997-11-03","Same mismatch; 2-day delay","Same"],
 ["P3","ADT-73390","A04 ED registration","St. Brigid Medical Center","2026-11-08 02:14","2026-11-08 05:52","Emergency","J45.51","01 Home (05:40)","Tyler Kowalsky, DOB 1997-11-03, PID-13 phone 555-0193","Contains a NEWER phone than the plan's file","Phone candidate 555-0193 promoted to 'try first' with source = ED registration 08 Nov"],
 ["P4","ADT-60412","A01 admit","Northgate Behavioral Health (fictional)","2026-10-29 18:20","2026-10-30 09:00","Inpatient psych","(blank)","-","Tanya Brooks, address: 5 Placeholder Rd","No diagnosis; next-day arrival","Reason unknown -> CCD request"],
 ["P4","ADT-61290","A03 discharge","Northgate Behavioral Health","2026-11-05 16:30","2026-11-05 16:55","Inpatient psych","F33.2","01 Home","Address: Riverton Women's Shelter, 400 Example Ave; NK1 contact: shelter front desk 555-0160","Address differs from 834 (newer)","Address conflict chip; FUH clock starts 05 Nov"],
 ["P5","ADT-90015","A04 ED registration","Riverton General Hospital","2026-11-06 19:20","2026-11-06 19:24","Emergency","W19.XXXA","-","Thi Mai Tran","",""],
 ["P5","ADT-90077","A03 ED discharge","Riverton General Hospital","2026-11-06 23:50","2026-11-07 00:05","Emergency","W19.XXXA, S0003XA","01 Home","Thi Mai Tran","Secondary code sent without the decimal point (S0003XA)","Normalised to S00.03XA (scalp contusion); the original string is kept for audit"],
]

CLAIMS_COLS = ["Patient","Claim ID","Type","Service date","Paid / received date","Lag (days)","Provider","ICD-10-CM","CPT / HCPCS / Rev / DRG","What it tells Maria","Planted imperfection","How the workbench handles it"]
CLAIMS = [
 ["P1","CL-5501","Professional","2026-08-21","2026-09-18",28,"Riverton Cardiology","I50.22, I11.0","CPT 99214","Last cardiology visit; HF known","",""],
 ["P1","(expected)","Institutional","2026-11-03 to 11-07","not yet received","-","Riverton General Hospital","-","-","Admission invisible on claims","Claims lag: index admission will arrive ~30-45 days after discharge","Timeline shows ADT/CCD events immediately; claims tile labelled 'complete through 18 Sep'"],
 ["P2","CL-6120","Professional","2026-05-12","2026-06-02",21,"Riverton CHC (FQHC)","E11.65","CPT 99213; 83036 (A1c)","Last PCP visit 6 months ago","",""],
 ["P3","CL-7310","Professional + facility","2026-08-24","2026-09-30",37,"Riverton General Hospital ED","J45.51","CPT 99284; Rev 0450","ED visit #1","",""],
 ["P3","CL-7388","Professional + facility","2026-09-19","2026-10-27",38,"St. Brigid Medical Center ED","J45.51","CPT 99284; Rev 0450","ED visit #2","",""],
 ["P3","(expected)","Facility","2026-10-21, 2026-11-08","not yet received","-","St. Brigid Medical Center","-","-","ED visits #3, #4 invisible","Claims show 2 ED visits, ADT shows 4","ED count computed from ADT+claims de-duplicated: '4 (2 confirmed by claims)'"],
 ["P4","(expected)","Institutional","2026-10-29 to 11-05","not yet received","-","Northgate Behavioral Health","-","-","Psych stay invisible","Claims lag","As above"],
 ["P4","CL-4471","Professional","2026-09-02","2026-09-24",22,"Riverton CHC","F33.1, F11.20","CPT 99214","Last outpatient visit","F11.20 present on claim (not Part 2 restricted)","Shown, since a claim from a non-Part 2 provider is not restricted"],
 ["P5","CL-8801","Professional","2026-06-10","2026-07-08",28,"Riverton General Hospital ED","W19.XXXA, N18.4, G30.9","CPT 99283","Fall #1 in June","",""],
 ["P5","CL-8822","HCPCS","2026-06-20 to 08-15","2026-08-30",15,"Lakeside Home Health (fictional)","Z91.81","HCPCS G0299 (home health RN visits)","Home health ended Aug","",""],
]

PHARM_COLS = ["Patient","Rx claim ID","Fill date","Drug (as billed)","NDC (11)","RxNorm CUI","Days supply","Pharmacy","Status / reject","Runs out (est.)","Planted imperfection","How the workbench handles it"]
PHARM = [
 ["P1","RX-1001","2026-10-20","lisinopril 20 MG Oral Tablet","00143971301","314077",30,"QuickRx #108 (fictional)","Paid","2026-11-19","Refilled 18 days before discharge list says 'STOP lisinopril'","Med reconciliation diff: 'At home: lisinopril' vs 'Discharge: stopped' -> clinician resolves"],
 ["P1","RX-1002","2026-10-20","carvedilol 12.5 MG Oral Tablet","00093729501","200032",30,"QuickRx #108","Paid","2026-11-19","",""],
 ["P1","RX-1003","2026-09-01","furosemide 40 MG Oral Tablet (1/2 tab = 20 mg daily)","00054429925","313988",60,"QuickRx #108","Paid","2026-12-31 at 20 mg","Dose change at discharge (20 -> 40 mg) halves his remaining supply","Supply recalculated at new dose: 'runs out ~01 Dec'"],
 ["P1","RX-1004","2026-11-07","sacubitril 24 MG / valsartan 26 MG Oral Tablet","00904758004","1656340",30,"QuickRx #108","REJECTED - NCPDP 75 (Prior authorization required)","-","New HF drug never dispensed","'Discharge med not picked up' insight + link to open PA"],
 ["P2","RX-2001","2026-06-02","metformin hydrochloride 1000 MG Oral Tablet","00185022101","861004",90,"ValueMart Pharmacy (fictional)","Paid - last refill on the Rx (0 refills left)","2026-08-31","Gap of 70 days: the Rx expired and needs a PCP renewal; she has not been seen since May","'Refills exhausted' shown as the gap reason (from Rx refill count), not 'non-adherent'"],
 ["P2","RX-2002","2026-07-15","empagliflozin 10 MG Oral Tablet [Jardiance]","00597015207","1545664",30,"ValueMart Pharmacy","Paid","2026-08-14","",""],
 ["P2","RX-2005","2026-08-16","empagliflozin 10 MG Oral Tablet [Jardiance]","00597015207","1545664",30,"ValueMart Pharmacy","REJECTED - NCPDP 70 (not covered: removed from state preferred drug list 1 Aug)","-","Rejected claim invisible on the paid-claims screen; the member was quoted a cash price and walked away","Rejected claims shown in the med timeline; insight: 'PDL change -> needs a preferred SGLT2i or a PA'"],
 ["P2","RX-2003","2026-09-02","atorvastatin 40 MG Oral Tablet","00093505810","617311",90,"ValueMart Pharmacy","Paid","2026-12-01","",""],
 ["P3","RX-3001..3006","2026-08-29, 09-12, 09-26, 10-10, 10-24, 11-07","albuterol 0.09 MG/ACTUAT MDI (200 actuations)","00093317431","2123072",30,"QuickRx #214 (fictional) - always Saturday 18:00-20:00","Paid x6","-","6 rescue inhalers in 10 weeks","AMR = 0/6 -> 'no controller' insight; fill pattern -> 'reach at pharmacy on Saturday'"],
 ["P3","RX-3010","2026-08-25","prednisone 20 MG Oral Tablet","00054001820","312615",5,"QuickRx #214","Paid","-","",""],
 ["P3","(never)","-","budesonide 0.16 / formoterol 0.0045 MG/ACTUAT MDI [Symbicort] - prescribed at ED 24 Aug","00186037020","1246306","-","-","Never presented for fill","-","Controller prescribed but never filled (only visible by comparing ED discharge note vs fills)","'Prescribed, not filled' row in med list"],
 ["P4","RX-4001","2026-10-28","buprenorphine 8 MG / naloxone 2 MG Sublingual Film","00378876716","1010604",14,"QuickRx #108","Paid","2026-11-11","Active fill, but OMITTED from discharge med list","'Missing from discharge list' conflict + runs-out countdown"],
 ["P4","RX-4002","2026-11-05","sertraline 100 MG Oral Tablet","00378418801","312938",30,"QuickRx #108","Paid","2026-12-05","",""],
 ["P4","RX-4003","2026-11-05","trazodone hydrochloride 50 MG Oral Tablet","00378347101","856377",30,"QuickRx #108","Paid","2026-12-05","",""],
 ["P5","RX-5001","2026-10-15","donepezil hydrochloride 10 MG Oral Tablet","00378514505","997223",30,"Lakeside Pharmacy (fictional)","Paid","2026-11-14","",""],
 ["P5","RX-5002","2026-10-15","amlodipine 5 MG Oral Tablet","00378520905","197361",30,"Lakeside Pharmacy","Paid","2026-11-14","",""],
 ["P5","RX-5003","2026-10-15","calcitriol 0.00025 MG Oral Capsule","00054000713","308867",30,"Lakeside Pharmacy","Paid","2026-11-14","",""],
 ["P5","RX-5004","2026-11-07","ibuprofen 600 MG Oral Tablet (ED discharge Rx)","00904585461","197806",10,"NightOwl 24h Pharmacy (fictional) - a SECOND pharmacy","Paid","2026-11-17","NSAID with CKD 4 (eGFR 22) + filled at a different pharmacy than usual","Drug-condition alert 'NSAID + CKD 4' surfaced to clinician (not auto-cancelled)"],
]

LAB_COLS = ["Patient","Result ID","Collected","Received","LOINC","Test","Value","Unit","Ref range / flag","Source","Planted imperfection","How the workbench handles it"]
LABS = [
 ["P1","L-1101","2026-11-03","2026-11-04","33762-6","NT-proBNP","4850","pg/mL","<125 (H)","Riverton General via HIE","",""],
 ["P1","L-1102","2026-11-06","2026-11-08","2823-3","Potassium","5.1","mmol/L","3.5-5.1 (borderline)","Riverton General via HIE","",""],
 ["P1","L-1103","2026-11-06","2026-11-08","2160-0","Creatinine","1.6","mg/dL","0.7-1.3 (H)","Riverton General via HIE","",""],
 ["P1","L-1104","2026-11-06","2026-11-08","98979-8","eGFR (CKD-EPI 2021)","44","mL/min/1.73m2","> 60 (L)","Riverton General via HIE","",""],
 ["P1","L-1105","2026-11-07","2026-11-08","29463-7","Body weight (at discharge)","88.4","kg","-","Discharge CCD","",""],
 ["P2","L-2101","2026-05-12","2026-05-14","4548-4","HbA1c","7.4","%","<7.0 (H)","Valley Labs (fictional)","",""],
 ["P2","L-2102","2026-10-22","2026-10-24","4548-4","HbA1c","9.8","%","<7.0 (H)","Valley Labs","",""],
 ["P2","L-2103","2026-10-22","2026-10-26","59261-8","HbA1c (IFCC)","84","mmol/mol","-","Valley Labs second interface","DUPLICATE of L-2102 in different units/LOINC","Unit-normalised & de-duplicated: 84 mmol/mol = 9.8% (shown once, '2 sources')"],
 ["P2","L-2104","2026-10-22","2026-10-24","2345-7","Glucose (random)","248","mg/dL","70-140 (H)","Valley Labs","",""],
 ["P3","-","-","-","-","(no labs on file)","-","-","-","-","Absence of data","Shown as 'No labs in 12 months' (not hidden)"],
 ["P4","L-4101","2026-10-29","2026-11-06","44261-6","PHQ-9 total score (admission)","24","{score}","Severe (>=20)","Northgate discharge CCD","",""],
 ["P4","L-4102","2026-11-05","2026-11-06","44261-6","PHQ-9 total score (discharge)","14","{score}","Moderate","Northgate discharge CCD","",""],
 ["P5","L-5101","2026-09-18","2026-09-20","98979-8","eGFR (CKD-EPI 2021)","22","mL/min/1.73m2","> 60 (L) - CKD 4","Lakeside Geriatrics via HIE","51 days old","Freshness badge '51 d' - still used for NSAID check"],
 ["P5","L-5102","2026-09-18","2026-09-20","2823-3","Potassium","5.4","mmol/L","3.5-5.1 (H)","Lakeside Geriatrics via HIE","",""],
 ["P5","L-5103","2026-02-20","2026-02-20","72133-2","MoCA","14","{score}/30","Moderate impairment","D-SNP HRA","",""],
]

DOCS_COLS = ["Patient","Document","Author / facility","Date","Received","Key content (structured)","SNOMED CT (problem list)","Mapped ICD-10-CM","Planted imperfection","How the workbench handles it"]
DOCS = [
 ["P1","Discharge summary (C-CDA CCD)","Riverton General Hospital","2026-11-07","2026-11-08 10:12 (via HIE)","Dx: acute on chronic systolic HF; LVEF 30%. Discharge meds: sacubitril/valsartan 24/26 mg BID (NEW), STOP lisinopril, furosemide 40 mg daily (CHANGED), carvedilol 12.5 mg BID. Follow-up: 'PCP within 7 days' (no name/date). Discharge weight 88.4 kg","443253003 Acute on chronic systolic heart failure","I50.23","Partial: 'pending results' and follow-up provider sections empty","Missing sections shown as 'not provided' (not silently omitted); task to call hospital TOC nurse optional"],
 ["P3","ED discharge instructions (CCD)","St. Brigid Medical Center","2026-11-08","2026-11-08 06:30","Dx: severe persistent asthma with exacerbation. Rx: prednisone burst; 'start Symbicort 160/4.5, 2 puffs BID' (same as Aug)","426656000 Severe persistent asthma","J45.51","Same controller advice as Aug - repeated, never acted on","Timeline groups repeated advice: 'Controller advised 2x (Aug, Nov), never filled'"],
 ["P4","Discharge summary (C-CDA)","Northgate Behavioral Health","2026-11-05","2026-11-06 14:00","Dx: MDD recurrent, severe w/o psychotic features. Meds: sertraline 100 mg, trazodone 50 mg qHS. Follow-up: 'outpatient BH appointment to be scheduled'. Safety plan attached.","66344007 Recurrent major depression; 32911000 Homeless","F33.2; Z59.01","Omits buprenorphine (documented only in Part 2 SUD program record); no appointment booked","Conflict with pharmacy; Part 2 records shown as 'restricted - consent required' banner"],
 ["P4","SUD program record (42 CFR Part 2)","Northgate Recovery Services","2026-10-30","2026-10-30","[RESTRICTED - no Part 2 consent on file]","75544000 Opioid dependence","F11.20","Consent missing","Hidden content; banner + 'request consent' workflow"],
 ["P5","ED visit summary (CCD)","Riverton General Hospital","2026-11-06","2026-11-07 00:20","Mechanical fall at home at night, no fracture on X-ray; scalp contusion. Rx: ibuprofen 600 mg TID x10 days. 'Follow up with PCP'.","161898004 Falls; 26929004 Alzheimer's disease; 431857002 Chronic kidney disease stage 4","W19.XXXA; G30.9; N18.4","ED unaware of CKD 4 when prescribing NSAID","Drug-condition check runs across ALL sources (plan knows CKD 4 from labs+claims)"],
]

MEDREC_COLS = ["Patient","Medication","Plan CM med list (last updated)","Hospital discharge list","Pharmacy fills (actual)","Conflict type","AI-proposed resolution (clinician must confirm)"]
MEDREC = [
 ["P1","lisinopril 20 mg daily","Listed (2026-08-25)","STOP","Filled 20 Oct, 30 days","Stopped at discharge, still at home","Keep lisinopril until the ARNI switch. Stop it at least 36 h before the first Entresto dose (angioedema risk). Confirm with the cardiologist."],
 ["P1","sacubitril/valsartan 24/26 mg BID","Not listed","NEW","Rejected (PA required) 7 Nov","New med not dispensed","Escalate PA; confirm the interim plan with the prescriber"],
 ["P1","furosemide","20 mg daily","40 mg daily (CHANGED)","20 mg dosing; 40 mg tabs","Dose change","Confirm he takes 1 full tablet (40 mg); supply now ends ~1 Dec"],
 ["P1","carvedilol 12.5 mg BID","Listed","Continue","Filled","Match","-"],
 ["P3","budesonide/formoterol 160/4.5 2 puffs BID","Not listed","Prescribed Aug + Nov","Never filled","Prescribed, never filled","Ask why (cost? understanding?). Medicaid $0 copay; arrange a fill at QuickRx #214"],
 ["P3","albuterol MDI PRN","Listed","Continue","6 fills / 10 weeks","Over-use signal (SABA)","Flag for clinician: poor control"],
 ["P4","buprenorphine/naloxone 8/2 mg SL film daily","Listed (BH CM, 2026-07)","ABSENT","Filled 28 Oct, 14 days","Missing from discharge list","Ask the member and prescriber; bridge Rx before 11 Nov"],
 ["P4","sertraline 100 mg daily","50 mg (2026-07)","100 mg","100 mg filled 5 Nov","Dose change","Update plan list to 100 mg"],
 ["P5","ibuprofen 600 mg TID","Not listed","ED Rx 6 Nov","Filled 7 Nov at a 2nd pharmacy","Drug-condition (NSAID + CKD 4, K 5.4)","Contact the ED prescriber or Dr. Pham for an alternative (e.g. acetaminophen). Clinician decides."],
 ["P5","donepezil 10 mg qHS","Listed","Not mentioned","Filled","Unknown to ED","-"],
]

UM_COLS = ["Patient","Auth / referral ID","Type","Requested","Status","Detail","Planted imperfection","How the workbench handles it"]
UM = [
 ["P1","PA-77812","Pharmacy prior auth","2026-11-07 16:02","PENDING - additional info requested 11-08","Entresto 24/26; plan needs LVEF documentation","Clinical info already exists in the discharge CCD (LVEF 30%) but the PA team has not seen it","'Evidence available' link: send the CCD excerpt to the PA team (one click, clinician confirms)"],
 ["P4","REF-30011","BH referral","2026-11-05","OPEN - not scheduled","Outpatient psychiatry + therapy (FUH)","",""],
 ["P5","LTSS-5520","Medicaid PCS / HCBS assessment","2026-10-01","PENDING state assessor (39 days)","Personal care services hours","Stalled; owned by the LTSS CM on the duplicate record","Shown on the merged record with the owner's name; escalate button"],
 ["P5","HH-2201","Home health (post-fall PT/OT + home safety)","-","Not requested","-","Gap","Next-best-action suggestion (clinician orders/requests)"],
]

CONTACT_COLS = ["Patient","Date/time","Channel","Number / address used","Outcome","By","Note"]
CONTACTS = [
 ["P1","2026-08-25 10:10","Phone","555-0142","Connected (22 min)","Maria R. (RN)","Annual HF check-in; wife Margaret manages meds"],
 ["P2","2026-10-27 10:30","Phone","555-0118","No answer - voicemail full","Maria R.","-"],
 ["P2","2026-10-30 14:05","Phone","555-0118","No answer","Maria R.","-"],
 ["P2","2026-10-14 19:42","Inbound - member services","555-0118","Connected","Call centre (non-clinical)","'Member asked why her diabetes pill is not covered anymore, pharmacy wanted $580' - NOT routed to CM (planted: buried signal)"],
 ["P3","2026-09-23 11:00","Phone","555-0177","No answer","Maria R.","-"],
 ["P3","2026-10-26 12:15","Phone","555-0177","No answer","Maria R.","-"],
 ["P3","2026-11-02 12:40","Phone","555-0177","Wrong number ('this is Rita, I just got this number')","Maria R.","Planted: reassigned number - logged in a free-text note only"],
 ["P4","2026-11-06 10:00","Phone","555-0126","'Call cannot be completed'","Maria R.","Prepaid phone out of minutes"],
 ["P4","2026-11-06 10:02","SMS","555-0126","Delivered, no reply","System","-"],
 ["P5","2026-10-30 18:20","Inbound - member services","555-0151","Connected","Call centre","Daughter: 'Mom is up all night wandering, I can't keep doing this.' - planted caregiver-strain signal, not routed to CM"],
 ["P5","2026-09-10 17:45","Phone","555-0151","Connected (35 min)","Maria R.","Quarterly ICP review; Vietnamese interpreter used for member"],
]

CONTACTPT_COLS = ["Patient","Contact point","Owner","Source","Last verified","Line type","Validation result","Best window (learned)","Consent","Confidence","Recommended order"]
CONTACTPTS = [
 ["P1","555-0142","Harold (home)","834","2026-08-25 (connected)","Landline","Active","Mornings 9-11 (2 of 2 connects)","Voice","HIGH","1"],
 ["P1","555-0144","Margaret (spouse mobile)","CM notes","2026-08-25","Mobile","Active","Any","Voice, SMS (HIPAA auth)","HIGH","2"],
 ["P2","555-0118","Denise (mobile)","834","2026-10-14 (inbound)","Mobile","Active; voicemail full","Evenings after 18:30 (inbound call time; works days)","Voice, SMS (consent 2025-04)","MEDIUM","1 (SMS first, then call after 18:30)"],
 ["P3","555-0177","(was Tyler)","834","2026-11-02 - wrong person","Mobile","REASSIGNED Sep 2026 (carrier lookup)","-","-","NONE - suppress","Do not call (TCPA risk)"],
 ["P3","555-0193","Tyler (new mobile)","ADT PID-13, St. Brigid 2026-11-08","2026-11-08 (ED registration)","Mobile","Active","Midday (avoid driving hours 16-24)","Not yet - ask on first call","MEDIUM (identity 92%)","1"],
 ["P3","QuickRx #214","Pharmacy counter","Pharmacy claims pattern","Saturdays 18-20","-","-","Sat 18:00-20:00","Pharmacist message (no PHI beyond Rx)","-","3 (backup)"],
 ["P4","555-0126","Tanya (prepaid)","834","2026-11-06 failed","Prepaid mobile","Out of minutes","-","Voice, SMS","LOW","3"],
 ["P4","555-0160","Shelter front desk","ADT NK1 (discharge)","2026-11-05","Landline","Active","Mornings","No-PHI callback request only","MEDIUM","1"],
 ["P4","Telehealth link via SMS (Wi-Fi)","Tanya","-","-","-","-","-","SMS consent","-","2"],
 ["P5","555-0151","Linh (daughter, caregiver)","834 + HIPAA auth","2026-10-30 (inbound)","Mobile","Active","After 17:00 (works days)","Voice, SMS (auth)","HIGH","1"],
 ["P5","555-0109","Home (legacy record)","Legacy 834","2025","Landline","DISCONNECTED","-","-","NONE - suppress","-"],
]

SDOH_COLS = ["Patient","Instrument","Date","Item (LOINC)","Answer","Age of data (days)","Planted imperfection","How the workbench handles it"]
SDOH = [
 ["P1","AHC HRSN","2026-02-10","Food insecurity (88122-7)","Never true",272,"",""],
 ["P1","AHC HRSN","2026-02-10","Transportation (93030-5)","No (wife drives)",272,"",""],
 ["P2","AHC HRSN","2026-01-12","Food insecurity (88122-7)","Sometimes true",301,"10 months old","Age badge; 're-ask' prompt in the call guide"],
 ["P2","CM note","2026-05-12","Work","Two jobs (home health aide days; grocery nights)",181,"Only in free text","AI extracts it as a 'Constraint: works days' chip (clinician confirms)"],
 ["P3","-","-","-","Never screened","-","Missing","'Not screened' chip -> 3 priority questions added to the call guide"],
 ["P4","PRAPARE","2026-03-03","Housing status (71802-3)","'I have housing'",251,"STALE and now WRONG (ADT shows shelter)","Newer conflicting source wins display; 'housing changed?' confirmation"],
 ["P4","Plan benefit","-","Phone","Prepaid, frequently out of minutes",0,"",""],
 ["P5","D-SNP HRA","2026-02-20","Lives with","Daughter + 2 grandchildren",262,"",""],
 ["P5","D-SNP HRA","2026-02-20","Caregiver burden (Zarit)","Not assessed",262,"Missing; strain signal only in call-centre log","Insight: 'caregiver strain signal (30 Oct call)' -> suggest Zarit-4 on next call"],
]

CAREPLAN_COLS = ["Patient","Case open","Case type / owner","Goals","Open tasks","Last CM contact","Planted imperfection"]
CAREPLAN = [
 ["P1","2025-03-02","DM-HF / Maria R.","Daily weights; no HF admission in 12 mo","Annual HF review (done Aug)","2026-08-25","Case not yet switched to TOC after admission (manual today)"],
 ["P2","2026-06-15","Diabetes rising-risk / Maria R.","A1c < 8%","Outreach #3","2026-05-12 (PCP visit; no CM contact yet)","Never engaged"],
 ["P3","2026-09-22","Complex CM - ED utiliser / Maria R.","Engage; controller therapy; PCP visit","Locate member","never reached","-"],
 ["P4","2026-07-10","BH CM / Jordan K. (LCSW) + Maria R. (medical)","Engage in outpatient BH; MAT adherence","FUH follow-up","2026-09-30 (Jordan)","Two owners; neither got the discharge alert routed (it went to Maria's queue only)"],
 ["P5","2026-01-15","D-SNP MOC / Maria R.; LTSS case under legacy ID / Dana P.","Stay safely at home; fall prevention","Quarterly ICP review (Dec)","2026-09-10","Duplicate case under legacy ID"],
]

GAPS_COLS = ["Patient","Measure / clock","Source rule","Started","Due","Status at 08:00 Mon"]
GAPS = [
 ["P1","TRC - Patient engagement after discharge (plan target: contact within 2 business days)","HEDIS TRC / plan policy","2026-11-07","2026-11-10","OPEN - due tomorrow"],
 ["P1","TRC - Medication reconciliation post-discharge","HEDIS TRC","2026-11-07","2026-12-07","OPEN"],
 ["P1","Follow-up visit within 7 days (TCM 99496 high complexity)","CPT 99496 timing","2026-11-07","2026-11-14","OPEN - no appointment"],
 ["P2","Glycemic status > 9% (GSD)","HEDIS GSD","2026-10-22","2026-12-31","OPEN (9.8%)"],
 ["P2","Kidney health evaluation (KED)","HEDIS KED","-","2026-12-31","OPEN"],
 ["P3","Asthma medication ratio (AMR)","HEDIS AMR","-","2026-12-31","0.00 (needs >= 0.50)"],
 ["P4","FUH - follow-up within 7 days of psych discharge","HEDIS FUH","2026-11-05","2026-11-12","OPEN - 3 days left"],
 ["P4","FUH - 30 days","HEDIS FUH","2026-11-05","2026-12-05","OPEN"],
 ["P5","D-SNP HRA reassessment after significant change (fall)","SNP Model of Care","2026-11-06","asap (plan policy 30 days)","OPEN"],
 ["P5","Annual HRA","SNP MOC","2026-02-20","2027-02-20","Done"],
]

PROV_COLS = ["Patient","Provider","Role","Status (HiLabs MCheck)","Accepting new pts","Next open slot","Languages","Planted imperfection"]
PROV = [
 ["P1","Dr. Alan Whitcomb","PCP on file","INACTIVE - left practice 2026-09-30","-","-","EN","Stale PCP on 834 and in CM system"],
 ["P1","Dr. Priya Nair (same group)","Suggested PCP","Active","Yes","Thu 12 Nov 10:30","EN",""],
 ["P1","Riverton Cardiology - Dr. M. Ortiz","Cardiologist","Active","Existing pt","Tue 17 Nov","EN, ES",""],
 ["P2","Riverton CHC","PCP clinic (FQHC)","Active","Yes","Evening clinic Tue/Thu until 19:00","EN, ES",""],
 ["P3","Dr. S. Okoye, Eastside Primary Care","Assigned PCP","Active","Yes","Wed 11 Nov","EN","Attributed but never seen (18 mo)"],
 ["P4","Riverton CHC Behavioral Health","Outpatient BH","Active","Yes","Telehealth Tue 10 Nov 14:00; in-person Wed 11 Nov","EN",""],
 ["P5","Dr. H. Pham, Lakeside Geriatrics","PCP","Active","Existing pt","Fri 13 Nov","EN, VI",""],
]

APPT_COLS = ["Patient","Appointment","Date","Source","Status","Planted imperfection"]
APPTS = [
 ["P1","PCP follow-up","-","-","NONE BOOKED","Discharge said 'PCP in 7 days' - nobody booked"],
 ["P2","-","-","-","None",""],
 ["P3","PCP","-","-","None (never seen)",""],
 ["P4","BH follow-up","-","Referral REF-30011","NOT SCHEDULED",""],
 ["P5","Geriatrics follow-up","2026-11-20","Practice scheduling feed","Booked","Later than the clinically sensible window after a fall"],
]

RISK_COLS = ["Patient","Model","Score","As of","Inputs","Planted imperfection","Shown to Maria as"]
RISK = [
 ["P1","LACE (readmission)","13 (high)","2026-11-07","LOS 4, acute admission, Charlson 3, ED visits 1","","High readmission risk: 4-day stay + 3 comorbidities"],
 ["P1","Plan cost model (claims)","1.9","2026-08-31","claims through Aug","Stale (pre-admission)","Hidden behind drivers; 'as of Aug'"],
 ["P2","Plan rising-risk model","0.9 (low)","2026-06-30","claims only","STALE + blind to labs and fills -> under-calls risk","Recomputed signal: 'Rising: A1c +2.4 pts, 2 med gaps'"],
 ["P3","ED utiliser flag","4 ED / 77 d","2026-11-08","ADT + claims","",""],
 ["P4","Suicide / overdose risk","Clinician-assessed only","-","-","Deliberately NOT modelled by AI","Safety plan link"],
 ["P5","Fall risk (rule)","High","2026-11-06","2 falls/6 mo, dementia, age, sedating meds","",""],
]

INSIGHTS_COLS = ["Patient","Datasets combined","Derived insight shown on screen","What Maria does differently because she saw it","Automated vs clinician-confirmed"]
INSIGHTS = [
 ["P1","ADT discharge + discharge CCD + pharmacy fills + plan med list","'New HF med (Entresto) not dispensed: PA pending. Lisinopril still at home. Furosemide dose doubled.'","Calls today and does a 3-way med reconciliation instead of a generic TOC script","Diff: automated | Resolution: clinician"],
 ["P1","Provider directory (MCheck) + discharge instructions + appointments","'PCP on file has left. In-group PCP Dr. Nair has a slot Thu 12 Nov (within the 7-day window).'","Books the correct doctor on the first try","Suggestion: automated | Booking: confirm"],
 ["P1","UM prior auth + discharge CCD","'PA needs the LVEF; the CCD has LVEF 30%.'","Sends evidence to PA in one click, unblocking the drug","Draft: AI | Send: clinician"],
 ["P2","Labs (2 feeds, unit-normalised) + pharmacy gaps + call-centre log","'A1c 7.4 -> 9.8 since metformin refills ran out (Rx expired) and Jardiance was rejected after a PDL change; member called about cost 14 Oct'","Opens with access, not an adherence lecture: asks the PCP for a metformin renewal and a preferred SGLT2i (or a PA)","Insight: automated | Cause: clinician confirms on call"],
 ["P2","Contact history + inbound-call timestamps + provider hours","'Answers only in the evening; FQHC has evening clinic Thu'","Moves outreach to an 18:30 text + call window","Automated"],
 ["P3","ADT (4 EDs, fuzzy-matched) + pharmacy (6 SABA, 0 controller) + HEDIS AMR","'Uncontrolled severe asthma: 4 ED / 77 d, AMR 0.0'","Escalates to complex CM priority; targets the controller fill","Automated (match < 95% needs confirm)"],
 ["P3","Carrier lookup + ADT PID-13 + pharmacy fill times","'Old number reassigned; new mobile from ED Sunday; fills every Sat 18-20 at QuickRx #214'","Stops wasting dials; reaches him through the new number or the pharmacist","Automated; consent captured on first call"],
 ["P4","ADT discharge + FUH clock + referral status + appointments","'FUH 7-day window closes Thu; no visit booked'","Books telehealth Tue 14:00 during the first contact","Automated clock; booking confirmed"],
 ["P4","Pharmacy (buprenorphine runs out 11 Nov) + discharge med list (omitted)","'MAT continuity risk: supply ends Wed, missing from discharge list'","Calls the prescriber for a bridge today","Automated flag; clinical action: clinician"],
 ["P4","ADT address + NK1 contact + stale PRAPARE + phone status","'Now at shelter; phone out of minutes; shelter desk reachable mornings'","Uses a no-PHI callback via the shelter + Wi-Fi telehealth","Automated; consent rules enforced"],
 ["P5","ADT/ED CCD (ibuprofen) + labs (eGFR 22, K 5.4) + pharmacy (2nd pharmacy)","'NSAID prescribed with CKD 4 + high K'","Calls the pharmacy or prescriber before the next dose","Automated alert; decision: clinician"],
 ["P5","Eligibility (2 IDs) + care plan (2 cases) + LTSS auth","'Duplicate record with an open LTSS case (Dana P.); PCS assessment stalled 39 d'","Merges, coordinates one plan with Dana, escalates PCS","Merge: clinician confirms"],
 ["P5","Call-centre log + HRA (Zarit missing) + falls + dementia","'Caregiver strain signal + second fall'","Calls the daughter after 17:00; respite and home safety","Signal: AI-extracted; confirm"],
]
