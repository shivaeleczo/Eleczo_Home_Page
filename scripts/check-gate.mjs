#!/usr/bin/env node
/**
 * Approval gate enforcement.
 *
 * The gate is defined in the governance repository, not here. This script reads
 * it live on every run rather than trusting a local mirror, because a mirror
 * drifts and a drifted gate is worse than no gate.
 *
 * Behaviour:
 *   gate CLOSED + front-end code present in src/  -> exit 1
 *   gate CLOSED + src/ clean                      -> exit 0
 *   gate OPEN                                     -> exit 0
 *   gate file unreachable or unparseable          -> exit 1 (fail closed)
 *
 * Failing closed is deliberate. A network blip must not be a route to shipping
 * ungated design work.
 */

import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, extname, relative } from 'node:path'

const GATE_URL =
  'https://raw.githubusercontent.com/shivaeleczo/Eleczo-Home-Page-Design/main/docs/03-approval-gate.md'

const SRC_DIR = 'src'

/** Extensions that constitute design or front-end implementation. */
const GATED_EXTENSIONS = new Set([
  '.html', '.htm', '.phtml',
  '.css', '.scss', '.sass', '.less',
  '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
  '.xml',           // Magento layout XML
  '.twig', '.liquid',
])

/** Files that are documentation about the gate, not work product under it. */
const ALLOWED_FILENAMES = new Set(['README.md', '.gitkeep'])

function walk(dir, found = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return found // src/ absent is fine
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full, found)
    } else if (
      !ALLOWED_FILENAMES.has(entry) &&
      GATED_EXTENSIONS.has(extname(entry).toLowerCase())
    ) {
      found.push(relative('.', full).replaceAll('\\', '/'))
    }
  }
  return found
}

async function readGate() {
  const response = await fetch(GATE_URL, {
    headers: { 'user-agent': 'eleczo-gate-check' },
  })
  if (!response.ok) {
    throw new Error(`gate file returned HTTP ${response.status}`)
  }
  const text = await response.text()
  const match = text.match(/^##\s*Gate status:\s*(\w+)/mi)
  if (!match) {
    throw new Error('could not find a "## Gate status:" line in the gate file')
  }

  // The gate permits a written waiver, recorded in the gate file itself and
  // converted into AS-nn assumptions. Honouring it here is the difference
  // between a governed exception and someone quietly deleting this check.
  const waivers = [...text.matchAll(/^###\s+(DES-WAIVER-\d+)/gmi)].map((m) => m[1])

  return { status: match[1].toUpperCase(), waivers }
}

function report(status, waivers, offenders, error) {
  writeFileSync(
    'gate-report.json',
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        gateUrl: GATE_URL,
        status,
        waivers,
        offenders,
        error: error ?? null,
      },
      null,
      2,
    ) + '\n',
  )
}

let gate
try {
  gate = await readGate()
} catch (error) {
  report('UNKNOWN', [], [], error.message)
  console.error(`FAIL: cannot determine gate status - ${error.message}`)
  console.error('Failing closed. Build work stays blocked until the gate is readable.')
  process.exit(1)
}

const { status, waivers } = gate
const offenders = walk(SRC_DIR)
report(status, waivers, offenders)

console.log(`Approval gate: ${status}`)
console.log(`Recorded waivers: ${waivers.length ? waivers.join(', ') : 'none'}`)
console.log(`Gated files under ${SRC_DIR}/: ${offenders.length}`)

if (status !== 'CLOSED') {
  console.log('Gate is not closed. Front-end work is authorised.')
  process.exit(0)
}

if (offenders.length === 0) {
  console.log('Gate is CLOSED and src/ contains no front-end code. Correct.')
  process.exit(0)
}

if (waivers.length > 0) {
  console.warn('')
  console.warn('==================================================================')
  console.warn(`WARNING: gate is CLOSED. Proceeding under waiver ${waivers.join(', ')}.`)
  console.warn('')
  console.warn('This code is a PROTOTYPE, not approved work. It rests on AS-011,')
  console.warn('AS-012 and AS-013 - all recorded with invalidation triggers.')
  console.warn('Nothing here may be promoted to a requirement, and none of it may')
  console.warn('reach production. G-8 is still Not met: no FRS approver is named.')
  console.warn('==================================================================')
  console.warn('')
  for (const file of offenders) console.warn(`  under waiver: ${file}`)
  process.exit(0)
}

console.error('')
console.error('FAIL: the approval gate is CLOSED but this branch adds front-end code:')
for (const file of offenders) console.error(`  - ${file}`)
console.error('')
console.error('The gate blocks UI design, frontend code and Magento template code.')
console.error('To proceed, the named approver must open the gate, or record a written')
console.error('waiver in docs/03-approval-gate.md in the governance repository.')
console.error('Silent waiver is not available to any agent or contributor.')
process.exit(1)
