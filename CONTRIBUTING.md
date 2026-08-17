# Contributing

Applies to human contributors and AI agents equally. Where a rule says "you", an
agent is included.

## Before anything else

Read [docs/BUILD-CONSTRAINTS.md](docs/BUILD-CONSTRAINTS.md). The approval gate is
CLOSED, and CI will reject a pull request that adds front-end code.

## Branching

```
main      protected. Release-ready. PR only, CI green, no direct pushes
develop   integration branch. Branch from here, merge back here via PR
```

Branch naming — the prefix says what kind of change it is, the ID says what
authorised it:

```
docs/DS-05-brand-token-architecture
chore/ci-artifact-retention
spike/DS-01-platform-detection
feat/RQ-014-search-entry-point      (only once the gate is OPEN)
```

## The traceability rule

**Every pull request cites at least one ID** from the governance repository:
`D-nn`, `RQ-nnn`, `DEC-nnn`, `AS-nnn`, `OQ-nnn`, `RS-nnn`, `DS-nn`, `CLM-nn`.

A change with no ID behind it has no requirement behind it, which means nobody
agreed to it. If you believe a change is needed and no ID covers it, raise the
requirement in the governance repo first. That is slower on purpose.

If you cite an assumption, **keep the `AS-` prefix in your output.** An
assumption that loses its label on a handoff becomes a false premise.

## Commits

```
<type>(<scope>): <summary>

<body: what changed and why, referencing IDs>
```

Types: `feat`, `fix`, `docs`, `chore`, `ci`, `refactor`, `test`, `spike`.

Write the body for someone reading it in six months with no memory of the
conversation that produced it. State the reasoning, not just the change.

## Pull requests

1. Branch from `develop`.
2. Run the checks locally — `node scripts/check-gate.mjs` and
   `node scripts/check-claims.mjs`. Both need Node 20+ and no dependencies.
3. Open the PR against `develop`. Fill in the template; it asks for the IDs and
   for a gate declaration.
4. CI must be green. The `gate` and `claims` jobs are not advisory.
5. One approving review, then squash-merge.

`develop` → `main` is itself a pull request, not a fast-forward.

## What CI enforces

| Job | Fails when |
|---|---|
| `gate` | The approval gate is CLOSED and the branch adds front-end code to `src/`, **or** the gate file cannot be read (it fails closed) |
| `claims` | An unsubstantiated claim from `docs/10-claims-register.md` appears in a deliverable file |
| `build` | The build script exists and errors |

### If the `gate` job blocks you

That is the job working. Your options, in order of preference:

1. **The change does not need front-end code** — most pre-gate work does not.
   Reframe it as documentation, a spike, or a requirement.
2. **The gate should be open** — take it to the named approver (DS-14) in the
   governance repo. Not here.
3. **This specific item should be waived** — the approver records it in writing
   in `docs/03-approval-gate.md`, converting it to an `AS-nn` with an
   invalidation trigger.

**Not an option:** editing `scripts/check-gate.mjs`, adding a skip condition, or
moving the file outside `src/`. A PR doing any of those will be rejected on
sight. The check reads the gate live from the governance repo precisely so that
it cannot be talked around locally.

## For AI agents specifically

- Read the governance repo before writing. Do not infer requirements from this
  repository's structure — it is subordinate, and it may be wrong.
- Do not invent brand values. DS-05 is BLOCKED and no colour, type family or
  logo rule has been approved. Sampling the live site is explicitly prohibited.
- Do not build a module whose backing data does not exist. Mark it `BLOCKED`
  and say why (BC-06).
- Label confidence. If something is an assumption, say so and give it an
  invalidation trigger.
- Report honestly. If you could not do something, say that rather than producing
  a plausible substitute.
