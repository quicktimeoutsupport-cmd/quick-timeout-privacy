# Download page review — 2026-10-08 KST

Prepared locally; not published. Branch: `web/link-page-20261008`.

- Light single-column page with a centred Bonney Apps mark, real app icons, rounded cards and concise download buttons.
- Quick Timeout now has the publicly available Android package `com.developerbonney.quicktimeout` beside its existing iOS download.
- App Break and Link Now retain their original Android package URLs. EAT.RUN. retains its iOS URL; Android is explicitly labelled closed testing with no public-install button.
- Existing canonical URL, four app anchors, campaign script, campaign names, guide URLs and privacy links are preserved. No tracking service, cookies or registration added.
- Korean and English copy and EAT.RUN. icons switch together. Store link accessible names include the app name.
- Chrome visual checks: 390×844 Korean and English both fit the four cards, help links and collapsed privacy section in one viewport. At 320×720, content scrolls vertically without horizontal overflow. All five download buttons are at least 44px high. All icons loaded.
- Instagram campaign parameters and Apple campaign token remain intact after language switching. Every destination uses the verified public package or App Store ID.
- Desktop Chrome (1920×829): centred 520px column, loaded icons and normal vertical scrolling. Direct, Instagram and YouTube campaign checks passed; language switching preserves campaign destinations and app anchors. Four privacy links verified; browser console has no warnings or errors.
- Mobile binaries, signing keys, consent settings, privacy-policy pages and app-ads.txt are outside this change. Physical-device app QA is N/A: this is a static download-page layout change.
- Publication requires immediate owner approval under `/Users/shlee/Projects/AGENTS.md`.
