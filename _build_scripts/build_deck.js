// HiLabs APM case deck: Case Management Workbench. Build: node build_deck.js <out.pptx> [prototypeUrl]
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const QRCode = require("qrcode");
const fa = require("react-icons/fa6");

const OUT = process.argv[2];
const PROTO_URL = process.argv[3] || "";
const IMG = path.join(__dirname, "img");

const COL = {
  navy: "0B1F4B", navy2: "16306B", ink: "1F2937", muted: "64748B", line: "D9DEE8", bg: "F4F6FB", white: "FFFFFF",
  teal: "0E8C7F", tealT: "E3F3F1", coral: "D9480F", coralT: "FDEBE3", amber: "B7791F", amberT: "FEF3DC",
  indigo: "4F46E5", indigoT: "ECEBFD", green: "15803D", greenT: "E4F4E8",
};
const THEME = { name: "Case Workbench", headFontFace: "Calibri", bodyFontFace: "Calibri",
  colors: { dk1: COL.ink, lt1: COL.white, dk2: COL.navy, lt2: COL.bg, accent1: COL.teal, accent2: COL.coral, accent3: COL.amber, accent4: COL.indigo, accent5: COL.muted, accent6: COL.green, hlink: COL.indigo, folHlink: COL.navy2 } };

async function icon(Comp, color, size = 256) {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = "Case Management Workbench - HiLabs APM Case 2026-27";
  pres.author = "APM candidate";
  pres.theme = { headFontFace: "Calibri", bodyFontFace: "Calibri" };
  const W = 13.333;

  pres.defineSlideMaster({
    title: "CONTENT", background: { color: COL.bg },
    objects: [
      { text: { text: "HiLabs APM Case 2026-27 · Case Management Workbench · all patient data synthetic (no PHI)", options: { x: 0.4, y: 7.12, w: 9, h: 0.25, fontSize: 8, color: COL.muted, margin: 0 } } },
    ],
    slideNumber: { x: 12.45, y: 7.1, w: 0.5, h: 0.28, fontSize: 8, color: COL.muted, align: "right" },
  });
  pres.defineSlideMaster({ title: "DARK", background: { color: COL.navy },
    slideNumber: { x: 12.45, y: 7.1, w: 0.5, h: 0.28, fontSize: 8, color: "AAB4CC", align: "right" } });

  const TABS = ["Executive\nsummary", "Persona &\nday in life", "Where the\nday is lost", "Data\ninventory", "Data →\ninsight", "Synthetic\npatients", "Screen 1\nToday queue", "Screen 2\nMember 360", "Screen 3\nOutreach", "Patient\nwalk-through", "Prioritise\n& measure", "Pilot &\nGTM"];
  function tabs(s, i, dark = false) {
    const x0 = 0.4, total = W - 0.8, gap = 0.05, n = TABS.length, w = (total - gap * (n - 1)) / n;
    TABS.forEach((t, k) => {
      const on = k === i;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + k * (w + gap), y: 0.14, w, h: 0.44, rectRadius: 0.08,
        fill: { color: on ? COL.teal : dark ? COL.navy2 : COL.white }, line: { color: on ? COL.teal : dark ? COL.navy2 : COL.line, width: 0.75 }, objectName: "tab" + k });
      s.addText(`${k + 1}. ${t}`, { x: x0 + k * (w + gap), y: 0.14, w, h: 0.44, fontSize: 7.5, bold: on, color: on ? COL.white : dark ? "C9D2E8" : COL.navy, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
  }
  function title(s, t, sub, dark = false) {
    s.addText(t, { x: 0.4, y: 0.68, w: W - 0.8, h: 0.55, fontSize: 23, bold: true, color: dark ? COL.white : COL.navy, margin: 0, valign: "middle", isTextBox: true, objectName: "Title" });
    if (sub) s.addText(sub, { x: 0.4, y: 1.22, w: W - 0.8, h: 0.32, fontSize: 12, color: dark ? "C9D2E8" : COL.teal, italic: true, margin: 0, valign: "middle", isTextBox: true });
  }
  function panel(s, x, y, w, h, label, opts = {}) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: opts.fill || COL.white }, line: { color: opts.lineColor || COL.line, width: 0.75 },
      shadow: { type: "outer", color: "000000", opacity: 0.07, blur: 3, offset: 1, angle: 90 } });
    if (label) s.addText(label, { x: x + 0.15, y: y + 0.08, w: w - 0.3, h: 0.3, fontSize: 11, bold: true, color: opts.labelColor || COL.navy, margin: 0, valign: "middle", isTextBox: true });
  }
  function T(s, text, x, y, w, h, o = {}) {
    s.addText(text, Object.assign({ x, y, w, h, fontSize: 10.5, color: COL.ink, margin: 0, valign: "top", isTextBox: true, paraSpaceAfter: 2 }, o));
  }
  function chip(s, text, x, y, w, fill, color, o = {}) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: o.h || 0.24, rectRadius: 0.05, fill: { color: fill }, line: { color: fill } });
    s.addText(text, { x, y, w, h: o.h || 0.24, fontSize: o.fs || 8.5, bold: o.bold !== false, color, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  function marker(s, n, x, y, color = COL.coral) {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.3, h: 0.3, fill: { color }, line: { color: COL.white, width: 1.5 } });
    s.addText(String(n), { x, y, w: 0.3, h: 0.3, fontSize: 10, bold: true, color: COL.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  function table(s, rows, x, y, w, colW, o = {}) {
    const fs = o.fs || 9;
    const body = rows.map((r, i) => r.map((c) => {
      const cell = typeof c === "object" && c !== null && c.text !== undefined ? c : { text: String(c) };
      const base = i === 0 ? { bold: true, color: COL.white, fill: { color: COL.navy }, fontSize: fs } : { color: COL.ink, fill: { color: i % 2 ? COL.white : "F8FAFD" }, fontSize: fs };
      return { text: cell.text, options: Object.assign({}, base, cell.options || {}) };
    }));
    s.addTable(body, { x, y, w, colW, border: { type: "solid", pt: 0.5, color: COL.line }, margin: [2, 4, 2, 4], valign: "middle", rowH: o.rowH, autoPage: false });
  }
  const ic = {
    nurse: await icon(fa.FaUserNurse, COL.white), clock: await icon(fa.FaClock, COL.white), db: await icon(fa.FaDatabase, COL.white),
    bolt: await icon(fa.FaBolt, COL.white), phone: await icon(fa.FaPhone, COL.white), shield: await icon(fa.FaShieldHalved, COL.white),
    chart: await icon(fa.FaChartLine, COL.white), rocket: await icon(fa.FaRocket, COL.white), warn: await icon(fa.FaTriangleExclamation, COL.white),
    pills: await icon(fa.FaPills, COL.white), robot: await icon(fa.FaRobot, COL.white), users: await icon(fa.FaUsers, COL.white),
  };
  function icCircle(s, data, x, y, color, d = 0.42) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color } });
    s.addImage({ data, x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56 });
  }
  let qrData = null;
  if (PROTO_URL) qrData = await QRCode.toDataURL(PROTO_URL, { margin: 1, width: 400, color: { dark: "#0B1F4B", light: "#FFFFFF" } });
  function qr(s, x, y, size, dark = false) {
    if (qrData) { s.addImage({ data: qrData, x, y, w: size, h: size }); }
    else {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: size, h: size, rectRadius: 0.05, fill: { color: dark ? COL.navy2 : COL.white }, line: { color: "AAB4CC", dashType: "dash" } });
      T(s, "QR code to the live prototype (added after Vercel deploy)", x + 0.08, y + 0.08, size - 0.16, size - 0.16, { fontSize: 8, color: dark ? "C9D2E8" : COL.muted, align: "center", valign: "middle" });
    }
  }

  /* =============== 1. EXECUTIVE SUMMARY =============== */
  let s = pres.addSlide({ masterName: "DARK" });
  tabs(s, 0, true);
  title(s, "Give Maria her judgment back: one trustworthy, prioritised morning instead of seven screens", "A Case Management Workbench MVP for a health plan's RN and social-work case managers, built on HiLabs-standardised data", true);
  // problem stats
  const stats = [["~79%", "of a case manager's day goes to hunting for data, dialling numbers that fail and re-typing documentation (our model, slide 3)"], ["2.5", "real clinical conversations a day, the only part that uses her ICU judgment"], ["~50%", "of patients leave hospital with an unintended medication discrepancy (systematic review)"], ["12–34%", "of first follow-up visits have the discharge summary available (Kripalani, JAMA)"]];
  T(s, "THE PROBLEM", 0.4, 1.72, 4, 0.25, { fontSize: 10, bold: true, color: "8FD3CB" });
  stats.forEach(([n, l], i) => {
    const y = 2.02 + i * 1.05;
    T(s, n, 0.4, y, 1.45, 0.6, { fontSize: 28, bold: true, color: i < 2 ? "FF9F7A" : COL.white, valign: "middle" });
    T(s, l, 1.9, y + 0.02, 2.55, 0.85, { fontSize: 10, color: "D7DDEC", valign: "middle" });
  });
  // solution
  T(s, "WHAT WE BUILD (MVP: 3 screens, overlay on the plan's existing CM system)", 4.75, 1.72, 5, 0.25, { fontSize: 10, bold: true, color: "8FD3CB" });
  const sol = [
    [ic.clock, "Today queue: who needs me, and why", "Ranked by clinical risk, regulatory clock (TRC 2-day, FUH 7-day), impactability and reachability. Exactly three reasons per member and a plan for the day built around each member's best call time."],
    [ic.db, "Member 360: one screen, every source", "An AI 'since last contact' brief where every line cites its source and date, freshness shown per source, and conflicts shown side by side, never auto-resolved. Medication diff across plan list, hospital and pharmacy."],
    [ic.phone, "Outreach & notes: talk, don't type", "Contact ladder with validated numbers and consent, an assessment that is about 60% pre-filled from data she verifies, and an AI-drafted note that becomes the contact note, care plan and audit record. The clinician signs."],
  ];
  sol.forEach(([d, h, b], i) => {
    const y = 2.05 + i * 1.42;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.75, y, w: 4.75, h: 1.28, rectRadius: 0.06, fill: { color: COL.navy2 }, line: { color: COL.navy2 } });
    icCircle(s, d, 4.9, y + 0.15, COL.teal);
    T(s, h, 5.45, y + 0.12, 3.95, 0.3, { fontSize: 12, bold: true, color: COL.white });
    T(s, b, 5.45, y + 0.42, 3.95, 0.85, { fontSize: 9.5, color: "D7DDEC" });
  });
  // impact
  T(s, "90-DAY PILOT TARGETS", 9.8, 1.72, 3.1, 0.25, { fontSize: 10, bold: true, color: "8FD3CB" });
  const tg = [["21 → 5 min", "prep per member"], ["2.5 → 5", "real conversations / CM / day"], ["−40%", "documentation time"], ["≥ 85%", "discharges contacted in 2 business days"]];
  tg.forEach(([n, l], i) => {
    const y = 2.02 + i * 0.66;
    T(s, n, 9.8, y, 1.75, 0.5, { fontSize: 17, bold: true, color: COL.white, valign: "middle" });
    T(s, l, 11.55, y, 1.4, 0.5, { fontSize: 9, color: "D7DDEC", valign: "middle" });
  });
  qr(s, 9.8, 4.75, 1.25, true);
  T(s, "Try it: the clickable prototype has 5 synthetic members and a Monday 08:00 snapshot", 11.15, 4.8, 1.8, 1.2, { fontSize: 9, color: "D7DDEC" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 6.3, w: W - 0.8, h: 0.62, rectRadius: 0.06, fill: { color: COL.teal }, line: { color: COL.teal } });
  T(s, [{ text: "Why HiLabs wins: ", options: { bold: true } }, { text: "incumbents (Jiva, GuidingCare, Epic) digitise the form and leave data quality to the nurse. HiLabs already cleans payer data at scale (MCheck, provider accuracy, outreach AI), so the facts arrive trusted, cited and current, and the form fills itself. AI drafts; the clinician decides." }],
    0.6, 6.33, W - 1.2, 0.56, { fontSize: 11, color: COL.white, valign: "middle" });
  s.addNotes("Executive summary. Problem, three-screen MVP, pilot targets and HiLabs' right to win. All numbers are sourced on later slides and in the appendix.");

  /* =============== 2. PERSONA + DAY IN LIFE =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 1);
  title(s, "Maria is an ICU-grade clinician working as a data clerk: two real conversations by 3 pm", "Persona (case manager only) and a Monday in her life. Composite built from the case, job postings at large MA and Medicaid plans, and published workflow studies");
  panel(s, 0.4, 1.7, 4.1, 5.25, "A. PERSONA: MARIA R., RN, CCM");
  icCircle(s, ic.nurse, 0.6, 2.12, COL.navy, 0.62);
  T(s, [{ text: "Remote telephonic complex CM + TOC nurse", options: { bold: true, breakLine: true } }, { text: "Regional MA, D-SNP and Medicaid plan · 20 yrs ICU · licensed in 3 compact states · 48 active cases" }], 1.35, 2.12, 3.05, 0.7, { fontSize: 10 });
  const pr = [
    ["Goals", "Catch the member who is about to crash. Pass the NCQA/state file audit. Go home on time."],
    ["Superpower", "Pattern-spotting: 'this med list doesn't add up', 'the caregiver is drowning'."],
    ["Tools today", "CM system, claims portal, UM/auth, PBM, HIE portal, old notes, her Excel tracker: 6–7 screens per member."],
    ["Frustrations", "Alerts with no reason · stale claims · numbers that don't work · the same facts typed 3–4 times · no idea who needs her first."],
    ["Constraints", "Licensure by member state · consent rules (HIPAA, 42 CFR Part 2, TCPA) · audit-ready notes for every attempt."],
    ["Supporting cast", "Social worker, BH counsellor (LCSW), CHW, UM nurse, supervisor. Not personas here, but the routing must know them."],
  ];
  pr.forEach(([h, b], i) => {
    const y = 2.95 + i * 0.66;
    T(s, h, 0.6, y, 1.1, 0.6, { fontSize: 9.5, bold: true, color: COL.teal });
    T(s, b, 1.7, y, 2.7, 0.62, { fontSize: 9.5 });
  });

  panel(s, 4.7, 1.7, 8.23, 3.85, "B. MONDAY, 08:00 → 19:00 (A DAY IN THE LIFE, CASE NARRATIVE + OUR RESEARCH)");
  const day = [
    ["08:00", "6 discharge alerts since Friday. None say why the member was admitted.", "Untimely data", COL.amber],
    ["08:20", "Member #1: opens 7 screens. Latest claim is 45 days old.", "Data hunting", COL.coral],
    ["09:05", "Hospital list says 'stop lisinopril'; pharmacy refilled it. She calls the hospital to check.", "Messy data", COL.coral],
    ["10:00", "4 calls: 3 voicemails, 1 disconnected number.", "Hard outreach", COL.amber],
    ["11:30", "Reaches 1 member; must complete a 40-field assessment before closing the contact.", "Documentation", COL.coral],
    ["13:00", "Hunts for a discharge summary that has not arrived.", "Untimely data", COL.amber],
    ["14:30", "2nd real conversation. Senses the caregiver is overwhelmed, but there is no field for that.", "Judgment unused", COL.teal],
    ["17:30", "Re-types the same facts into the care plan and audit forms, after hours.", "Documentation", COL.coral],
  ];
  day.forEach(([t, d, tag, c], i) => {
    const col = i < 4 ? 0 : 1, row = i % 4, x = 4.9 + col * 4.05, y = 2.15 + row * 0.82;
    T(s, t, x, y, 0.55, 0.3, { fontSize: 10.5, bold: true, color: COL.navy });
    T(s, d, x + 0.6, y, 3.3, 0.52, { fontSize: 9.5 });
    chip(s, tag, x + 0.6, y + 0.52, 1.35, c === COL.teal ? COL.tealT : c === COL.amber ? COL.amberT : COL.coralT, c, { fs: 8 });
  });

  panel(s, 4.7, 5.7, 8.23, 1.25, "C. WHAT A BAD DAY COSTS");
  const cost = [["Member", "Missed 2-business-day contact after an HF discharge; a med conflict goes unseen."], ["Plan", "One avoidable readmission ≈ $15.2k (HCUP); TRC/FUH misses hit HEDIS and Star ratings."], ["Maria", "58% of RNs report burnout most days (AMN 2025); 77% of clinicians do admin after hours (AMIA)."]];
  cost.forEach(([h, b], i) => {
    const x = 4.9 + i * 2.7;
    T(s, h, x, 6.05, 2.5, 0.25, { fontSize: 10, bold: true, color: COL.coral });
    T(s, b, x, 6.3, 2.55, 0.6, { fontSize: 9 });
  });
  s.addNotes("Persona is a composite; the quoted narrative points come from the case. Burnout and after-hours stats are for nurses or clinicians broadly, not health plan CMs specifically: flagged as indirect evidence.");

  /* =============== 3. DAY LOST + PAIN RANKING =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 2);
  title(s, "79% of Maria's day is hunting, failed dialling and re-typing; only 13% is clinical talk", "A transparent model: every input is an editable assumption in the annex (Day_Lost_Model tab). Confidence: medium, to be validated with a 2-week time-motion baseline in the pilot");
  panel(s, 0.4, 1.7, 6.35, 5.25, "A. WHERE THE DAY GOES (MINUTES PER 8-HOUR DAY)");
  s.addChart(pres.charts.BAR, [{ name: "Minutes", labels: ["Data hunting & prep", "Documentation", "Dialling that fails", "Real conversations", "Coordination", "Other / admin"], values: [213, 110, 56, 63, 32, 6] }], {
    x: 0.55, y: 2.05, w: 6.05, h: 2.75, barDir: "bar", chartColors: [COL.coral, COL.coral, COL.coral, COL.teal, COL.teal, "94A3B8"],
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 9, dataLabelColor: COL.ink, dataLabelFontFace: "+mn-lt",
    catAxisLabelFontSize: 9, catAxisLabelColor: COL.ink, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisOrientation: "maxMin", showLegend: false, barGapWidthPct: 45 });
  table(s, [
    ["Bucket", "Arithmetic (assumption)", "Min", "Share"],
    ["Hunting & prep", "10 members × (6.5 screens × 2.5 min + 5 min reconciling)", "213", "44%"],
    ["Documentation", "1 assessment × 35 + 10 notes × 5 + 25 re-entry", "110", "23%"],
    ["Failed dialling", "18 attempts × 78% no-connect × 4 min", "56", "12%"],
    ["Conversations", "2.5 × 25 min (case: '2 by 3 pm')", "63", "13%"],
    ["Coordination + other", "4 tasks × 8 min + remainder", "38", "8%"],
  ], 0.55, 4.9, 6.05, [1.35, 3.6, 0.5, 0.6], { fs: 8.5, rowH: 0.27 });
  T(s, "Connect rate 22% (industry 20–30%; Medicaid reach can be <20%). Screens per member from the case.", 0.55, 6.62, 6.05, 0.3, { fontSize: 8.5, italic: true, color: COL.muted });

  panel(s, 6.95, 1.7, 5.98, 5.25, "B. PAIN POINTS RANKED BY IMPACT");
  T(s, "Impact = time cost (1–5) × member risk (1–5) × how far a workbench can fix it (1–3)", 7.1, 2.03, 5.7, 0.25, { fontSize: 9, italic: true, color: COL.muted });
  const pain = [
    ["#", "Pain point (obstacle in the case)", "Evidence", "T", "R", "F", "Score"],
    ["1", "Data hunting across 6–7 systems; sources disagree (messy data)", "213 min/day; ~50% of discharges have a med discrepancy", "5", "5", "3", "75"],
    ["2", "Same facts re-typed into assessment, care plan, notes and audit forms (documentation)", "110 min/day; after-hours charting", "4", "3", "3", "36"],
    ["3", "No ranking and hidden clocks: 'who needs me today?' (work burden)", "TRC 2-day and FUH 7-day windows missed silently", "2", "5", "3", "30"],
    ["4", "Late or partial data: ADT without a reason, summaries missing (untimely data)", "Diagnosis optional in ADT rules; summary at 12–34% of first visits", "3", "5", "2", "30"],
    ["5", "Wrong numbers, wrong times, consent and trust barriers (hard outreach)", "≥ 24% of Medicaid numbers inaccurate (NBER); 78% of calls fail", "3", "4", "2", "24"],
  ];
  table(s, pain, 7.1, 2.32, 5.7, [0.3, 2.25, 1.95, 0.27, 0.27, 0.27, 0.39], { fs: 8.5, rowH: 0.52 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.1, y: 5.62, w: 5.7, h: 1.2, rectRadius: 0.05, fill: { color: COL.tealT }, line: { color: COL.tealT } });
  T(s, [{ text: "So what: fix the facts first. ", options: { bold: true, color: COL.teal } }, { text: "Hunting and documentation are 2/3 of the lost time, and both collapse once facts arrive pre-assembled with sources. Ranking and clocks cost few minutes but carry the most member risk, so they ship in the same MVP. Outreach gets a data fix (valid number, best time) before any new channel." }], 7.25, 5.68, 5.45, 1.1, { fontSize: 9.5 });
  s.addNotes("Model inputs are assumptions; the case gives screens per member and conversations per day. Sensitivity: even at 4 screens × 2 min, hunting is still the #1 bucket (about 130 min).");

  /* =============== 4. DATA INVENTORY =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 3);
  title(s, "15 must-have datasets, each tied to a decision; claims are the slowest and least useful", "Inventory: source, what it tells the clinician, freshness, expected quality problems and how the screen handles them, and priority");
  const fr = (t, lvl) => ({ text: t, options: { color: lvl === 2 ? COL.green : lvl === 1 ? COL.amber : COL.coral, bold: true } });
  table(s, [
    ["Dataset", "Source / standard", "What Maria decides with it", "Fresh", "Quality problem → how the screen handles it"],
    ["ADT event alerts", "HL7 v2 A01/A03/A04 via HIE (CMS CoP)", "Event now: starts TRC/FUH clocks, re-ranks queue", fr("Minutes", 2), "No diagnosis (optional), late batches, name typos → 'reason unknown' chip + CCD request"],
    ["Discharge summary / CCD", "C-CDA / FHIR; Provider Access API (2027)", "Why admitted, discharge meds, follow-up plan", fr("Hours–never", 1), "Partial or missing sections → shown as 'not provided', never silently blank"],
    ["Pharmacy fills + rejects", "NCPDP via PBM; NDC → RxNorm", "What was actually picked up; gaps; blocked new drugs", fr("1–3 days", 2), "Cash fills invisible, rejects hidden → rejects on timeline; gap = 'unknown', not 'non-adherent'"],
    ["Med list diff (derived)", "Plan list × discharge × fills", "Reconcile before harm (TRC med rec)", fr("On change", 2), "3 lists disagree → side-by-side diff; AI proposes, clinician resolves"],
    ["Labs & observations", "HL7 ORU / FHIR; LOINC", "Control and safety: A1c, NT-proBNP, K+, eGFR, PHQ-9", fr("1–3 days", 2), "Duplicate feeds, mixed units → normalised, de-duplicated, trend + age badge"],
    ["Prior auth / UM", "Plan UM; CMS-0057 PA API", "Is a needed drug blocked? What unblocks it?", fr("Real-time", 2), "Siloed from CM → PA status inline on the med + 'evidence available' link"],
    ["Contact history + call centre", "CM system, dialler, CRM", "What was tried; signals buried in member-services calls", fr("Real-time", 2), "Unrouted inbound notes → AI tags cost / caregiver-strain signals for review"],
    ["Contact-point quality", "Carrier lookup, reassigned-number DB, ADT", "Which number first, when, and is it legal to dial", fr("Weekly + events", 2), "≥ 20–24% wrong numbers → confidence per number; reassigned numbers suppressed"],
    ["Care gaps & clocks", "HEDIS engine (TRC, FUH, AMR), SNP MOC", "What is due when, which drives urgency", fr("Daily", 2), "Gap closure lags → countdown on the queue row"],
    ["Provider directory", "HiLabs MCheck; NPPES", "Is the PCP real, active, accepting? Next slot?", fr("Weekly", 2), "Directories inaccurate → inactive PCP flagged + in-group alternative"],
    ["Member & eligibility", "834 enrollment, plan MDM", "Who, PCP, language, dual status, who she may speak with", fr("Daily", 2), "Stale PCP/address, duplicate IDs → identity resolution, merge request"],
    ["Care plan & notes", "CM system", "Goals, barriers, last conversation", fr("Real-time", 2), "Long free text, duplicate cases → cited 'since last contact' brief"],
    ["SDOH screens & HRA", "AHC-HRSN / PRAPARE, D-SNP HRA, Z codes", "Barriers: housing, food, transport, phone, caregiver", fr("8–12 months", 0), "Stale; Z codes on only 1–1.6% of claims → age badge; newer source wins"],
    ["Medical claims", "837I/P: ICD-10-CM, CPT/HCPCS, DRG", "History and utilisation pattern", fr("30–60+ days", 0), "Lag hides recent events → 'complete through <date>'; absence ≠ negative"],
    ["Risk scores", "LACE, plan ML (input only)", "Long-run risk, one of 4 ranking inputs", fr("Monthly", 0), "Stale, opaque → drivers shown, not raw scores"],
  ], 0.4, 1.62, 12.53, [1.6, 2.3, 3.05, 0.9, 4.68], { fs: 8, rowH: 0.27 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 6.6, w: 12.53, h: 0.42, rectRadius: 0.05, fill: { color: COL.white }, line: { color: COL.line } });
  T(s, [{ text: "Phase 2: ", options: { bold: true, color: COL.navy } }, { text: "appointments feed · BH/SUD records (42 CFR Part 2, consent-gated) · remote monitoring · closed-loop community referrals · supplemental benefits (rides, meals, phone) · OASIS/MDS · PDMP.   " }, { text: "Deliberately out: ", options: { bold: true, color: COL.coral } }, { text: "HCC/risk-adjustment coding prompts (conflict with clinical trust)." }], 0.55, 6.61, 12.25, 0.4, { fontSize: 9, valign: "middle" });
  s.addNotes("Full inventory with 23 datasets, freshness and handling is in the annex (Dataset_Inventory). Ordered by decision value, not by data volume.");

  /* =============== 5. DATA → INSIGHT =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 4);
  title(s, "Insight lives in combinations: 2–4 datasets together tell Maria what no single screen can", "Six recipes from the synthetic patients, the trust rules every fact follows on screen, and our answer on SNOMED CT as an 'umbrella'");
  panel(s, 0.4, 1.7, 7.6, 5.25, "A. DATASETS COMBINE INTO A DECISION");
  const rec = [
    [["ADT discharge", "Discharge CCD", "Pharmacy rejects", "Plan med list"], "New HF drug not dispensed (PA pending); old ACE-inhibitor still at home; diuretic dose doubled", "Calls today; 3-way med rec with the 36 h washout rule"],
    [["Provider dir. (MCheck)", "Discharge plan", "Appointments"], "PCP on file has left; in-group PCP has a slot inside the 7-day window", "Books the right doctor first time"],
    [["Labs ×2 feeds", "Fills + rejects", "Call-centre log"], "A1c 7.4 → 9.8% since refills ran out and the formulary dropped her drug", "Opens with access, not an adherence lecture"],
    [["ADT (fuzzy match)", "Fills (6 rescue, 0 controller)", "Carrier lookup"], "Uncontrolled asthma; old number reassigned; new mobile from Sunday's ED visit", "Stops wasted dials; uses the new number + pharmacist"],
    [["ADT psych discharge", "FUH clock", "Fills", "Discharge meds"], "Buprenorphine runs out Wed and is missing from the discharge list; FUH closes Thu", "Prescriber bridge + telehealth before Thu"],
    [["ED CCD", "Labs (eGFR 22)", "2nd pharmacy fill"], "NSAID prescribed with CKD 4 and K+ 5.4", "Calls the prescriber before the next dose"],
  ];
  T(s, "Datasets combined", 0.55, 2.05, 2.6, 0.22, { fontSize: 8.5, bold: true, color: COL.muted });
  T(s, "Insight shown on screen", 3.25, 2.05, 2.7, 0.22, { fontSize: 8.5, bold: true, color: COL.muted });
  T(s, "What Maria does differently", 6.05, 2.05, 1.85, 0.22, { fontSize: 8.5, bold: true, color: COL.muted });
  rec.forEach(([chips, ins, act], i) => {
    const y = 2.32 + i * 0.76;
    chips.forEach((c, k) => {
      const cx = 0.55 + (k % 2) * 1.32, cy = y + Math.floor(k / 2) * 0.3;
      chip(s, c, cx, cy, 1.27, COL.indigoT, COL.indigo, { fs: 7.5, h: 0.26 });
    });
    T(s, ins, 3.25, y, 2.7, 0.66, { fontSize: 9 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.02, y: y - 0.02, w: 1.88, h: 0.66, rectRadius: 0.05, fill: { color: COL.tealT }, line: { color: COL.tealT } });
    T(s, act, 6.07, y, 1.8, 0.62, { fontSize: 8.5, bold: true, color: COL.teal, valign: "middle" });
  });

  panel(s, 8.2, 1.7, 4.73, 2.55, "B. TRUST RULES: EVERY FACT ON SCREEN");
  const rules = [["Provenance", "value + source + event date + date received"], ["Freshness", "pill per source: green days · amber weeks · red lagged"], ["Conflict", "both sides shown in amber; never auto-resolved"], ["Confidence", "dot: identity match %, phone validity, self-report age"], ["Absence ≠ no", "'claims complete through 18 Sep', not 'no admissions'"]];
  rules.forEach(([h, b], i) => {
    const y = 2.08 + i * 0.42;
    T(s, h, 8.35, y, 1.1, 0.38, { fontSize: 9.5, bold: true, color: COL.navy });
    T(s, b, 9.45, y, 3.35, 0.38, { fontSize: 9 });
  });

  panel(s, 8.2, 4.4, 4.73, 2.55, "C. CODES → CLINICAL MEANING (SNOMED VERDICT)");
  table(s, [
    ["Source", "Code (system)"],
    ["Claim", "I50.23 (ICD-10-CM)"],
    ["Discharge CCD", "443253003 (SNOMED CT)"],
    ["Pharmacy", "1656340 (RxNorm) ← NDC 00904758004"],
    ["Lab", "33762-6 NT-proBNP (LOINC)"],
  ], 8.35, 4.75, 2.4, [0.85, 1.55], { fs: 7.5, rowH: 0.24 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.85, y: 4.75, w: 1.95, h: 1.2, rectRadius: 0.05, fill: { color: COL.navy }, line: { color: COL.navy } });
  T(s, "Maria sees: 'Heart failure, worsening · LVEF 30% · new Entresto not dispensed'", 10.92, 4.8, 1.82, 1.1, { fontSize: 8.5, color: COL.white, bold: true, valign: "middle" });
  T(s, [{ text: "SNOMED CT is not one umbrella: ", options: { bold: true, color: COL.coral } }, { text: "CPT has no maintained map, and US drugs run on RxNorm. Use one standard per domain (SNOMED conditions · RxNorm drugs · LOINC labs, as OMOP does), keep the source code, and show plain language." }], 8.35, 6.03, 4.5, 0.88, { fontSize: 8.5 });
  s.addNotes("SNOMED International release (2026-10-01) ships an extended map to WHO ICD-10; NLM publishes the US ICD-10-CM map; LOINC Ontology links LOINC parts to SNOMED (2025). CPT is AMA-proprietary.");

  /* =============== 6. SYNTHETIC PATIENTS =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 5);
  title(s, "Five synthetic members, five different ways the data lies, each with an 8 am Monday answer", "Annex: 16 datasets (10–16 per member), 143 records, amber-flagged planted imperfections; every ICD-10-CM, LOINC and RxNorm/NDC code verified against NLM APIs");
  const pts = [
    ["#1 · 94", "Harold Brennan, 71", "MA HMO · TOC", "Fresh heart-failure discharge", ["ADT admit had no diagnosis", "PCP on file left practice (834 stale)", "3 med lists disagree", "Claims 52 days behind"], "Call this morning (TRC clock Tue). Reconcile lisinopril / Entresto / furosemide, send LVEF to the PA, book Dr. Nair Thu.", COL.coral],
    ["#2 · 91", "Tanya Brooks, 33", "Medicaid · BH CM", "BH discharge + housing loss", ["Discharge list omits buprenorphine", "SDOH 'housed' vs shelter on ADT", "Prepaid phone out of minutes", "Part 2 SUD records restricted"], "Shelter-desk callback (no PHI). Telehealth Tue (FUH Thu). Bridge buprenorphine; loop in the LCSW.", COL.coral],
    ["#3 · 86", "Thi Mai Tran, 82", "D-SNP dual · MOC", "2nd fall · caregiver strain", ["Duplicate Medicaid ID + open LTSS case", "NSAID with CKD 4 at a 2nd pharmacy", "Caregiver strain only in call log", "ICD code sent without decimal"], "Stop ibuprofen via prescriber now. Merge record with Dana P. Call daughter after 17:00. Post-fall HRA.", COL.coral],
    ["#4 · 78", "Tyler Kowalski, 29", "Medicaid · Complex CM", "Unreachable frequent ED user", ["Name/DOB differ across hospitals (92%)", "Phone on file reassigned", "Claims show 2 of 4 ED visits", "Controller prescribed, never filled"], "Suppress old number. SMS + call the ED-captured mobile at noon. Pharmacist note at QuickRx. PCP Wed.", COL.amber],
    ["#5 · 61", "Denise Carter, 54", "Medicaid · Diabetes", "Rising risk; stopped refills", ["Same A1c in 2 units (2 feeds)", "Rejected Jardiance hidden on paid claims", "Cost call never routed to CM", "Risk model still says 'low'"], "Not urgent today. SMS now, call 18:30. Metformin renewal + preferred SGLT2i. Thu evening clinic.", "64748B"],
  ];
  const cw = (W - 0.8 - 0.2 * 4) / 5;
  pts.forEach(([rk, nm, plan, sc, imps, line, c], i) => {
    const x = 0.4 + i * (cw + 0.2), y = 1.7;
    panel(s, x, y, cw, 5.25, null);
    chip(s, rk, x + 0.15, y + 0.15, 0.85, c, COL.white, { fs: 10, h: 0.3 });
    T(s, nm, x + 0.15, y + 0.52, cw - 0.3, 0.3, { fontSize: 12.5, bold: true, color: COL.navy });
    T(s, plan, x + 0.15, y + 0.82, cw - 0.3, 0.25, { fontSize: 9, color: COL.muted });
    T(s, sc, x + 0.15, y + 1.07, cw - 0.3, 0.3, { fontSize: 10, bold: true, italic: true, color: COL.teal });
    T(s, "PLANTED IMPERFECTIONS", x + 0.15, y + 1.45, cw - 0.3, 0.22, { fontSize: 8, bold: true, color: COL.amber });
    imps.forEach((im, k) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: y + 1.7 + k * 0.5, w: cw - 0.3, h: 0.44, rectRadius: 0.04, fill: { color: COL.amberT }, line: { color: COL.amberT } });
      T(s, im, x + 0.22, y + 1.72 + k * 0.5, cw - 0.44, 0.4, { fontSize: 8.5, valign: "middle" });
    });
    T(s, "8 AM MONDAY", x + 0.15, y + 3.75, cw - 0.3, 0.22, { fontSize: 8, bold: true, color: COL.teal });
    T(s, line, x + 0.15, y + 3.98, cw - 0.3, 1.2, { fontSize: 9 });
  });
  s.addNotes("Ranks come from the prototype's priority formula. Denise has the lowest rank even though her plan risk model is stale: she is important this week, not this morning.");

  /* =============== 7–9. SCREENS =============== */
  function screenSlide(idx, ttl, sub, img, imgW, imgH, marks, callouts, extra) {
    const s = pres.addSlide({ masterName: "CONTENT" });
    tabs(s, idx);
    title(s, ttl, sub);
    const boxH = 5.25, scale = Math.min(7.55 / imgW, boxH / imgH);
    const w = imgW * scale, h = imgH * scale, x = 0.4, y = 1.7;
    s.addShape(pres.shapes.RECTANGLE, { x: x - 0.02, y: y - 0.02, w: w + 0.04, h: h + 0.04, fill: { color: COL.white }, line: { color: COL.line } });
    s.addImage({ path: path.join(IMG, img), x, y, w, h, altText: ttl });
    marks.forEach(([n, px, py]) => marker(s, n, x + px * scale - 0.15, y + py * scale - 0.15));
    const cx = x + w + 0.25, cwid = W - 0.4 - cx;
    panel(s, cx, 1.7, cwid, extra ? 3.35 : 5.25, "WHAT SITS WHERE, AND WHY");
    callouts.forEach(([h, b], i) => {
      const yy = 2.08 + i * (extra ? 0.52 : 0.82);
      marker(s, i + 1, cx + 0.15, yy);
      T(s, [{ text: h + ": ", options: { bold: true, color: COL.navy } }, { text: b }], cx + 0.55, yy - 0.02, cwid - 0.7, extra ? 0.5 : 0.8, { fontSize: 9 });
    });
    if (extra) extra(s, cx, cwid);
    return s;
  }

  s = screenSlide(6, "Screen 1, Today queue: 'who needs me, and why' answered before 08:05", "Above the fold: only what changes Maria's next hour. Ranked, explained, clock-aware, and timed to when each member actually answers",
    "queue.png", 1440, 1130,
    [[1, 22, 100], [2, 22, 340], [3, 22, 410], [4, 22, 455], [5, 1052, 112], [6, 1052, 668]],
    [["Overnight delta", "6 new events, 3 clocks ≤ 72 h, 4 med-safety conflicts, acuity-weighted load (71/75), not raw case counts"],
     ["Ranked rows, 3 reasons each", "No unexplained scores. Each reason is a fact Maria can verify in one click"],
     ["Regulatory clocks", "TRC 2-business-day contact, FUH 7-day, post-fall HRA shown as a countdown on the row"],
     ["'Why this rank?'", "Priority = clinical risk /35 + clock urgency /30 + impactability /25 + reachable today /10. She can override; overrides train the model"],
     ["Today's plan", "Calls slotted into each member's learned answer window (Harold mornings, Denise 18:30)"],
     ["Spike warning", "ADT shows 3 members inpatient now, so the supervisor pauses new TOC assignments before the wave hits"]]);
  s.addNotes("Deliberately hidden: 43 routine cases are collapsed; raw risk scores are never shown as a number.");

  s = screenSlide(7, "Screen 2, Member 360: the 7 screens become 1, with sources, freshness and conflicts visible", "Walk-through: Harold Brennan, 2 days post HF discharge. Everything Maria needs to call him with confidence, in about 2 minutes of reading",
    "member_P1.png", 1440, 1050,
    [[1, 22, 120], [2, 22, 182], [3, 22, 255], [4, 22, 470], [5, 22, 830], [6, 1016, 255]],
    [["Header", "Who she may speak with (HIPAA authorisation), language, active clock and one-click outreach"],
     ["Freshness strip", "One pill per source. Claims are red ('complete through 18 Sep'), so she knows why the admission isn't on them"],
     ["Since-last-contact brief (AI)", "Every line cites sources and dates, with a confidence dot. ✓ confirm or ✗ flag; flags go to the HiLabs data team"],
     ["Conflict cards", "Amber when sources disagree ('3 lists disagree'); both sides are shown and nothing is auto-resolved"],
     ["Medication diff", "Plan list vs. hospital vs. pharmacy. AI proposes a resolution, the clinician decides and documents"],
     ["Next best actions", "Ranked, each with a why, an AI-prepared artifact and an owner tag: clinician decides / one-click confirm / automated"]]);
  s.addNotes("Below the fold: timeline showing event time vs received time, providers (inactive PCP flagged via HiLabs MCheck), SDOH with age of data.");

  s = screenSlide(8, "Screen 3, Outreach & notes: Maria talks; the system drafts, she verifies and signs", "Walk-through: Harold's call. 8 of 11 assessment fields pre-filled from data; one AI draft replaces four rounds of re-typing",
    "outreach_P1_draft.png", 1440, 1080,
    [[1, 22, 265], [2, 364, 258], [3, 364, 600], [4, 364, 772], [5, 364, 1030]],
    [["Contact ladder", "Numbers ranked by confidence, owner, learned best window and consent; reassigned numbers suppressed (TCPA)"],
     ["Pre-filled assessment", "Green = from data (verify), amber = conflict to resolve on the call, white = ask the member"],
     ["Ask only what data can't tell", "Symptoms, today's weight, teach-back: the judgment questions"],
     ["One draft, many outputs", "The note becomes contact note + care-plan update + audit evidence (TRC/FUH), so nothing is re-typed"],
     ["Clinician signs", "Maria is the author. Edits and unedited acceptance are logged as guardrails"]],
    (sl, cx, cwid) => {
      panel(sl, cx, 5.2, cwid, 1.75, "AI CONTRACT: WHAT IS AUTOMATED VS CONFIRMED", { fill: COL.indigoT, lineColor: COL.indigoT, labelColor: COL.indigo });
      const tiers = [["Automated", "de-dup, unit/code normalisation, freshness, number validation, call logging"], ["AI drafts → you confirm", "brief, ranking, med diff, pre-fill, note, tasks, PA evidence"], ["Clinician only", "med changes, escalation, safety assessment, goals, merges < 95%, closure"]];
      tiers.forEach(([h, b], i) => T(sl, [{ text: h + ": ", options: { bold: true, color: COL.indigo } }, { text: b }], cx + 0.15, 5.55 + i * 0.45, cwid - 0.3, 0.44, { fontSize: 9 }));
    });
  s.addNotes("CMS Feb 2024 FAQ and California SB 1120 require individual, clinician-made decisions in coverage; we apply the same human-in-the-loop principle to care management even though this is not UM.");

  /* =============== 10. WALKTHROUGH =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 9);
  title(s, "Three members, three screens: 135 minutes of hunting become 38 of care", "Before/after minutes are our estimates from the day model (prep + dialling + documentation per member), to be measured in the pilot");
  const cols = ["1 · Today queue shows", "2 · Member 360 reveals", "3 · Outreach & notes", "4 · Outcome, documented once"];
  const lanes = [
    ["Harold · HF discharge", ["#1 (94): TRC contact due tomorrow; Entresto rejected; PCP left", "Brief: PA needs LVEF (in CCD); lisinopril at home; furosemide doubled. Med diff marks a safety conflict", "08:30 landline (2/2 morning connects); 8/11 fields pre-filled; teach-back with Margaret", "Med rec signed; LVEF sent to PA; Dr. Nair Thu booked; TRC engagement + med-rec evidence captured"], "45 → 12"],
    ["Tanya · BH + housing", ["#2 (91): FUH closes Thu; buprenorphine missing; phone out of minutes", "Part 2 banner (consent needed); address conflict → shelter; med diff: buprenorphine ABSENT", "Shelter-desk callback, no PHI; SMS Wi-Fi telehealth link; C-SSRS safety check on the call", "Telehealth Tue 14:00 (FUH met); prescriber bridge requested; LCSW co-owner notified; phone + housing referrals"], "60 → 16"],
    ["Tyler · frequent ED", ["#4 (78): 4 ED / 77 days; 'identity check' chip", "92% match across hospitals → confirm; AMR 0.0; old number reassigned; new mobile from ED", "Old number suppressed; SMS then call 555-0193 at noon; pharmacist note at QuickRx", "Identity + SMS consent captured; $0 controller filled; PCP Wed; ED pattern on watch"], "30 → 10"],
  ];
  cols.forEach((c, k) => chip(s, c, 2.35 + k * 2.47, 1.7, 2.37, COL.navy, COL.white, { fs: 9.5, h: 0.34 }));
  chip(s, "Min before → after", 12.25, 1.7, 0.68, COL.teal, COL.white, { fs: 7.5, h: 0.34 });
  lanes.forEach(([nm, cells, mins], r) => {
    const y = 2.15 + r * 1.62;
    panel(s, 0.4, y, 12.53, 1.5, null);
    T(s, nm, 0.55, y + 0.12, 1.7, 1.3, { fontSize: 11.5, bold: true, color: COL.navy, valign: "middle" });
    cells.forEach((c, k) => {
      const fill = k === 3 ? COL.tealT : COL.bg;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 2.35 + k * 2.47, y: y + 0.1, w: 2.37, h: 1.3, rectRadius: 0.05, fill: { color: fill }, line: { color: fill } });
      T(s, c, 2.43 + k * 2.47, y + 0.14, 2.22, 1.22, { fontSize: 9, valign: "middle" });
    });
    T(s, mins, 12.25, y + 0.12, 0.68, 1.3, { fontSize: 11, bold: true, color: COL.teal, align: "center", valign: "middle" });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 7.0 - 0.02 - 0.0, w: 0.01, h: 0.01, fill: { color: COL.bg }, line: { color: COL.bg } });
  s.addNotes("Harold 45 min before = 7 screens (18) + med-list hunting (12) + assessment and notes (15). After = brief (3) + call prep (2) + verify and sign (7). Similar logic for the others.");

  /* =============== 11. PRIORITISE & MEASURE =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 10);
  title(s, "Ship the trust layer first: queue + 360 + med diff; measure conversations, not clicks", "RICE prioritisation, baseline → target metrics, and the risks that would kill clinician trust, with mitigations");
  panel(s, 0.4, 1.7, 4.3, 5.25, "A. MVP VS LATER (RICE = R × I × C ÷ E)");
  const feats = [["Ranked queue + clocks", 5, 4, 0.8, 2], ["Member 360: freshness + conflicts", 5, 5, 0.9, 3], ["Cited 'since last contact' brief", 5, 4, 0.7, 2], ["Contact ladder + number validation", 4, 4, 0.8, 2], ["Medication diff (3 lists)", 4, 5, 0.8, 3], ["Assessment pre-fill + note draft", 5, 4, 0.7, 3], ["Supervisor rebalancing view", 2, 3, 0.6, 3], ["Scheduling write-back", 3, 3, 0.5, 4], ["Ambient call transcription", 4, 4, 0.5, 4], ["Deterioration prediction ML", 3, 3, 0.4, 5]];
  const frows = feats.map(([f, r, i, c, e]) => { const sc = (r * i * c / e); return [f, r, i, c, e, sc.toFixed(1), sc >= 4 ? { text: "MVP", options: { bold: true, color: COL.teal } } : { text: "Later", options: { color: COL.muted } }]; });
  table(s, [["Feature", "R", "I", "C", "E", "Score", ""], ...frows], 0.55, 2.05, 4.0, [1.85, 0.3, 0.3, 0.35, 0.3, 0.45, 0.45], { fs: 8.5, rowH: 0.3 });
  T(s, [{ text: "Deliberately out: ", options: { bold: true, color: COL.coral } }, { text: "AI messaging members unsupervised; AI clinical decisions; HCC coding prompts; replacing the CM system of record (we overlay it)." }], 0.55, 5.55, 4.0, 1.3, { fontSize: 9 });

  panel(s, 4.85, 1.7, 4.15, 5.25, "B. METRICS: BASELINE → 90-DAY TARGET");
  table(s, [
    ["Metric", "Baseline", "Target"],
    [{ text: "North star: real conversations / CM / day", options: { bold: true, color: COL.teal } }, "2.5", "5"],
    ["Prep time per member", "~21 min", "≤ 5 min"],
    ["Documentation per contact", "~11 min", "−40%"],
    ["Notes finished after 17:30", "measure wk 0–2", "halve"],
    ["Outreach connect rate", "~22%", "+10 pp"],
    ["Discharge contact ≤ 2 business days", "~50% (assumed)", "≥ 85%"],
    ["FUH 7-day / TRC med rec", "plan baseline", "+10 / +15 pp"],
    ["Active cases per CM (acuity-wtd)", "48", "55–60"],
    ["30-day readmits (TOC cohort, lagging)", "~17%", "−1–2 pp"],
    [{ text: "Guardrails: AI drafts accepted unedited", options: { italic: true } }, "—", "watch > 90%"],
    [{ text: "Alerts dismissed as not useful", options: { italic: true } }, "—", "< 15%"],
  ], 5.0, 2.05, 3.85, [2.05, 0.95, 0.85], { fs: 8.5, rowH: 0.36 });

  panel(s, 9.15, 1.7, 3.78, 5.25, "C. RISKS → MITIGATIONS");
  const risks = [
    ["Wrong or stale data", "Provenance + freshness on every fact; conflicts never auto-resolved; ✗ flags route to the HiLabs data team"],
    ["Alert fatigue", "Ranking instead of alarms; max 3 reasons per row; dismiss reasons logged; target < 15% dismissals"],
    ["Trust & automation bias", "Citations per line; confirm per item; track unedited acceptance; clinician is always the author"],
    ["Privacy & consent", "Part 2 gating, HIPAA minimum-necessary scripts, TCPA suppression of reassigned numbers"],
    ["Equity", "Cost-based models under-call Medicaid needs; impactability adds access barriers; audit ranks by subgroup"],
    ["Adoption", "Overlay inside the existing CM system; learnable in 1 day; supervisors see time saved, not surveillance"],
  ];
  risks.forEach(([h, b], i) => {
    const y = 2.07 + i * 0.8;
    icCircle(s, ic.warn, 9.3, y + 0.03, COL.coral, 0.32);
    T(s, h, 9.72, y, 3.1, 0.25, { fontSize: 9.5, bold: true, color: COL.navy });
    T(s, b, 9.72, y + 0.24, 3.1, 0.55, { fontSize: 8.5 });
  });
  s.addNotes("RICE: Reach = share of the CM day touched (1–5); Impact on minutes or member risk (1–5); Confidence 0.4–0.9; Effort in relative sprints (1–5).");

  /* =============== 12. PILOT & GTM =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  tabs(s, 11);
  title(s, "Pilot with one regional plan in 90 days; price a seat at ~1/3 of the time it frees", "Brownie points: buyer, pilot scope and pricing signal. Assumptions flagged; to be validated with a design-partner plan");
  panel(s, 0.4, 1.7, 4.1, 5.25, "A. WHO BUYS, WHO USES, WHO BLOCKS");
  const buy = [[ic.users, "Economic buyer", "VP Care Management / CMO: owns Stars, HEDIS (TRC, FUH), readmissions and the CM headcount budget"], [ic.nurse, "Champion", "CM directors and supervisors: feel caseload spikes and audit stress daily"], [ic.shield, "Gatekeepers", "CIO/CISO (HITRUST, which HiLabs holds), Compliance (NCQA, Part 2, TCPA), clinical governance for AI"], [ic.rocket, "First target", "Regional plan with MA + D-SNP + Medicaid, 300k–800k members, an existing HiLabs MCheck customer, running Jiva or GuidingCare"]];
  buy.forEach(([d, h, b], i) => {
    const y = 2.1 + i * 1.2;
    icCircle(s, d, 0.55, y, COL.navy, 0.42);
    T(s, h, 1.1, y - 0.02, 3.3, 0.26, { fontSize: 10.5, bold: true, color: COL.navy });
    T(s, b, 1.1, y + 0.25, 3.3, 0.9, { fontSize: 9 });
  });

  panel(s, 4.65, 1.7, 4.6, 5.25, "B. PILOT: 90 DAYS, 20 CASE MANAGERS");
  const ph = [["Day 0–30 · Instrument", "Read-only overlay; ingest ADT, pharmacy (incl. rejects), CCD, eligibility, provider directory, CM notes. 2-week time-motion baseline. 10 CMs workbench, 10 matched controls (TOC + BH programs)."], ["Day 31–60 · Shadow AI", "Queue + 360 live. AI brief and med diff in shadow mode: clinicians rate accuracy; no drafts saved yet."], ["Day 61–90 · Assist", "Pre-fill + note drafting on, clinician signs. Measure north star, clocks met, after-hours notes, guardrails."]];
  ph.forEach(([h, b], i) => {
    const y = 2.1 + i * 1.25;
    chip(s, h, 4.8, y, 2.2, COL.teal, COL.white, { fs: 9, h: 0.3 });
    T(s, b, 4.8, y + 0.36, 4.3, 0.85, { fontSize: 9 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.8, y: 5.85, w: 4.3, h: 0.95, rectRadius: 0.05, fill: { color: COL.tealT }, line: { color: COL.tealT } });
  T(s, [{ text: "Go/no-go at day 90: ", options: { bold: true, color: COL.teal } }, { text: "≥ +1.5 conversations/CM/day vs control, ≥ 85% discharges contacted in 2 business days, AI-brief error rate < 5% (rated), CM NPS +20." }], 4.9, 5.9, 4.1, 0.85, { fontSize: 9 });

  panel(s, 9.4, 1.7, 3.53, 5.25, "C. PRICING SIGNAL");
  T(s, "$750", 9.55, 2.1, 3.2, 0.55, { fontSize: 30, bold: true, color: COL.navy });
  T(s, "per CM seat per month (~$9k / yr)", 9.55, 2.65, 3.2, 0.3, { fontSize: 10, color: COL.muted });
  table(s, [
    ["Value per CM per year", ""],
    ["Time freed (2 h/day, half the model)", "2 h"],
    ["RN loaded cost (BLS median $93.6k × 1.4)", "~$63/h"],
    ["× 230 working days", "≈ $29k"],
    [{ text: "Capacity ROI on time alone", options: { bold: true } }, { text: "~3.2×", options: { bold: true, color: COL.teal } }],
  ], 9.55, 3.1, 3.23, [2.38, 0.85], { fs: 8.5, rowH: 0.3 });
  T(s, [{ text: "Upside not priced in: ", options: { bold: true } }, { text: "each avoided readmission ≈ $15.2k; TRC/FUH feed Stars (4+ stars brings a 5% benchmark bonus). Alternative: $0.10–0.25 PMPM on CM-eligible members. Pilot fee $75–100k, credited to Year 1." }], 9.55, 4.7, 3.23, 1.4, { fontSize: 9 });
  T(s, "Expand: more programs → UM nurses → provider-delegated CM (ACOs)", 9.55, 6.2, 3.23, 0.6, { fontSize: 9, bold: true, color: COL.teal });
  s.addNotes("Seat price is a signal, not a quote. Wage: BLS OES May 2024 median RN pay; 1.4× load for benefits is an assumption.");

  /* =============== APPENDIX: REFERENCES =============== */
  s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Appendix: sources, assumptions and how to try the prototype", { x: 0.4, y: 0.3, w: W - 0.8, h: 0.5, fontSize: 22, bold: true, color: COL.navy, margin: 0, isTextBox: true });
  const refs = [
    "HiLabs Product Caselet 2026–27 (provided): workload ranges, narrative, deliverables",
    "CMS ADT CoP FAQ, 42 CFR 482.24(d): minimum notification content, diagnosis optional",
    "Kripalani et al., JAMA 2007 (via JABFM 2017): discharge summary at 12–34% of first visits",
    "Systematic review of post-discharge medication discrepancies (PMC7235049): median ~50%",
    "NBER w34191, Medicaid outreach field experiment: ≥ 24% inaccurate phone numbers",
    "CMS OMH Z-code data highlights (2017–2019): Z codes on ~1.1–1.6% of beneficiaries",
    "AHRQ HCUP Statistical Brief 248: Medicare 30-day readmission ~17%; avg readmission cost $15.2k (2018)",
    "KFF, Medicare Advantage in 2026: MA ≈ 55% of eligibles; SNPs 8.2M (78% D-SNP)",
    "KFF, Medicaid and pregnancy: Medicaid finances 41% of US births",
    "CMS-0057-F fact sheet: Provider Access, Payer-to-Payer, PA APIs by 1 Jan 2027",
    "NCQA Case Management Accreditation standards: file review of initial assessment",
    "CA DHCS D-SNP reporting specs: HRA and ICP within 90 days of enrollment",
    "HEDIS TRC plan tip sheets (e.g. MVP Health Care 2025): four TRC components",
    "CMS MA AI FAQ, Feb 2024 (Norton Rose Fulbright summary); California SB 1120 (2024)",
    "Becker's / US Surgeon General: nurses spend up to 41% of the day in the EHR",
    "AMN Healthcare 2025 RN survey (58% burnout); AMIA survey (77% after-hours admin work)",
    "Care managers & multiple HIT applications (PMC6557451); Wolters Kluwer (3–5 apps per CM)",
    "KLAS Best in KLAS 2025 payer care management; HealthEdge & Innovaccer AI announcements (vendor claims)",
    "HiLabs: Series B ($39M, 2024), MCheck suite, CAQH partnership (Fierce Healthcare, GlobeNewswire)",
    "SNOMED International & Regenstrief LOINC Ontology (2025); HL7 FHIR-to-OMOP IG code mappings",
    "van Walraven et al., CMAJ 2010: LACE index (C-statistic 0.68)",
    "NLM Clinical Tables (ICD-10-CM, LOINC) and RxNav (RxNorm/NDC) APIs: all annex codes verified 7 Nov 2026",
    "BLS Occupational Employment & Wage Statistics: registered nurse median pay",
  ];
  refs.forEach((r, i) => {
    const col = i < 12 ? 0 : 1, row = i % 12;
    T(s, `${i + 1}. ${r}`, 0.4 + col * 4.75, 1.0 + row * 0.47, 4.6, 0.45, { fontSize: 8.5 });
  });
  panel(s, 9.95, 1.0, 2.98, 5.9, "TRY THE PROTOTYPE");
  qr(s, 10.35, 1.45, 2.2);
  T(s, PROTO_URL || "URL added after deployment", 10.1, 3.75, 2.7, 0.3, { fontSize: 8.5, color: COL.indigo, align: "center" });
  T(s, [{ text: "Key assumptions", options: { bold: true, color: COL.navy, breakLine: true } }, { text: "Day model inputs (annex, blue cells) · 50% of modelled time captured in the pilot · seat price · baseline TRC 2-day contact ~50% · all members, providers, pharmacies and the plan are fictional; 555-01xx numbers are reserved fictional numbers." }], 10.1, 4.15, 2.7, 2.6, { fontSize: 8.5 });

  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
