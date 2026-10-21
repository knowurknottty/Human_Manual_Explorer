# Remaining Blockers

1. **Payments** — Stripe (or alternative) needs a merchant account + server-side checkout/webhooks. Until then: labeled stub, preview watermark, zero charges.
2. **LLM** — Gemini key + server proxy needed for free-form Style Transformer / conversational exploration. Local deterministic assistant covers source Q&A meanwhile.
3. **Audio/video files** — speech/video providers unconnected. Podcast = script (+ browser narration); video = storyboard. Never faked.
4. **Auth & multi-user** — needs a backend; current build is single-user, device-local, disclosed everywhere relevant.
5. **PDF structured extraction** — client-side text-layer parsing is limited; Markdown remains the full-fidelity import path.
6. **Admin dashboard (§15)** — only the honest subset exists (provider registry + ledger in Account). Full admin needs the backend in (4).
7. **License** — Kirk's call; see `LICENSE-NOTE.md` (CSL v1.0 software adaptation is the house candidate).
8. **Live browser QA** — browser click-through was not performed in this environment; UI flows are syntax-checked + unit-covered at the logic layer and labeled accordingly.
