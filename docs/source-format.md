# Project Bane source format

Project Bane is intentionally source-driven. The application should not need code changes when a new block or meal-log workbook is produced.

## Workout workbook

A supported workout workbook contains a summary sheet with these columns:

- DAY
- FOCUS
- PRIMARY
- SUPERSET 1
- SUPERSET 2
- SUPERSET 3
- FINISHERS

and a CONDITIONING sheet containing:

- DAY
- CARDIO / CONDITIONING
- CORE EMPHASIS
- CORE WORKOUT
- INTENT
- NOTES / TRACKING

Exercise cells use a human-readable prescription such as `4 — 8–12`. The importer preserves values it cannot parse and reports them as source issues rather than silently inventing a prescription.

## Meal workbook

The meal workbook uses a `Daily Log` sheet with at least:

- Date
- Meal
- Food / Drink
- Quantity / Serving
- Calories
- Protein (g)
- Total Carbs (g)
- Fiber (g)
- Net Carbs (g)
- Notes

When Net Carbs is missing, the app may calculate it as Total Carbs minus Fiber. It never assumes ketosis.

## Update workflow

1. Produce the new canonical document.
2. Open **Sources** in Bane.
3. Import the workbook.
4. Review the preview.
5. Apply the import only after the structure and source warnings look correct.
6. Export a backup when moving devices.

Historical workout sessions and weigh-ins are separate from active program data, so replacing a program cannot erase previous performance.
