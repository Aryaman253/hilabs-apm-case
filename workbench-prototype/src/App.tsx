import { useMemo, useState } from "react";
import {
  AlertTriangle, BadgeCheck, Bell, Bot, Calendar, Check, ChevronRight, CircleDot, Clock, ClipboardList,
  FileText, Info, ListChecks, Lock, MessageSquare, Phone, PhoneOff, Pill, Shield, Sparkles, User, Users, X, Zap,
} from "lucide-react";
import { MEMBERS, OTHERS, ME, NOW, DEMO_ANSWERS, type Member, type Conf, type Fact, type Freshness, type MedRow, type Action, type AssessField } from "./data";

type View = "queue" | "member" | "outreach" | "about";

const DRIVERS: Record<string, string> = {
  P1: "Clinical: HF, LVEF 30%, ACE-inhibitor/ARNI conflict · Clock: TRC contact due tomorrow · Impact: PA + booking fixable today · Reach: landline answers mornings",
  P4: "Clinical: post-psych discharge, MAT supply ends Wed · Clock: FUH 7-day closes Thu · Impact: bridge Rx + telehealth today · Reach: phone dead, shelter desk mornings",
  P5: "Clinical: NSAID with CKD 4 + K 5.4, 2nd fall · Clock: next dose today · Impact: one prescriber call stops harm · Reach: pharmacy now, daughter after 17:00",
  P3: "Clinical: 4 ED in 77 d, no controller · Clock: none formal (AMR year-end) · Impact: $0 controller + PCP · Reach: new number 92% match, midday",
  P2: "Clinical: A1c 9.8% and rising · Clock: none this week · Impact: high (access fix, not behaviour) · Reach: evenings only, SMS consent on file",
};

const BREAKDOWN: Record<string, [number, number, number, number]> = {
  P1: [31, 28, 25, 10], P4: [33, 26, 24, 8], P5: [32, 20, 25, 9], P3: [30, 16, 24, 8], P2: [18, 8, 25, 10],
};

function cx(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }

function ConfDot({ c }: { c: Conf | "none" }) {
  const m = { high: "bg-emerald-500", medium: "bg-amber-500", low: "bg-rose-500", none: "bg-slate-300" } as const;
  const t = { high: "High confidence", medium: "Medium confidence", low: "Low confidence", none: "Do not use" } as const;
  return <span title={t[c]} className={cx("inline-block size-2 rounded-full", m[c])} />;
}

function SrcChip({ s }: { s: string }) {
  return <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{s}</span>;
}

function FreshPill({ f }: { f: Freshness }) {
  const m = {
    fresh: "bg-emerald-50 text-emerald-800 border-emerald-200",
    aging: "bg-amber-50 text-amber-800 border-amber-200",
    stale: "bg-rose-50 text-rose-800 border-rose-200",
    none: "bg-slate-100 text-slate-500 border-slate-200",
  } as const;
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]", m[f.level])}>
      <span className="font-semibold">{f.src}</span> · {f.asOf}
    </span>
  );
}

function ClockBadge({ m }: { m: Member }) {
  if (!m.clock) return <span className="text-xs text-slate-400">No clock</span>;
  const urgent = m.clock.daysLeft <= 1, soon = m.clock.daysLeft <= 3;
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
      urgent ? "bg-rose-600 text-white" : soon ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700")}>
      <Clock className="size-3" /> {m.clock.label}: {m.clock.daysLeft === 1 ? "due tomorrow" : `${m.clock.daysLeft} days`}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen 1: Today queue                                              */
/* ------------------------------------------------------------------ */
function Queue({ open }: { open: (id: string, v?: View) => void }) {
  const [explain, setExplain] = useState<string | null>(null);
  const sorted = [...MEMBERS].sort((a, b) => a.rank - b.rank);
  const plan = [
    { t: "08:30", who: "Harold Brennan", what: "Call home landline (mornings 2/2)", id: "P1" },
    { t: "09:15", who: "Tanya Brooks", what: "Shelter desk: no-PHI callback; hold telehealth slot", id: "P4" },
    { t: "09:45", who: "Thi Mai Tran", what: "NightOwl pharmacist / ED prescriber: ibuprofen + CKD 4", id: "P5" },
    { t: "12:00", who: "Tyler Kowalski", what: "SMS, then call the new mobile (not driving hours)", id: "P3" },
    { t: "17:15", who: "Thi Mai Tran", what: "Call daughter Linh: caregiver check", id: "P5" },
    { t: "18:30", who: "Denise Carter", what: "Call after work (SMS sent at 08:05)", id: "P2" },
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: "6", l: "New events since Fri", s: "4 ADT · 1 PA · 1 call-centre", icon: Bell },
            { k: "3", l: "Clocks due ≤ 72 h", s: "TRC tomorrow · FUH Thu", icon: Clock },
            { k: "4", l: "Med safety conflicts", s: "AI-detected · you resolve", icon: Pill },
            { k: `${ME.acuityPts}/${ME.capacityPts}`, l: "Acuity-weighted load", s: `${ME.cases} active cases · near capacity`, icon: Users },
          ].map((c) => (
            <div key={c.l} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between"><span className="text-2xl font-bold text-navy">{c.k}</span><c.icon className="size-4 text-slate-400" /></div>
              <div className="text-sm font-medium">{c.l}</div><div className="text-xs text-slate-500">{c.s}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="font-semibold">Who needs me today</h2>
              <p className="text-xs text-slate-500">Priority = clinical risk + clock urgency + impactability + reachability today. Each row says why.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700"><Bot className="size-3" /> Ranked by AI · you can re-order</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {sorted.map((m) => {
              const b = BREAKDOWN[m.id];
              return (
                <li key={m.id} className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex w-12 flex-col items-center">
                      <span className="text-xs text-slate-400">#{m.rank}</span>
                      <span className={cx("grid size-10 place-items-center rounded-full text-sm font-bold text-white", m.score >= 85 ? "bg-rose-600" : m.score >= 70 ? "bg-amber-500" : "bg-slate-500")}>{m.score}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => open(m.id)} className="font-semibold text-navy hover:underline">{m.name}</button>
                        <span className="text-xs text-slate-500">{m.age}{m.sex} · {m.plan} · {m.program}</span>
                        {m.newSince && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">NEW · {m.newSince}</span>}
                        {m.identity && <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-800">Identity check</span>}
                      </div>
                      <ul className="mt-1 space-y-0.5 text-sm">
                        {m.reasons.map((r) => <li key={r} className="flex gap-1.5"><ChevronRight className="mt-0.5 size-3.5 shrink-0 text-slate-400" />{r}</li>)}
                      </ul>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <ClockBadge m={m} />
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"><Phone className="size-3" /> {m.channel} · {m.window}</span>
                        <button onClick={() => setExplain(explain === m.id ? null : m.id)} className="text-xs text-indigo-700 hover:underline">{explain === m.id ? "Hide drivers" : "What drives this score?"}</button>
                      </div>
                      {explain === m.id && <p className="mt-2 max-w-2xl rounded-lg border border-indigo-100 bg-white p-2 text-[11px] text-slate-700">{DRIVERS[m.id]}</p>}
                      {(
                        <div className="mt-2 grid max-w-xl grid-cols-4 gap-2 rounded-lg bg-indigo-50/60 p-2 text-[11px]">
                          {["Clinical risk /35", "Clock urgency /30", "Impactability /25", "Reachable today /10"].map((l, i) => (
                            <div key={l}><div className="font-semibold text-indigo-900">{b[i]}</div><div className="text-indigo-800/80">{l}</div>
                              <div className="mt-1 h-1.5 rounded bg-white"><div className="h-1.5 rounded bg-indigo-500" style={{ width: `${(b[i] / [35, 30, 25, 10][i]) * 100}%` }} /></div></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => open(m.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-white">Open 360</button>
                      <button onClick={() => open(m.id, "outreach")} className="rounded-lg bg-navy px-3 py-1.5 text-sm text-white hover:bg-navy-2">Start outreach</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-slate-100 px-4 py-2 text-xs font-medium text-slate-500">Routine today ({OTHERS.length} of 43 others shown) · no action needed before Wednesday</div>
          <ul className="divide-y divide-slate-50">
            {[...OTHERS].sort((a, b) => b.score - a.score).map((o) => (
              <li key={o.name} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600">
                <span className="grid size-7 place-items-center rounded-full bg-slate-200 text-xs font-semibold">{o.score}</span>
                <span className="w-28 font-medium">{o.name}</span><span className="w-40 text-xs">{o.program}</span><span className="flex-1 text-xs">{o.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="flex items-center gap-2 font-semibold"><Calendar className="size-4" /> Today's plan (by best contact window)</h3>
          <p className="mb-2 text-xs text-slate-500">Built from learned contact windows, clocks and provider hours. Drag to change.</p>
          <ol className="space-y-2">
            {plan.map((p) => (
              <li key={p.t + p.who}><button onClick={() => open(p.id)} className="flex w-full gap-3 rounded-lg p-2 text-left hover:bg-slate-50">
                <span className="w-12 shrink-0 font-mono text-xs font-semibold text-navy">{p.t}</span>
                <span className="text-sm"><span className="font-medium">{p.who}</span><br /><span className="text-xs text-slate-500">{p.what}</span></span>
              </button></li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <h3 className="flex items-center gap-2 font-semibold text-amber-900"><Zap className="size-4" /> Caseload spike warning</h3>
          <p className="mt-1 text-amber-900/90">3 members in your programs are inpatient right now (ADT), so expect 3 discharges by Thursday. Your supervisor has been asked to pause new TOC assignments to you until Wednesday.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
          <h3 className="mb-1 font-semibold text-slate-800">Routed here because</h3>
          Licensed in OH (compact) · TOC + Complex CM · English · capacity available. BH-primary cases have a co-owner (LCSW).
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen 2: Member 360                                               */
/* ------------------------------------------------------------------ */
function BriefItem({ f }: { f: Fact }) {
  const [state, setState] = useState<"open" | "ok" | "flag">("open");
  return (
    <li className={cx("rounded-lg border p-2.5", f.conflict ? "border-amber-300 bg-amber-50/60" : "border-slate-200 bg-white", state === "flag" && "opacity-60")}>
      <div className="flex items-start gap-2">
        <ConfDot c={f.conf} />
        <div className="flex-1 text-sm">
          {f.text}
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {f.src.map((s) => <SrcChip key={s} s={s} />)}
            <span className="text-[10px] text-slate-400">as of {f.date}</span>
            {f.conflict && <span className="inline-flex items-center gap-1 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900"><AlertTriangle className="size-3" />{f.conflict}</span>}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {state === "open" ? (<>
            <button title="Confirm" onClick={() => setState("ok")} className="rounded border border-slate-200 p-1 hover:bg-emerald-50"><Check className="size-3.5 text-emerald-700" /></button>
            <button title="Flag as wrong" onClick={() => setState("flag")} className="rounded border border-slate-200 p-1 hover:bg-rose-50"><X className="size-3.5 text-rose-700" /></button>
          </>) : state === "ok" ? <BadgeCheck className="size-4 text-emerald-600" /> : <span className="text-[10px] text-rose-700">Flagged for data team</span>}
        </div>
      </div>
    </li>
  );
}

function MedTable({ meds }: { meds: MedRow[] }) {
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  const tone = { match: "bg-emerald-100 text-emerald-800", conflict: "bg-amber-100 text-amber-900", new: "bg-sky-100 text-sky-900", missing: "bg-amber-100 text-amber-900", danger: "bg-rose-600 text-white" } as const;
  const label = { match: "Match", conflict: "Conflict", new: "New", missing: "Missing", danger: "Safety" } as const;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-slate-500"><tr><th className="py-1.5 pr-2">Medication</th><th className="pr-2">Plan list</th><th className="pr-2">Hospital / Rx</th><th className="pr-2">Pharmacy (actual)</th><th className="pr-2">Status</th><th>AI proposal: you decide</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {meds.map((m) => (
            <tr key={m.med} className={cx(m.status === "danger" && !resolved[m.med] && "bg-rose-50")}>
              <td className="py-2 pr-2 font-medium text-slate-800">{m.med}</td><td className="pr-2">{m.plan}</td><td className="pr-2">{m.discharge}</td><td className="pr-2">{m.fills}</td>
              <td className="pr-2"><span className={cx("rounded px-1.5 py-0.5 text-[10px] font-semibold", tone[m.status])}>{label[m.status]}</span></td>
              <td>{m.proposal ? (resolved[m.med]
                ? <span className="inline-flex items-center gap-1 text-emerald-700"><BadgeCheck className="size-3.5" /> Reconciled by you</span>
                : <span className="flex items-start gap-2"><span className="flex-1">{m.proposal}</span><button onClick={() => setResolved({ ...resolved, [m.med]: true })} className="shrink-0 rounded border border-slate-300 px-1.5 py-0.5 text-[10px] hover:bg-white">Accept & note</button></span>) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Actions({ actions }: { actions: Action[] }) {
  const [done, setDone] = useState<Record<string, "accepted" | "dismissed">>({});
  const icon = { call: Phone, task: ListChecks, clinical: Shield, admin: ClipboardList } as const;
  return (
    <ol className="space-y-2">
      {actions.map((a, i) => {
        const I = icon[a.kind]; const st = done[a.title];
        return (
          <li key={a.title} className={cx("rounded-lg border p-2.5", st ? "border-slate-100 bg-slate-50 opacity-70" : "border-slate-200 bg-white")}>
            <div className="flex items-start gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium"><I className="size-3.5 text-slate-500" />{a.title}</div>
                <div className="text-xs text-slate-600">Why: {a.why}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-700"><Sparkles className="size-3" />{a.ai}</span>
                  <span className={cx("rounded px-1.5 py-0.5 font-semibold", a.owner === "Clinician decides" ? "bg-rose-50 text-rose-700" : a.owner === "Automated" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700")}>{a.owner}</span>
                </div>
              </div>
              {!st ? (
                <div className="flex shrink-0 flex-col gap-1">
                  <button onClick={() => setDone({ ...done, [a.title]: "accepted" })} className="rounded bg-navy px-2 py-1 text-[11px] text-white">Accept</button>
                  <button onClick={() => setDone({ ...done, [a.title]: "dismissed" })} className="rounded border border-slate-300 px-2 py-1 text-[11px]">Not now</button>
                </div>
              ) : <span className="text-[11px] text-slate-500">{st === "accepted" ? "Task created" : "Dismissed · reason logged"}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function MemberHeader({ m, go }: { m: Member; go: (v: View) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-navy">{m.name}</h2>
            <span className="text-sm text-slate-500">{m.age}{m.sex} · {m.memberId} · {m.plan}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-slate-100 px-2 py-0.5">Program: {m.program}</span>
            <span className="rounded bg-slate-100 px-2 py-0.5">Language: {m.language}</span>
            {m.authRep && <span className="rounded bg-slate-100 px-2 py-0.5">Can speak with: {m.authRep}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2"><ClockBadge m={m} /><button onClick={() => go("outreach")} className="rounded-lg bg-navy px-3 py-2 text-sm text-white">Start outreach</button></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Data freshness</span>
        {m.freshness.map((f) => <FreshPill key={f.src} f={f} />)}
      </div>
      {m.identity && <div className="mt-3 flex items-start gap-2 rounded-lg border border-violet-200 bg-violet-50 p-2 text-sm text-violet-900"><User className="mt-0.5 size-4 shrink-0" /><span className="flex-1">{m.identity}</span><button className="rounded border border-violet-300 bg-white px-2 py-0.5 text-xs">Review match</button></div>}
      {m.banner && <div className="mt-3 flex items-start gap-2 rounded-lg border border-slate-300 bg-slate-50 p-2 text-sm text-slate-700"><Lock className="mt-0.5 size-4 shrink-0" />{m.banner}</div>}
    </div>
  );
}

function Member360({ m, go }: { m: Member; go: (v: View) => void }) {
  const flagTone = { conflict: "text-amber-700", late: "text-slate-500", missing: "text-rose-700", match: "text-violet-700" } as const;
  return (
    <div className="space-y-4">
      <MemberHeader m={m} go={go} />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-indigo-600" /> What changed since your last contact</h3>
              <span className="text-[11px] text-slate-500">AI summary · every line links to its source · confirm ✓ or flag ✗</span>
            </div>
            <ul className="space-y-2">{m.brief.map((f) => <BriefItem key={f.text} f={f} />)}</ul>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold"><Pill className="size-4" /> Medication reconciliation (plan list · hospital · pharmacy)</h3>
            <MedTable meds={m.meds} />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold"><FileText className="size-4" /> Timeline (event time vs. time received)</h3>
            <ol className="space-y-1.5 text-sm">
              {m.timeline.map((t) => (
                <li key={t.when + t.text} className="grid grid-cols-[130px_72px_1fr] items-start gap-2">
                  <span className="font-mono text-[11px] text-slate-500">{t.when}{t.received && <><br /><span className="text-[10px]">rcvd {t.received}</span></>}</span>
                  <SrcChip s={t.src} />
                  <span className={cx(t.flag && flagTone[t.flag])}>{t.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold"><ListChecks className="size-4" /> Next best actions</h3>
            <Actions actions={m.actions} />
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <h3 className="mb-2 font-semibold">Care team & providers</h3>
            <div className={cx("rounded-lg p-2", m.pcp.conflict ? "bg-amber-50" : "bg-slate-50")}>{m.pcp.text}
              <div className="mt-1 flex gap-1">{m.pcp.src.map((s) => <SrcChip key={s} s={s} />)}{m.pcp.conflict && <span className="text-[10px] text-amber-800">⚠ {m.pcp.conflict}</span>}</div></div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <h3 className="mb-2 font-semibold">Social needs (with age of data)</h3>
            <ul className="space-y-1.5">{m.sdoh.map((s) => (
              <li key={s.text} className="flex items-start gap-2"><ConfDot c={s.conf} /><span className="flex-1">{s.text} <span className="text-[10px] text-slate-400">· {s.date}</span>{s.conflict && <span className="block text-[11px] text-amber-800">⚠ {s.conflict}</span>}</span></li>
            ))}</ul>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen 3: Outreach & documentation                                 */
/* ------------------------------------------------------------------ */
function Outreach({ m, go }: { m: Member; go: (v: View) => void }) {
  const [phase, setPhase] = useState<"pre" | "call" | "draft" | "saved">(() => (window.location.hash.split("/")[2] as "pre" | "call" | "draft" | "saved") || "pre");
  const [answers, setAnswers] = useState<Record<string, string>>(() => (window.location.hash.split("/")[2] ? DEMO_ANSWERS[m.id] ?? {} : {}));
  const pre = m.assessment.filter((a) => a.state !== "ask").length;
  const fieldTone = (a: AssessField) => a.state === "prefilled" ? "border-emerald-200 bg-emerald-50/50" : a.state === "conflict" ? "border-amber-300 bg-amber-50" : "border-slate-300 bg-white";
  const note = useMemo(() => {
    const top = m.brief.slice(0, 3).map((b) => "• " + b.text).join("\n");
    const said = Object.entries(answers).filter(([, v]) => v).map(([k, v]) => `• ${k}: ${v}`).join("\n") || "• (member responses captured during the call)";
    const tasks = m.actions.slice(0, 3).map((a) => "☐ " + a.title).join("\n");
    return `Telephonic contact, ${NOW.replace(" · ", " ")}. ${m.channel}.\n\nContext reviewed (auto-cited):\n${top}\n\nMember / caregiver reported:\n${said}\n\nPlan agreed:\n${tasks}`;
  }, [m, answers]);

  return (
    <div className="space-y-4">
      <MemberHeader m={m} go={go} />
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <section className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 font-semibold">Contact ladder (try in this order)</h3>
            <ol className="space-y-2">
              {m.contacts.map((c, i) => (
                <li key={c.label} className={cx("rounded-lg border p-2.5 text-sm", c.conf === "none" ? "border-slate-100 bg-slate-50 text-slate-400 line-through" : "border-slate-200")}>
                  <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-400">{i + 1}</span><ConfDot c={c.conf} /><span className="font-medium">{c.label}</span></div>
                  <div className="ml-6 text-xs text-slate-600">{c.who} · best: {c.window}</div>
                  <div className="ml-6 text-[11px] text-slate-500">{c.note} · consent: {c.consent}</div>
                  {c.conf !== "none" && phase === "pre" && i === 0 && (
                    <button onClick={() => setPhase("call")} className="ml-6 mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"><Phone className="size-3.5" /> Call now (auto-logged)</button>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
            <h3 className="mb-1 flex items-center gap-1 text-sm font-semibold text-slate-800"><MessageSquare className="size-4" /> If no answer</h3>
            The voicemail script (no PHI) and the SMS are pre-drafted. The attempt is logged automatically, and the next window is proposed from learned answer times.
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          {phase === "pre" && <div className="mb-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900"><b>Pre-call brief ready.</b> {pre} of {m.assessment.length} assessment fields are pre-filled from data you can verify. Ask only what the data can't tell you, in the order below.</div>}
          {phase === "call" && <div className="mb-3 flex items-center justify-between rounded-lg bg-emerald-600 p-3 text-sm text-white"><span className="inline-flex items-center gap-2"><CircleDot className="size-4 animate-pulse" /> On call · 00:07:42 · transcription on (member consented)</span><button onClick={() => setPhase("draft")} className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-semibold text-emerald-700"><PhoneOff className="size-3.5" /> End call</button></div>}
          <h3 className="mb-2 font-semibold">Assessment: pre-filled where the data is trustworthy</h3>
          <div className="mb-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded border border-emerald-300 bg-emerald-100" />From data: verify</span>
            <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded border border-amber-300 bg-amber-100" />Conflict: resolve on call</span>
            <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded border border-slate-300 bg-white" />Ask the member</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {m.assessment.map((a) => (
              <label key={a.field} className={cx("block rounded-lg border p-2 text-sm", fieldTone(a))}>
                <span className="flex items-center justify-between text-[11px] font-semibold text-slate-600">{a.field}<SrcChip s={a.src} /></span>
                {a.state === "ask"
                  ? <input value={answers[a.field] ?? ""} onChange={(e) => setAnswers({ ...answers, [a.field]: e.target.value })} placeholder={phase === "call" ? "Type or let transcription fill…" : "Ask on the call"} className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-indigo-400" />
                  : <span className="mt-1 block">{a.value}</span>}
              </label>
            ))}
          </div>

          {(phase === "draft" || phase === "saved") && (
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-indigo-900"><Bot className="size-4" /> Draft note (AI) · edit anything, then sign</h4>
                <span className="text-[11px] text-indigo-800">Becomes the contact note, care-plan update and audit record in one step. Nothing is re-typed.</span>
              </div>
              <textarea defaultValue={note} rows={12} className="w-full rounded-lg border border-indigo-200 bg-white p-2 font-mono text-xs" />
              {phase === "draft"
                ? <button onClick={() => setPhase("saved")} className="mt-2 inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-2 text-sm text-white"><Check className="size-4" /> Sign & save (you are the author)</button>
                : <div className="mt-2 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">Saved · contact note + {pre} assessment fields + care-plan goals updated · 3 tasks created · TRC/FUH evidence attached for audit.</div>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function About() {
  return (
    <div className="max-w-3xl space-y-4 text-sm">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-navy">About this prototype</h2>
        <p className="mt-1 text-slate-600">This is an MVP concept for the HiLabs APM case: a Case Management Workbench for a health plan. It is a snapshot of Monday 09 Nov 2026 at 08:00. <b>All people, numbers, providers and the plan are fictional.</b> Nothing is saved.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-2 font-semibold">What AI does, and what the clinician decides</h3>
        <table className="w-full text-left text-xs">
          <thead className="text-slate-500"><tr><th className="py-1">Tier</th><th>Examples</th><th>Human role</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            <tr><td className="py-2 font-semibold">Automated</td><td>De-duplication, unit normalisation, code → plain language, freshness stamps, reassigned-number suppression, call logging</td><td>Can audit; can flag errors</td></tr>
            <tr><td className="py-2 font-semibold">AI drafts, you confirm</td><td>Since-last-contact brief, queue ranking, med-list diff, assessment pre-fill, call note, tasks, PA evidence packet</td><td>One click per item; every line cites its source</td></tr>
            <tr><td className="py-2 font-semibold">Clinician only</td><td>Medication changes, clinical escalation, safety assessment, goals, case closure, identity merges below 95%</td><td>AI never acts alone</td></tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-2 font-semibold">How to read the screen</h3>
        <ul className="space-y-1 text-slate-700">
          <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" /> High confidence · <span className="size-2 rounded-full bg-amber-500" /> Medium · <span className="size-2 rounded-full bg-rose-500" /> Low</li>
          <li>Freshness pills: green = days, amber = weeks, red = stale or lagged (claims), grey = none or restricted.</li>
          <li>Amber cards = sources disagree. The workbench shows both sides and never silently picks one.</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  // Hash routing (#member/P4, #outreach/P1) so screens can be deep-linked from the deck.
  const initial = (() => {
    const [v, id] = window.location.hash.replace("#", "").split("/");
    const views: View[] = ["queue", "member", "outreach", "about"];
    return { v: (views.includes(v as View) ? v : "queue") as View, id: MEMBERS.some((x) => x.id === id) ? id : "P1" };
  })();
  const [view, setViewRaw] = useState<View>(initial.v);
  const [sel, setSelRaw] = useState(initial.id);
  const setView = (v: View) => { setViewRaw(v); window.history.replaceState(null, "", `#${v}${v === "member" || v === "outreach" ? "/" + sel : ""}`); };
  const setSel = (id: string) => { setSelRaw(id); if (view === "member" || view === "outreach") window.history.replaceState(null, "", `#${view}/${id}`); };
  const m = MEMBERS.find((x) => x.id === sel)!;
  const open = (id: string, v: View = "member") => { setSelRaw(id); setViewRaw(v); window.history.replaceState(null, "", `#${v}/${id}`); window.scrollTo(0, 0); };
  const nav: { v: View; l: string; i: typeof Users }[] = [
    { v: "queue", l: "Today", i: ListChecks }, { v: "member", l: "Member 360", i: User }, { v: "outreach", l: "Outreach & notes", i: Phone }, { v: "about", l: "About / AI rules", i: Info },
  ];
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b-4 border-brand bg-navy text-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="font-bold tracking-tight"><span className="text-brand">●</span> Case Workbench <span className="font-normal text-white/60">· prototype</span></span>
          <nav className="flex flex-wrap gap-1">
            {nav.map((n) => (
              <button key={n.v} onClick={() => setView(n.v)} className={cx("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm", view === n.v ? "bg-white text-navy" : "text-white/80 hover:bg-white/10")}><n.i className="size-4" />{n.l}</button>
            ))}
          </nav>
          {(view === "member" || view === "outreach") && (
            <select value={sel} onChange={(e) => setSel(e.target.value)} className="rounded-lg bg-white/10 px-2 py-1.5 text-sm text-white">
              {[...MEMBERS].sort((a, b) => a.rank - b.rank).map((x) => <option key={x.id} value={x.id} className="text-slate-900">#{x.rank} {x.name}</option>)}
            </select>
          )}
          <span className="ml-auto text-xs text-white/70">{ME.name} · {NOW}</span>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] p-4">
        {view === "queue" && <Queue open={open} />}
        {view === "member" && <Member360 key={m.id} m={m} go={setView} />}
        {view === "outreach" && <Outreach key={m.id} m={m} go={setView} />}
        {view === "about" && <About />}
      </main>
    </div>
  );
}
