# src/ — homepage body prototype

Contains an **unapproved prototype**, built under `DES-WAIVER-001` while the
approval gate is still CLOSED.

| File | What it is |
|---|---|
| `index.html` | Homepage body composition. Header and footer are included **out of scope**, marked as such, purely so the body can be judged in context (C-15) |
| `assets/tokens.css` | Design tokens. Every value is a **placeholder** (AS-011) |
| `assets/styles.css` | Component styles. Contains no literal colour — an approved palette swaps in via tokens alone |
| `assets/app.js` | Identifier normalisation, governance overlay, theme toggle. Nothing else |

## What this is not

It is not approved, it is not a requirement, and it is not a commitment to a
visual direction. G-8 is still Not met — no named FRS approver exists (DS-14).

## The three assumptions it rests on

| ID | Assumption | Conf. | Invalidated by |
|---|---|---|---|
| **AS-011** | Placeholder tokens are acceptable stand-ins, to be replaced wholesale | Low | DS-05 supplying an approved palette |
| **AS-012** | DEC-001 Option A — fixed composition, trade-first, routing rails for secondary | Low | DS-02 / DS-06 ranking differently |
| **AS-013** | Identifier entry is the primary above-fold action, ahead of a promotional hero | Medium | T-23 site-search logs contradicting |

When those land, it must be unambiguous which parts get re-decided rather than
adopted. That is what the labels are for.

## Deliberate omissions

These are **not** unfinished work. Each is blocked, shown as blocked in the page
itself, and would be fake functionality if built (BC-06):

- **Shop by application / industry** — DS-11, no mapping dataset exists
- **Shop by brand** — CLM-10, per-brand logo authorisation unknown
- **Product cards with price** — DS-07, pricing policy undecided and it is a
  cacheability question before it is a layout one
- **Working RFQ submission** — DS-12, no owner, routing rule or response SLA
- **Buying guides** — M-20, content may not exist
- **Seller identity on listings** — DS-16, commercial ruling outstanding

Every numeric and superlative claim Eleczo currently publishes is withheld under
**CC-01**, and `scripts/check-claims.mjs` fails the build if one reappears. The
trust section looks thin because 0 of 10 claims are substantiated — that is the
honest state, not a design shortfall.

## No product photography

M-17 supplies no asset library. Inventing product imagery would be fake content,
so the hero uses an abstract inline SVG schematic instead.

## Running it

It is plain static HTML with no dependencies.

```bash
node scripts/build.mjs        # writes dist/
npx serve dist                # or any static server
```
