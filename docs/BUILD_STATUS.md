# Project Bane Build Status

Project Bane is a desktop-first web app. The canonical source documents remain the source of truth; user-entered workout history is kept separate from prescriptions.

## Current architecture

- Static browser application
- Local persistence via browser storage
- Printable daily workout sheet
- Workout actuals and notes
- Weight history
- Nutrition history with calories, protein, and net carbs
- Canonical source import/preview foundation
- Backup and restore
- Block/week/day program structure

## Design constraints

- Desktop only. No mobile/responsive optimization is required.
- The app is not intended to be used during the workout.
- The primary workout workflow is print -> train -> optionally record actuals later.
- Program updates must not overwrite historical performance.

## Deployment

GitHub Pages is configured through `.github/workflows/pages.yml`. If Pages reports a configuration error, set the repository Pages source to GitHub Actions in Settings > Pages.
