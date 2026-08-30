# Project Bane

Project Bane is a web-based daily training, nutrition, and progress command center built for a year-long cut and strength/conditioning program.

## Daily workflow

1. Open Bane and see today's plan.
2. Print today's workout before leaving for training.
3. Record weights, reps, and notes on paper during the session.
4. Enter actual performance later only if desired.
5. Record bodyweight when needed.
6. Keep the canonical program and meal workbook as the source material.

## Foundation

- Modernized dark Bane dashboard
- Today view automatically follows the calendar
- Canonical Block 1 workout + conditioning data bundled into `data/program.json`
- Canonical meal history bundled into `data/nutrition.json`
- Printable workout sheets with set, weight, reps, notes, conditioning, and workout-notes areas
- Actual workout performance stored separately from prescriptions
- Local browser persistence for workout history and weigh-ins
- Calories, protein, and net carbohydrates shown from the meal source
- XLSX importer for the canonical workout program and meal log
- Markdown importer for the canonical Workout System Handoff
- Source status tracking
- Regression tests for the source parser

## Source workflow

GitHub is the long-term master. Canonical documents should live under `sources/` when committed to the repository. The normalized JSON snapshots under `data/` are what the static web app consumes directly. Manual import is available when a newly updated workbook is created before it is committed.

The app intentionally does not overwrite historical actual-performance records when a new program source is imported.

## Development

This foundation is intentionally a lightweight web app with no build system requirement. It can be served from any static web host. SheetJS is loaded for browser-side XLSX parsing.

Parser tests:

```bash
node tests/source-parser.test.mjs
```

## Repository name

The connected GitHub tooling does not expose repository rename operations. The repository can be renamed from GitHub's repository Settings page without changing the application architecture; relative app paths do not depend on the repository name.
