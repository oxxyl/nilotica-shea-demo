# Nilotica Shea — Traceability Command Center (Demo)

A single-page traceability dashboard for **Nilotica Shea Company Limited**, a producer company sourcing wild-harvested *Vitellaria nilotica* across Northern Uganda for the European cosmetics market.

Built as a prototype demo: static HTML + CSS + vanilla JS, hosted free on GitHub Pages. No backend, no database, no build step.

> ⚠️ **All data in this demo is synthetic.** Farmer names are common Acholi/Luo first names paired with fictional surnames. GPS coordinates are realistic for Northern Uganda but do not correspond to any real farm, person, or facility.

## What this shows

A board or prospective EU buyer walking into a meeting with this URL sees:

- **Live KPI strip** — batches, volume, farmers, EUDR readiness, dispatch readiness
- **Pipeline flow** — harvest → collection → processing → QC → storage → dispatch, with live counts
- **Sourcing map** — dark satellite basemap, 10 collection-group pins, collection-zone polygons, processing-facility marker
- **Batch register** — 5 batches at different pipeline stages, each clickable for a full dossier
- **Batch dossier** (`batch.html?id=...`) — harvest date, contributing groups, volume-by-group chart, QC laboratory results vs thresholds, EUDR geolocation package, deforestation risk score, certification status, and a scannable QR code
- **Cooperative-level certifications** — USDA Organic, EU Organic, Fairtrade (all in-progress / planned)
- **Quality pass-rate radar** — moisture, FFA, peroxide, impurities, aflatoxin across tested batches

## File structure

```
nilotica-demo/
├── index.html                    Main dashboard
├── batch.html                    Single-batch dossier (QR target)
├── assets/
│   ├── css/styles.css            All styling
│   ├── js/
│   │   ├── data.js               Synthetic cooperative / groups / farmers / batches
│   │   ├── dashboard.js          Main dashboard logic
│   │   └── batch.js              Batch detail page logic
│   ├── img/
│   │   ├── favicon.svg
│   │   └── logo.svg
│   └── vendor/                   Bundled libraries (offline-resilient)
│       ├── chart.umd.js          Chart.js 4.4.1
│       ├── leaflet.js            Leaflet 1.9.4
│       ├── leaflet.css
│       ├── qrcode.js             qrcode-generator 1.4.4
│       └── images/               Leaflet marker sprites
├── .github/workflows/deploy.yml  Auto-deploy to GitHub Pages on push
├── .nojekyll                     Disables Jekyll processing
├── .gitignore
└── README.md
```

> **Why bundle libraries locally?** The cooperative operates in Northern Uganda where internet reliability varies. Shipping libraries with the site means the dashboard still loads for a buyer or auditor on a weak connection. Total vendor payload is ~425 KB uncompressed, loaded once and cached by the browser. The trade-off is small, the resilience is significant.

## Deploy to GitHub Pages

**One-time setup (5 minutes):**

1. Create a new GitHub repo (e.g. `nilotica-shea-demo`). You can make it public — the repo itself being visible signals transparency.
2. Upload these files to the repo (drag-and-drop on the GitHub web UI works fine), or use git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nilotica-shea-demo.git
   git push -u origin main
   ```
3. Go to repo **Settings → Pages**.
4. Under **Source**, choose **GitHub Actions**.
5. The included workflow (`.github/workflows/deploy.yml`) will run automatically and deploy to `https://<your-username>.github.io/nilotica-shea-demo/`.

Every push to `main` thereafter re-deploys automatically. First deploy usually takes 1–2 minutes.

## Run locally

No build step. Just open `index.html` in a browser — or serve the folder with any static server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`.

## Technology

- **Chart.js 4.4.1** — KPI charts (bar, radar), bundled in `assets/vendor/`
- **Leaflet 1.9.4** — map rendering, bundled in `assets/vendor/`
- **qrcode-generator 1.4.4** — client-side QR generation, bundled in `assets/vendor/`
- **Google Fonts** — Fraunces (display), Space Grotesk (UI), JetBrains Mono (data), loaded from fonts.googleapis.com with system-font fallbacks
- **Map tiles** — CARTO Dark Matter, loaded from carto CDN (requires internet)

No build tooling. No package.json. No npm install. Drop it on GitHub Pages and it runs.

## Customizing for a real pilot

To swap synthetic data for real data when the pilot begins, edit `assets/js/data.js`. Four objects drive the whole dashboard:

| Object | What it holds |
|---|---|
| `COOP` | Cooperative profile, HQ GPS, certifications list |
| `GROUPS` | Collection groups with village/district/GPS/member count |
| `FARMERS` | Individual farmers (optional — currently used for namesake reference only) |
| `BATCHES` | Batches with stage, QC results, EUDR data, coordinates |

Stages (`STAGES`) and QC thresholds (`QC_THRESHOLDS`) are defined in the same file.

For a production system, this `data.js` file would be replaced by a call to a real backend (Supabase, Firebase, or a KoboToolbox/ODK sync layer). The rendering code in `dashboard.js` and `batch.js` needs no changes.

## Design notes

Aesthetic direction: **black command-center with neon green and gold accents**. The goal is to read as "serious analytical platform" to a board or EU buyer, not "generic startup dashboard."

- Typography: Fraunces for display (distinctive editorial serif), Space Grotesk for UI, JetBrains Mono for numerical/data.
- Colors: near-black panels (`#11151a`), neon green (`#00ff88`) for live/active, gold (`#d4a84a`) for classification/prestige markers.
- Motion: CSS-only staggered rise-in on load, animated number counters, subtle pulsing status dot.
- Map styling: CARTO Dark Matter tiles with desaturated filter, gold diamond marker for HQ, neon pins for collection groups, gold dashed polygons for harvest zones.

## Scope exclusions (deferred to Phase 2)

This is a prototype demo for stakeholder conversations. It does not include:

- Real user authentication or role-based access
- Live data capture forms (use KoboToolbox for this)
- Mobile money integration
- SMS / USSD notifications
- Backend database, history, or audit logs
- Multi-language UI (English only for now)
- Real consent management or PII protection beyond synthetic-data substitution

Design the Phase 2 architecture once the prototype has secured buyer / funder interest.

## Acknowledgements

Prototype design and synthetic data curation by Ogonya Emmanuel, M&E Specialist.
Scoping input from Anena Sharon, Founder, Nilotica Shea Company Ltd.

## License

Demo code released under MIT.
Synthetic data (`data.js`) is for demonstration purposes only.
