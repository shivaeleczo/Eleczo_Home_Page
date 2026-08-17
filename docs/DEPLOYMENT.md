# Deployment

> **Updated 2026-08-17 under DES-WAIVER-001.** A **review preview** is now
> published to GitHub Pages so stakeholders can see the prototype. Read the
> distinction below carefully — a review preview is not a deployment, and
> staging and production remain unbuilt and blocked.

## What exists: a review preview

`.github/workflows/preview.yml` publishes `dist/` to GitHub Pages on every push
to `main`, **after** the gate and claims checks pass.

It is hedged deliberately:

| Guard | Why |
|---|---|
| `robots.txt` serves `Disallow: /` | Unapproved work must not be indexed |
| `<meta name="robots" content="noindex, nofollow">` | Belt and braces — the workflow fails if either guard is missing |
| Permanent UNAPPROVED PROTOTYPE banner in the page | The page must state what it is even when the URL is shared without context |
| `PROTOTYPE.txt` written into every artifact | A downloaded copy carries the same warning |
| Blocked by `guard` job | A CC-01 violation or a revoked waiver stops publication |

The governance repo publishes a prototype on a **public, indexable** Pages site.
This preview does not repeat that mistake.

## What does not exist: staging and production

No staging push, no Magento deploy, no hosting credentials in this repository.
That remains deliberate, and the preconditions below are unchanged.

## Why

| Reason | Detail |
|---|---|
| The gate is CLOSED | There is no approved homepage to deploy. A deploy job would have nothing to carry |
| The platform is unverified | RISK-03 / DS-01 — it is not established that the storefront is Magento. A Magento deploy target would encode an unproven premise into infrastructure |
| No brand tokens exist | DS-05 is BLOCKED. Anything published now would use invented or sampled values, and a published page is how an unapproved value becomes the de-facto standard |
| Unapproved work has already leaked once | The governance repo publishes a live GitHub Pages site carrying a commit titled *"Add unapproved homepage body prototype"*. That page is public and indexable. Adding a second publishing surface before the gate opens repeats the mistake |
| Secrets have a cost | Deploy credentials in a public repository are a standing liability. They should arrive when they are needed, not in advance |

## The pipeline

```
push / PR                          push to main
   │                                   │
   ├── gate    reads the live gate     ├── guard    gate + claims, again
   ├── claims  enforces CC-01          │
   │                                   └── publish  build → verify noindex
   └── build   needs: [gate, claims]                → GitHub Pages preview
               node scripts/build.mjs
               uploads artifact (30d)
```

The artifact is also downloadable from the run page, carrying `PROTOTYPE.txt`.

## Adding real deployment later

Do not add a staging or production deploy job until **all** of these hold:

1. **The gate is OPEN** — G-1…G-8 met, or the specific items waived in writing by
   the named approver in the gate file.
2. **DS-01 is answered** — the platform and edition are confirmed, so the deploy
   target is known rather than assumed.
3. **DS-05 is resolved** — approved brand tokens exist, so what gets published is
   approved rather than derived.
4. **DS-09 is granted** — repository and staging access, so the pipeline deploys
   to a real environment instead of a guessed one.
5. **A target environment is named and owned** by someone who can be told when it breaks.

### Likely shape, when the time comes

**Stakeholder preview** — a static preview per pull request, behind
authentication, with `X-Robots-Tag: noindex`. Not indexable. The current public
Pages site in the governance repo is the counter-example to avoid.

**Staging** — deploy from `develop` to the Eleczo staging environment over SSH,
using repository secrets, gated on the `gate` and `claims` jobs passing.

**Production** — never automatic from CI. A tagged release, a human approval
environment, and a documented rollback. A homepage is the single highest-traffic
surface on the site; an automatic production push from a merge is not an
appropriate risk profile for it.

### Secrets required at that point

| Secret | Purpose |
|---|---|
| `STAGING_SSH_KEY` | Deploy key for the staging host |
| `STAGING_HOST`, `STAGING_PATH` | Target |
| `CDN_PURGE_TOKEN` | Cloudflare cache invalidation after deploy (C-08 confirms a Cloudflare layer) |

None of these exist yet. Do not create them speculatively.

## Related

- [BUILD-CONSTRAINTS.md](BUILD-CONSTRAINTS.md) — BC-01 (gate), BC-04 (platform premise)
- Governance repo: `docs/09-stakeholder-decision-register.md` — DS-01, DS-04, DS-05, DS-09
