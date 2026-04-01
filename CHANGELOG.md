# Changelog

## v25.13 - Release Hardening (2026-03-31)

### Fixes
- **FraccionadoMode**: Guard against division-by-zero when `words` array is empty (totalSteps now clamped to min 1)
- **Profile switch**: Clean up active session (stop voice, clear timers, reset random mode) when switching profiles mid-session

### Edge Case Audit (no issues found)
- SpeakPanel: empty text, burstReps 0/negative, fraccionado single-word all handled safely
- VoiceRec: empty items array, mr.stop() errors, stale riAtStart all guarded
- App.jsx cloud sync: undefined lastSaved falls back to 0; goalReachedRef properly reset between sessions
- localStorage: saveData catches quota errors; loadData catches corrupted JSON and returns default
