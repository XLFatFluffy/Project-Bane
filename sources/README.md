# Project Bane Canonical Sources

GitHub is the long-term master for Project Bane source data.

Expected canonical files:

- `Project_Bane_Block1_Workout_Program_CANONICAL.xlsx`
- `Project_Bane_Meal_Log_CANONICAL.xlsx`
- `Project Bane — Workout System Handoff_CANONICAL.md`

The web app ships with normalized JSON snapshots under `data/` so the dashboard works immediately. When a canonical workbook is updated, use **Sources → Import XLSX** to validate and activate the new data locally. Commit the updated canonical source files to this directory when they are available in the repository.

The app keeps actual workout performance and bodyweight history separate from the prescribed program, so replacing a source does not erase historical performance.
