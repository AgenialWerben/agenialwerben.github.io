# TFOC security audit — 2026-10-13

## Verified scope

Reviewed current HEAD of `AgenialWerben/agenialwerben.github.io`, Astro/TypeScript application files, static HTML and GitHub Actions workflow. Inspected available workflow logs and public repository tree. This is a **code/configuration security review**, not a penetration test and not a security guarantee.

## Initial findings

| Priority | Finding | Mitigation |
| --- | --- | --- |
| High | No committed npm lockfile; semver ranges can resolve different transitive dependencies at each build | Commit npm-generated lockfile, change installs to `npm ci`, include vulnerability audit |
| Medium | CI actions referenced mutable major tags | Pin validated upstream commits; keep Dependabot GitHub Actions updates enabled |
| Medium | No browser CSP; legacy HTML included inline JS and CSS | Adopt restrictive CSP in HTML, externalize scripts and CSS, verify compiled output |
| Medium | No automated static/content security gate | Add Node security regression tests, dependency audit and CodeQL scan |
| Medium | No visible repository ruleset, while branch protection read returned 403 | Manually verify branch protection, code owners, mandatory reviews |
| Medium | No visible security reporting policy | Publish SECURITY.md and /.well-known/security.txt |
| Informational | GitHub Pages cannot set arbitrary response headers from repository source | Use edge/CDN/alternate hosting for additional response-header protections |
| Informational | Live-domain headers, HTTPS settings and registrar controls not verifiable with present access | Manually validate HTTPS-only, DNS, actual response headers and registrar settings |

## Scanning methods and limitations

Manual regex pattern checks covered 17 repository text files for private key headers, common GitHub/Google/AWS/Slack token formats, credential-bearing URLs, external scripts, inline HTML handlers, direct HTML sinks, `eval` and `document.write`. No matches in those current files. This **does not** audit the entire Git history, all possible credential formats, npm package code, DNS registrar, uploaded images' metadata, or third-party systems.

The site has no documented public custom authentication/backend/database; risks prioritize malicious code injection into deployments, CI dependencies, account compromise and domain configuration.

## CSP caveats

The project's CSP is implemented via HTML `<meta http-equiv="Content-Security-Policy">`. It restricts external code loading but **cannot enforce frame-ancestors, CSP reporting, or HTTP-only header policies such as HSTS and X-Content-Type-Options**. Real HTTP response headers require a compatible proxy/hosting platform.

## Verification

Follow `.github/workflows/astro.yml` and `.github/workflows/security.yml` after changes. GitHub checks verify compilation and policy structure but do not establish formal security compliance.

## Manual follow-up

- Inspect GitHub Settings → Branches/Rulesets for `main`.
- Require CodeQL and build status checks before merge.
- Set deploy environment production permissions and review GitHub Actions token settings.
- Enable secret scanning and push protection if available.
- Review all collaborator/admin permissions, 2FA/passkeys and recovery options.
- Verify custom-domain ownership, **Enforce HTTPS**, registrar 2FA and DNSSEC/CAA if supported.
- Verify externally exposed files and CSP/HSTS/X-Frame-Options/etc. using an authorized browser/network.


## Verified remediation and evidence — final recheck (2026-10-13, Honduras / 2026-10-14 UTC)

**Fixed and deployed:**

- Framework upgraded from Astro 5.18.2 to **Astro 7.3.8** after `npm audit` identified 1 critical, 1 high and 1 low advisory in the original dependency graph. Latest secure build's `npm audit --audit-level=high` reported **0 vulnerabilities**. This is a point-in-time result.
- Deterministic `package-lock.json` (lockfile v3), 261 entries in patched tree; all remote registry dependencies inspected in the manifest had `integrity` values.
- Build changed to `npm ci --ignore-scripts` for reproducible installation without dependency lifecycle scripts.
- Restrictive HTML-meta CSP prevents arbitrary inline scripts, and `finalize-csp.mjs` allows Astro's necessary inline compiled module **only by its exact SHA-256 hash**. No `unsafe-inline` keyword is used.
- Legacy HTML now loads local JS and CSS rather than inline source. Both legacy and Astro output pass `npm run audit:site`.
- Browser referrer policy is `no-referrer`; public disclosure contact files are available.
- Build/deploy GitHub Actions are commit-SHA pinned, use least-privilege token scopes and disable checkout credential persistence; CodeQL analysis and Dependabot updates are configured.
- Verified successful Astro deployment: https://github.com/AgenialWerben/agenialwerben.github.io/actions/runs/38514959771
- Verified successful branch-based Pages workflow at the last patched source revision: https://github.com/AgenialWerben/agenialwerben.github.io/actions/runs/38514959333

**Not independently verified or not controllable with the present integration:**

- GitHub `main` branch protection (the GitHub API returned 403). The rulesets endpoint returned `[]`; this does not prove that no other protection exists.
- Actual response headers, domain HTTPS redirection, DNSSEC/CAA and domain registrar account security (domain could not be reached from the audit network).
- Active account 2FA/passkeys, third-party access, historical commits, audit log contents or secret scanning alerts.
- CodeQL alert inventory: successful analyzer execution does not prove its security tab contains no alerts; explicit alerts API was inaccessible.
- HSTS, `frame-ancestors` (clickjacking), `X-Content-Type-Options` and Permissions Policy as HTTP response headers; these cannot be reliably configured inside a GitHub Pages repository.

**Ongoing security maintenance:** Review Dependabot PRs rather than automatically merging breaking dependency changes; require successful checks and trusted human review before deployment; rerun this audit after large changes or at least quarterly.
