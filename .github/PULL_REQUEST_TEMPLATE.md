## What this changes

<!-- One or two sentences. What is different after this merges? -->

## Traceability

<!-- Required. Every PR cites at least one ID from the governance repo:
     D-nn · RQ-nnn · DEC-nnn · AS-nnn · OQ-nnn · RS-nnn · DS-nn · CLM-nn
     A change with no ID behind it has no requirement behind it. -->

**IDs:**

**Why this change follows from them:**

## Gate declaration

- [ ] This PR adds **no** front-end code, **or** it is covered by a waiver
      recorded in the governance repo's `docs/03-approval-gate.md`
- [ ] If it relies on a waiver, the waiver ID is: `DES-WAIVER-___`
- [ ] No brand value has been sampled from eleczo.com and presented as approved (DS-05)
- [ ] No claim from `docs/10-claims-register.md` appears in any deliverable (CC-01)
- [ ] No module is simulated without its backing data (BC-06) — anything
      unbacked is marked BLOCKED and says why

## Assumptions

<!-- If this rests on an assumption, list it with its AS- prefix and its
     invalidation trigger. An assumption that loses its label on a handoff
     becomes a false premise. Write "none" if there are none. -->

| AS-id | Assumption | Confidence | Invalidated by |
|---|---|---|---|
|  |  |  |  |

## Checks

- [ ] `node scripts/check-gate.mjs` passes locally
- [ ] `node scripts/check-claims.mjs` passes locally
- [ ] `node scripts/build.mjs` succeeds
- [ ] Keyboard-navigable; visible focus on every interactive element
- [ ] Checked at 360px, 768px and 1280px
- [ ] Checked in both light and dark themes

## Anything the reviewer should push back on

<!-- Where are you least confident? Say so here rather than hoping nobody asks. -->
