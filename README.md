# The Fiven Or Community — website

This is a lightweight, bilingual (English/Spanish) official landing page for an independent game-development initiative.

## Publish on GitHub Pages

1. Create a **public** repository named `agenialwerben.github.io` under `AgenialWerben`.
2. Upload `index.html`, `CNAME`, and `robots.txt` to the **main** branch root.
3. Go to **Settings → Pages → Build and deployment**; set **Deploy from a branch**, branch **main**, folder **/(root)**.
4. Set **Custom domain** to `thefivenorcommunity.tech` and save.
5. In your current DNS provider, add these *website* records for root (`@`):
   - A → 185.199.108.153
   - A → 185.199.109.153
   - A → 185.199.110.153
   - A → 185.199.111.153
6. Optionally configure www CNAME → `agenialwerben.github.io` and enable HTTPS once available.

**Important**: Preserve the existing ImprovMX MX and SPF TXT records. Web DNS A/CNAME records are separate from incoming mail configuration.

Do not claim the site is online until DNS and Pages publication have both been verified.