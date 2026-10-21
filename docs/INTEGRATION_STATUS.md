# Integration Status

| Service | Status | Notes |
|---|---|---|
| Storage | **Configured — local** | Browser localStorage via `LocalStorageProvider`. Data never leaves the device in this build. |
| Speech (narration) | **Configured — local** | Browser SpeechSynthesis where available; produces no audio file. |
| Image generation | **Local only** | Generative SVG/canvas rendered in-browser. No external image model connected. |
| Gemini / LLM | **Not configured — stub** | `StubGeminiProvider` reports `not-connected`. Assistant answers are deterministic + source-grounded locally. |
| Stripe / payments | **Not configured — stub** | No charges possible or claimed. Premium exports carry a preview label until a real provider is connected server-side. |
| Video generation | **Not configured — stub** | Storyboard workflow is the honest fallback (§9.5). |
| Auth | **Local stub** | Single device-local user; no passwords, no server accounts. |
| Netlify deploy | **Ready** | Static publish, no build command; CSP + hardening headers in `netlify.toml`. |
