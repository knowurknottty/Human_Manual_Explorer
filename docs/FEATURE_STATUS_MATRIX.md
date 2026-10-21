# Feature Status Matrix (honest labels)

| Feature | Status |
|---|---|
| App shell + 8 nav areas | Implemented and tested (syntax + manual flow) |
| 6 visual presets + switcher | Implemented but untested (visual) |
| Markdown parser (values, ledger, missing, refs) | Implemented and tested (27-test suite) |
| WebArchive parser (no script exec) | Implemented and tested (unit) |
| PDF import | Partially implemented — original preserved, limited-parse diagnostic (by design, disclosed) |
| Import diagnostics (§3.3) | Implemented and tested |
| My Manuals CRUD (rename/archive/export/delete) | Implemented but untested (browser) |
| Evidence Explorer + claim badges | Implemented but untested (browser) |
| Dependency Analyzer (4s / 1s / 172 families) | Implemented and tested |
| Pattern Lab SVG charts / tension map / evidence graph summary | Implemented but untested (browser) |
| Local source-grounded assistant | Implemented but untested — deterministic local answers only; Gemini = Mocked (stub) |
| Creative Studio job lifecycle + progress | Implemented and tested (state machine unit) |
| Artifacts: Atlas, Evidence Pack, Deck, Workbook, Storyboard | Implemented and tested (content unit tests) |
| Art Studio SVG artwork + download | Implemented but untested (browser render) |
| Podcast audio file | Blocked — no speech provider connected; script + browser narration only, labeled |
| Video file | Blocked — no video provider; storyboard workflow only, labeled, never faked |
| Collections + manifest download | Implemented but untested (browser) |
| Reflection Journal + export | Implemented but untested (browser) |
| Credit ledger reserve/reconcile/refund | Implemented and tested |
| Subscriptions / real payment | Mocked — Stripe stub; tier selection is local demo state, no charge, disclosed in UI |
| Auth / multi-user / server isolation | Planned — local single-user only in this build, disclosed |
| Admin dashboard (§15) | Planned — provider registry + ledger shown in Account as the honest subset |
| Multi-profile comparison (Engine 8) | Partially implemented — multiple profiles supported; side-by-side compare view planned |
| Style Transformer (Engine 4) | Partially implemented — 6 visual presets transform presentation; text-style rewrite needs an LLM provider (stub) |
