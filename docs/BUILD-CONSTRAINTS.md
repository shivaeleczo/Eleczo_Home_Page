# Build constraints

Constraints this repository inherits from the governance repository
[Eleczo-Home-Page-Design](https://github.com/shivaeleczo/Eleczo-Home-Page-Design).

**This file is a pointer, not a source.** Where it disagrees with the governance
repo, the governance repo is correct. Do not resolve a conflict by editing this file.

---

## BC-01 — The approval gate

**Source:** [`docs/03-approval-gate.md`](https://github.com/shivaeleczo/Eleczo-Home-Page-Design/blob/main/docs/03-approval-gate.md)
**Status:** CLOSED — G-1…G-8 all unmet
**Enforced by:** `scripts/check-gate.mjs`, `gate` job in CI

| Blocked until the gate opens | Permitted now |
|---|---|
| UI design | Discovery, research, analysis |
| Graphic design | Requirement drafting |
| Final homepage copy | Wireframe-level diagrams used to interrogate requirements |
| Frontend code | Technical spikes that answer a blocking question |
| Magento module or template code | **This repository's own scaffolding** |
| Any commitment to a visual direction | |

The gate is opened only by the named approver (G-8), and a blocking item is
waived only in writing in the gate file, by converting it to an `AS-nn`
assumption with an invalidation trigger. **Silent waiver is not available to any
agent or contributor**, and CI is configured on that basis: it reads the live
gate file and fails closed if it cannot.

## BC-02 — CC-01, the claims constraint

**Source:** [`docs/10-claims-register.md`](https://github.com/shivaeleczo/Eleczo-Home-Page-Design/blob/main/docs/10-claims-register.md)
**Enforced by:** `scripts/check-claims.mjs`, `claims` job in CI

No claim in the register may appear in copy, metadata, structured data, imagery
or any other deliverable until its status is `SUBSTANTIATED` with a named
approver. **0 of 10 claims are currently cleared.**

The CI check catches text only. CC-01 is explicit that *"a claim carried in an
image is still a claim"* — image review stays a human responsibility.

## BC-03 — No brand tokens exist

**Source:** DS-05, currently `BLOCKED`

No approved colour value, type family, weight or logo rule exists anywhere in
this project. No value may be sampled from the live site and committed here.
Extracted values become indistinguishable from approved ones the moment they
enter a token file, and that is exactly how an unverified observation becomes a
production standard.

Token *architecture* (naming, scale structure, semantic layering) may be defined.
Token *values* may not.

## BC-04 — The platform premise is unverified

**Source:** RISK-03 / DS-01

It is **not established that the storefront is Magento at all.** Every
specification written so far assumes Magento 2 on the basis of project
convention, not evidence, and the only third-party stack signal available points
at WordPress-adjacent tooling.

Consequence for this repository: **do not commit build tooling, a framework
choice, or a deployment target that presupposes Magento.** That is why there is
no `package.json` and no deploy job. DEC-002 (frontend approach) is also still open.

## BC-05 — Traceability

Every artefact must map to an ID from the governance repo — `D-nn`, `RQ-nnn`,
`DEC-nnn`, `AS-nnn`, `OQ-nnn`, `RS-nnn`, `DS-nn`, `CLM-nn`. A change that cites
no ID has no requirement behind it, which means nobody agreed to it.

Any agent citing an assumption **must carry the `AS-` prefix through into its
output**. An assumption that loses its label on a handoff becomes a false
premise, and that is how unvalidated beliefs reach production.

## BC-06 — No fake functionality

A module that looks like it works but is backed by nothing is prohibited. This
bites hardest on two modules whose data may never arrive:

- **Application / industry shopping** (DS-11) needs a curated
  application → product-type mapping dataset authored by an electrical domain
  expert. It is domain data, not UI.
- **RFQ / quote** (DS-12) needs an owner, a routing rule and a response-time
  commitment. A form without a workflow behind it collects intent from your
  highest-value buyers and drops it.

If the data or the process is absent, mark the module `BLOCKED`. Do not build
a convincing shell.

---

## Keeping this file honest

`scripts/check-gate.mjs` reads the gate live rather than trusting this file, so
BC-01 cannot silently drift. BC-02…BC-06 are prose and **can** drift. Re-read the
governance repo before relying on them, and open a PR here when they change.

| Constraint | Drift risk | Mitigation |
|---|---|---|
| BC-01 | None | Read live from the governance repo on every CI run |
| BC-02 | Low | Patterns in `check-claims.mjs`; update when a claim is substantiated |
| BC-03…BC-06 | **Real** | Manual. Verify against the governance repo |
