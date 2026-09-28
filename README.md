# Daily Fuel

A small, responsive calorie calculator that runs entirely in the browser — no backend, no dependencies. Deployed on GitHub Pages.

> Live demo: `https://<your-github-username>.github.io/daily-fuel-calculator/` *(update this link after the first deploy)*

## What it does

Enter your age, biological sex, height, weight, and typical activity level to get:

- Estimated **BMR** (resting energy) via the Mifflin–St Jeor equation
- Estimated **daily maintenance** calories with an activity multiplier
- Gentle reference targets for gradual loss / maintain / gradual gain

## Run it locally

Any static file server works — or just double-click `index.html`.

```sh
npx serve .
# or
python -m http.server 8000
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repo.
2. Repo → **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → Save.
4. First deploy takes ~1–2 minutes.

## Notes

- The estimate uses the Mifflin–St Jeor equation and a standard activity multiplier. It is general information, not personalized medical advice.
- Nothing is stored, uploaded, or tracked — the math happens in your browser.
