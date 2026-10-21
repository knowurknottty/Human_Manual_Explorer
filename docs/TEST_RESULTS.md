# Test Results

Command: `node tests/run.js` (zero dependencies, Node 24).

**27 passed, 0 failed.**

Coverage: parser values vs known sample values (identity, schema, 34/216/26, PCI 64.3, Pythagorean 1/1/9, Chaldean 4/76, Ordinal 172→1, linguistic 21/0.643, Sun Leo, reference Murasaki Shikibu 0.6262); missing-data preservation (birth time stays `unknown`, withheld flags set, no invented placements); evidence integrity (every referenced `ev_v2_*` ID resolves to the ledger); no-fabrication (all ledger IDs well-formed; no claim COMPUTED without an ev path); dependency groups (Chaldean/Gematria/Isopsephy family detected); unknown-schema warning; WebArchive no-execution policy; job lifecycle legal/illegal transitions; commerce reserve/reconcile/refund + insufficient-funds; artifact content (Atlas contains source values + evidence IDs; Evidence Pack is valid JSON; podcast script and storyboard carry honest labels); generic-parser check (renamed subject parses — nothing hardcoded).

Browser-only interactions (upload UI, downloads, preset rendering) are syntax-checked (`node --check` on all JS) and labeled "Implemented but untested" in the feature matrix — they were not click-tested in a live browser in this environment.
