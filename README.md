# TFOC — The Fiven Or Community

Official site for the independent game studio. The unreleased game title is intentionally not public on this website.

## Front-end technology

- Astro static site generation: fast, accessible semantic HTML and search-engine metadata.
- TypeScript for language selection, mobile navigation, gallery lightbox and reading progress.
- Reusable Astro components for Brand, Header, Footer, Lightbox and BaseLayout.
- Responsive CSS; reduced-motion media query; no external runtime UI dependencies.
- Spanish and English interface, with preserved language preference.
- Original development screenshots under `assets/`, copied into `dist/assets/` during build.

## Brand preservation

The full brand **The Fiven Or Community** must always be displayed unchanged. Use `src/components/Brand.astro` for new Astro content.
Brand text is marked `translate="no"`, `class="notranslate"`, and `lang="en"`; the current root `index.html` has the same attributes.
This is best-effort support for standard translation tools, not a guarantee against arbitrary browser extensions and not legal trademark protection.
Never add a global 'notranslate' meta tag, as site visitors should be able to translate other content.

## Local development

Use Node.js 22 or newer.

    npm install
    npm run dev
    npm run check
    npm run build
    npm run preview

## Publishing Astro on GitHub Pages

The pre-existing branch-deployed `index.html` remains in the root as a safe fallback while migrating.
Github Actions builds and packages Astro on pushes to main.
To enable the modern site in production after successful build validation:

1. Go to repository **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
2. In **Actions**, choose **TFOC Astro build & deploy**, then **Run workflow**.
3. Wait for the deployment and verify `https://thefivenorcommunity.tech/` on mobile and desktop.

The `public/CNAME` file preserves the custom domain. Do not change email MX/SPF DNS records. The root fallback can be removed only after the new deployment is confirmed.

## Content integrity

Development claims derive from the game's documents and test reports in Drive. Planned features must not be advertised as complete, and no release date has been announced.

© The Fiven Or Community.

## Project explanation

The homepage includes a complete, bilingual explanation sourced from the internal design master, dungeon/sky-world documents and QA status:

- `ProjectExperience.astro`: accessible introduction, five-stage intended gameplay loop, three clearly hypothetical player paths and one-world sky/surface/underground structure.
- `ProjectFAQ.astro`: native HTML `details` answers about 2D visuals, sandbox versus campaign, role freedom, creature/faction completeness, multiplayer, platforms and release status.
- `project-explainer.css`: responsive editorial layout; no runtime dependency.
- The legacy root `index.html` mirrors the content so either Pages publication source presents the same information.

Do not confuse future design goals with features fully playable today. Do not publish the game's unannounced name.
