# Architecture Summary

**Decision (locked):** local-first zero-build SPA. Vanilla HTML/CSS/JS, no build step, Netlify static deploy, `file://`-capable, localStorage persistence.

| Layer | File | Contents |
|---|---|---|
| Shell | `index.html` | 8 nav areas, preset switcher, credit badge, CSP via netlify.toml |
| Design | `css/tokens.css`, `css/app.css` | 6 presets (Archive, Observatory, Atelier, Codex, Future Atlas, Minimalist) as token sets; responsive, reduced-motion, focus-visible, screen-reader skip link |
| Providers | `js/providers.js` | Interfaces: LanguageModel, ImageGeneration, SpeechGeneration, VideoGeneration, Payment, Storage, Auth. Local impls do real client-side work; external impls are honest stubs reporting `not-connected` |
| Model | `js/model.js` | Versioned canonical entities (all 21 spec §5.1 types), immutable source records, job state machine with enforced transitions |
| Parsers | `js/parsers.js` | Generic Markdown report-v1 parser, WebArchive string-scan parser (no script execution), honest PDF placeholder. Per-import §3.3 diagnostics. Unknown schemas warn, never drop |
| Epistemics | `js/evidence.js` | 7-class claim classifier, evidence graph (SOURCE→VALUE→EVIDENCE→INTERPRETATION→THEME→ARTIFACT), dependency analyzer, integrity verifier, missing-data honesty |
| Artifacts | `js/artifacts.js` | Real generators: Atlas HTML, Evidence Pack JSON, podcast script MD, deck HTML, artwork SVG, storyboard MD, workbook MD |
| Commerce | `js/commerce.js` | Credit ledger (reserve/reconcile/refund, insufficient-funds guard), 5 configurable tiers, honest entitlement (preview label, no fake enforcement/charges) |
| App | `js/app.js` | 8 views, import (click + drag-drop), jobs lifecycle UI, collections, journal, account, provider registry display |

**Why no backend:** this environment has no payment processor, API keys, or server. The directive (§23) forbids fake completion — so every unconnected service is a visibly labeled stub behind its provider interface, swappable without redesign.
