# The Human Manual Studio — SynMuse rendition

**YOUR HUMAN MANUAL, REIMAGINED.** Explore your patterns. Create your story. Collect the experience.
*The knowledge is free. The experience is extraordinary.*
*Dozens of maps of you. None of them gets the last word.*

Local-first, zero-build SPA (vanilla HTML/CSS/JS). No build step, no backend, no API keys. Deploys to Netlify as static files; also works from `file://` (except the sample loader, which needs HTTP — use Upload instead).

## Run
```bash
# any static server, e.g.
python3 -m http.server 8080   # then open http://localhost:8080
# or deploy this folder to Netlify (see netlify.toml)
node tests/run.js             # 27 tests, zero dependencies
```

## Workflow (spec §18)
UPLOAD → EXTRACT → VALIDATE → EXPLORE → CREATE → SAVE → DOWNLOAD — all steps work with the supplied Nicole sample (preloaded via *Explore a Sample*).

## Honest limits
- Payment (Stripe), Gemini, and external image/speech/video providers are **labeled stubs** — never presented as live. Podcast = real script + optional browser SpeechSynthesis narration (no audio file). Video = real storyboard workflow, never a fake video file.
- PDF import preserves the original with a limited-parse diagnostic. WebArchive import scans the plist without executing any script.
- Interpretations remain interpretations. PCI = configured output agreement, not accuracy. Reference scores = feature proximity only. Missing birth-time data stays withheld — never invented.

## Layout
`index.html` · `css/` (tokens = 6 presets, app) · `js/` (model, providers, parsers, evidence, commerce, artifacts, app) · `data/sample-manual.md` · `tests/` · `docs/`

License: pending Kirk's call — see `LICENSE-NOTE.md`.
