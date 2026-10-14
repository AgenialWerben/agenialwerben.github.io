# Security Policy — TFOC website

## Scope

This policy covers the public static website, its repository, and its official GitHub Pages deployments. It does not authorize attacks against third-party infrastructure, GitHub itself, or unreleased game builds in private Drive storage.

## Reporting a concern

Email **contacto@thefivenorcommunity.tech** with a concise description, affected URL or file, reproduction steps, and the potential impact. Please do not send passwords, access tokens, private customer information, or unredacted secrets.

If GitHub private vulnerability reporting is enabled in the repository's Security settings, that channel is preferred for a sensitive proof-of-concept. Its availability has not been verified.

We ask researchers to use responsible, non-disruptive testing; avoid denial-of-service, persistence, social engineering, or access to third-party information. No bug bounty or guaranteed response timeframe is offered.

## Current protections and remaining limits

- Static site generation via Astro; no site-owned accounts, server APIs, or payment processor.
- Restrictive **Content Security Policy in HTML meta tags**, no unapproved inline JavaScript or CSS (the bundled Astro module is explicitly SHA-256 hashed), self-hosted assets and no-referrer policy.
- GitHub Actions read-only repository access for builds; restricted GitHub Pages deployment token for deploy job.
- Pinned workflow actions and dependency lock are tracked by scheduled update checks.
- Automated static checks, dependency vulnerability auditing and source analysis are configured in CI.

**Important:** A CSP in a meta tag cannot apply `frame-ancestors` and does not replace HTTP security headers. GitHub Pages does not provide arbitrary custom security response headers through this repository. Clickjacking, HSTS configuration, permissions headers and edge/WAF controls require a compatible hosting/CDN solution or provider configuration.

The public HTML and repository files are intentionally accessible; never commit secrets. The current code review does not prove the absence of secrets in Git history or third-party systems.

## Security baseline to verify in GitHub Settings

1. Enable account passkeys/2FA and avoid shared credentials.
2. Require reviewed pull requests, required successful security/build checks, and no force-push or direct changes to `main`.
3. Protect workflow changes using code owners and separate review.
4. Enable Dependabot, secret scanning/push protection where available, and review CodeQL alerts regularly.
5. Keep GitHub Pages HTTPS enforced; verify domain ownership, lock down DNS provider with 2FA, and preserve mail DNS records.
6. Test the domain's **actual HTTP response headers** and DNS from a network that can reach it, especially after any hosting change.

## Publication integrity

The site must preserve the official name **The Fiven Or Community** without machine translation and must not leak the unpublished game title or private files. Report unexpected changes promptly.
