# Eleczo_Home_Page

**Build repository** for the Eleczo homepage body rebuild.

> ### ⚠️ Gate status: CLOSED — prototype published under DES-WAIVER-001
>
> This repository contains an **unapproved homepage body prototype**, built
> because the stakeholder instructed it directly on 2026-08-17. The waiver is
> recorded in the governance repo's
> [gate file](https://github.com/shivaeleczo/Eleczo-Home-Page-Design/blob/main/docs/03-approval-gate.md),
> not applied silently. **G-8 is still Not met** — no named FRS approver exists.
>
> Nothing here is approved, and nothing here is a requirement. It rests on
> **AS-011**, **AS-012** and **AS-013**, each with an invalidation trigger.
> See [Build constraints](docs/BUILD-CONSTRAINTS.md).

**Review preview:** https://shivaeleczo.github.io/Eleczo_Home_Page/
(non-indexable, `robots.txt` disallowed — it is a preview, not staging or production)

---

## What this repository is

This is the **build and deployment** repository. It holds the pipeline, the
tooling and (once the gate opens) the homepage body implementation.

It is **not** the source of truth for requirements. That lives in the
governance repository:

| Repository | Holds | Authority |
|---|---|---|
| [Eleczo-Home-Page-Design](https://github.com/shivaeleczo/Eleczo-Home-Page-Design) | Charter, FRS, discovery register, decision log, assumptions, claims register, standards, agent roster | **Governing.** Wins every conflict |
| **Eleczo_Home_Page** (this repo) | Build pipeline, tooling, homepage body implementation | Subordinate. Implements what the FRS specifies |

When the two disagree, the governance repository is correct and this one is a bug.

## Why the gate exists

The expensive failure mode on this project is not bad code — it is well-built
work that implements the wrong requirement. The gate is defined in
[`docs/03-approval-gate.md`](https://github.com/shivaeleczo/Eleczo-Home-Page-Design/blob/main/docs/03-approval-gate.md)
in the governance repo and currently has **eight unmet conditions (G-1…G-8)**.

**Blocked until it opens:** UI design, graphic design, final homepage copy,
frontend code, Magento module or template code, any commitment to a visual direction.

**Permitted now:** this repository's own scaffolding — which is what you are looking at.

CI enforces this mechanically rather than by convention. `scripts/check-gate.mjs`
reads the live gate file from the governance repo on every run; it does not trust
a local copy, and it fails closed if it cannot reach it.

## Current state

| Item | State |
|---|---|
| Build pipeline | Wired and running |
| Gate enforcement | Active — honours a *recorded* waiver, fails closed otherwise |
| Claims enforcement | Active (`claims` job) — enforces CC-01 mechanically |
| Frontend framework | **Undecided** — DEC-002 is still open, so none is committed |
| Homepage implementation | Prototype in [`src/`](src/) — unapproved |
| Review preview | GitHub Pages, non-indexable |
| Staging / production | **None, by design.** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |

There is deliberately no `package.json`, no bundler and no dependency.
`scripts/build.mjs` copies `src/` to `dist/` and nothing else. Choosing a
framework now would decide DEC-002 by accident, and the platform premise itself
is unverified (RISK-03 / DS-01 — it is not established that the storefront is
Magento at all).

## Six modules are shown BLOCKED, not mocked up

The prototype renders these as explicitly blocked rather than faking them,
because a convincing shell backed by nothing is precisely the failure BC-06
prohibits: shop by application, shop by industry, shop by brand, buying guides,
product cards with price, seller identity on listings.

Every numeric and superlative claim Eleczo publishes is withheld under CC-01.
The trust section is thin because **0 of 10 claims are substantiated** — that is
the honest state, not an unfinished section.

## Getting started

```bash
git clone https://github.com/shivaeleczo/Eleczo_Home_Page.git
cd Eleczo_Home_Page

# run the same checks CI runs
node scripts/check-gate.mjs
node scripts/check-claims.mjs
```

Both scripts need Node 20+ and no dependencies.

## Branching and pull requests

`main` is protected. All work goes through a pull request from a branch off
`develop`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full flow, the commit
convention and the traceability rule (every change cites an ID).

## What unblocks this repository

Three answers from the governance repo's decision register, in order of leverage:

1. **DS-01** — is the storefront Magento, and which edition? Until this is
   answered, no build tooling choice can be justified.
2. **DS-02** — what is the homepage commercially accountable for, ranked?
3. **DS-05** — approved brand palette and design tokens. Currently BLOCKED;
   no colour value has been sampled from the live site or invented.

Until those land, this repository correctly does nothing but refuse to build.
