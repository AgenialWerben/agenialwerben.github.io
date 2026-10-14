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
