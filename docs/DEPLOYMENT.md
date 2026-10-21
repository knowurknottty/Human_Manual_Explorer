# Deployment

## Local
```bash
python3 -m http.server 8080   # open http://localhost:8080
node tests/run.js
```

## Netlify
1. Connect the repo / drag the folder into Netlify, or `netlify deploy --dir=.`
2. `netlify.toml` already sets: publish `.`, no build command, CSP + `nosniff` + referrer headers.
3. No environment variables, secrets, or server functions are required for this build.

## Going real (when providers are approved)
- Add a serverless backend for: Stripe checkout + webhook-verified entitlements, Gemini via server-side key (never in frontend), object storage for artifacts, real auth. Each slots behind the existing provider interfaces in `js/providers.js` — no architecture change needed.
