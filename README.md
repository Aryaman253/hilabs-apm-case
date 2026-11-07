# HiLabs APM Case 2026–27: Case Management Workbench

A Case Management Workbench MVP for a US health plan. It gives case managers one trusted, ranked morning instead of seven screens. **All patient data in this repository is synthetic**: no real PHI, and phone numbers use the reserved fictional 555-01xx range.

## What's here

| Path | What it is |
|---|---|
| `workbench-prototype/` | Clickable prototype (React + Vite + Tailwind) with three screens: Today queue, Member 360, and Outreach & notes. It uses 5 synthetic members on a Monday 09 Nov 2026, 08:00 snapshot. |
| `HiLabs_Synthetic_Patient_Annex.xlsx` | Synthetic-data annex: 5 patients, 16 datasets, 143 records with planted imperfections. Includes the day-lost model, metrics and sources. Every ICD-10-CM, LOINC and RxNorm/NDC code was verified against the NLM APIs. |
| `01_Research_Dossier.md` | Research notes: domain primer, data inventory, code systems, the SNOMED CT analysis and sources. |
| `HiLabs_CM_Workbench_Deck.pptx` / `.pdf` | First version of the deck. The current deck is the Claude Design canvas. |
| `_build_scripts/` | Scripts that generate the annex (`build_annex.py`, `patients.py`) and the v1 deck (`build_deck.js`). |

## Run the prototype locally

```bash
cd workbench-prototype
npm install
npm run dev
```

Deep links: `#queue`, `#member/P1`, `#member/P4`, `#outreach/P1/draft`, `#about`.

## Deploy on Vercel

Import this repository in Vercel and set **Root Directory** to `workbench-prototype`. Vercel then detects Vite on its own: it runs `npm install`, then `npm run build`, and serves the `dist` folder.
