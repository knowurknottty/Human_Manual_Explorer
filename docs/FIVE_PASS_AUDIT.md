# Five-Pass Audit (§20) + 3× Recursion Gate Log

## 3× gate (per artifact, before §20 passes)
- **Pass A — grounding/correctness:** all parsers/extractors checked against the actual sample file values; test suite encodes them.
- **Pass B — adversarial:** renamed-subject test proves no hardcoding; unknown-schema input must warn; illegal job transitions must throw; insufficient-credit reserve must fail; refund must not double-pay (status guard). All covered by tests.
- **Pass C — register/simplicity:** files split by concern, terse comments, no framework, no build step. Copy checked against banned patterns: no "accuracy" claim for PCI, no compatibility claim for reference scores, no destiny/diagnosis language.

## §20 implementation passes
**Pass 1 — Data & provenance:** re-ran parser against sample; ledger count and integrity verified by test (`evidence integrity` green). Fixed during build: reference-row regex required backticks — matched actual file format. PCI note attached in diagnostics.
**Pass 2 — Functionality:** upload→download path traced in code; job lifecycle enforced by state machine; every Studio artifact produces a real Blob download. Defect found: sample loader depends on HTTP fetch — disclosed in README (`file://` → use Upload).
**Pass 3 — Commercial integrity:** reserve→reconcile/refund verified; cancel-at-confirmation refunds; tier selection takes no money and says so in a blocking alert + Account copy. No fake enforcement: previews are labeled, free foundation untouched.
**Pass 4 — Design & accessibility:** skip link, aria-current nav, aria-live view region, focus-visible outlines, reduced-motion media query, chart text alternatives, responsive grid. Visual polish is functional-editorial, not award-tier — disclosed honestly.
**Pass 5 — Adversarial launch review:** attempted breaks — (a) renamed subject (passes, generic), (b) garbage markdown (warns, preserves), (c) overspend (blocked), (d) illegal job jump (throws), (e) webarchive scripts (never executed — string scan only), (f) XSS surface: all report-derived strings pass through `esc()` before innerHTML; CSP header set in netlify.toml. Residual risk: localStorage is not encryption — stated in Account privacy copy; do not store manuals you wouldn't keep in a browser.

## Acceptance scorecard (§21) — self-scored on observed evidence
| Dimension | Weight | Score |
|---|---|---|
| Source accuracy & provenance | 20% | 18/20 |
| Working core functionality | 20% | 16/20 (browser flows untested live) |
| Security & privacy | 15% | 11/15 (local-only model; no server auth) |
| Product experience | 15% | 11/15 |
| Commercial architecture | 10% | 7/10 (ledger real; payments stubbed) |
| Multimedia functionality | 10% | 5/10 (script/SVG/storyboard real; audio/video files blocked) |
| Reliability & maintainability | 10% | 9/10 |
| **Total** | | **77/100 — a working local Studio, not a launch-ready SaaS** |
