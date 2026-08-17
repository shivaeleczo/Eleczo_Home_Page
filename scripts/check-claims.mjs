#!/usr/bin/env node
/**
 * CC-01 enforcement - the binding constraint from docs/10-claims-register.md
 * in the governance repository:
 *
 *   "No claim in this register may appear in homepage copy, metadata,
 *    structured data, imagery or any other deliverable until its status
 *    here is SUBSTANTIATED and an approver is named."
 *
 * As of the last sync, 0 of the 10 claims are SUBSTANTIATED and 0 are cleared
 * for homepage use. So every pattern below is currently banned outright.
 *
 * This catches text. It cannot catch a claim baked into an image - CC-01 notes
 * that "a claim carried in an image is still a claim", and that part stays a
 * human review responsibility.
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join, extname, relative } from 'node:path'

/** Governance and tooling paths - they discuss the claims, they do not make them. */
const EXCLUDED_PATHS = ['.git', 'node_modules', 'docs', 'scripts', '.github', 'README.md', 'CONTRIBUTING.md']

const SCANNED_EXTENSIONS = new Set([
  '.html', '.htm', '.phtml', '.xml', '.json', '.md', '.txt',
  '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
  '.css', '.scss', '.yml', '.yaml', '.csv', '.svg',
])

/** Each pattern maps to the claim ID that bans it. */
const BANNED = [
  { id: 'CLM-01', label: 'brand count',            pattern: /\b(40|50)\s*\+?\s*(top\s+|global\s+)?brands\b/i },
  { id: 'CLM-02', label: 'product / SKU count',    pattern: /\b(40|50)\s*k\s*\+?\s*products\b/i },
  { id: 'CLM-03', label: 'years of experience',    pattern: /\b(57|50\s*\+?)\s*years\b/i },
  { id: 'CLM-04', label: 'certified seller count', pattern: /\b600\s*\+?\s*certified\s+sellers\b/i },
  { id: 'CLM-05', label: '100% satisfaction',      pattern: /\b100\s*%\s*(customer\s+)?satisfaction\b/i },
  { id: 'CLM-06', label: 'quality / assurance',    pattern: /\b(world[- ]class\s+electrical|assured\s+products|products\s+are\s+verified)\b/i },
  { id: 'CLM-08', label: "'India's Largest'",      pattern: /india'?s\s+largest\b/i },
  { id: 'CLM-09', label: "'India's best/trusted'", pattern: /india'?s\s+(best|most\s+trusted|reliable\s+and\s+preferred)\b/i },
]

function walk(dir, found = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return found
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    const rel = relative('.', full).replaceAll('\\', '/')
    if (EXCLUDED_PATHS.some((excluded) => rel === excluded || rel.startsWith(`${excluded}/`))) continue
    if (statSync(full).isDirectory()) {
      walk(full, found)
    } else if (SCANNED_EXTENSIONS.has(extname(entry).toLowerCase())) {
      found.push(rel)
    }
  }
  return found
}

const violations = []

for (const file of walk('.')) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const { id, label, pattern } of BANNED) {
      const match = line.match(pattern)
      if (match) {
        violations.push({ file, line: index + 1, id, label, text: match[0].trim() })
      }
    }
  })
}

writeFileSync(
  'claims-report.json',
  JSON.stringify({ checkedAt: new Date().toISOString(), violations }, null, 2) + '\n',
)

if (violations.length === 0) {
  console.log('CC-01: no unsubstantiated claims found in deliverable files.')
  process.exit(0)
}

console.error('FAIL: CC-01 violation - unsubstantiated claims found.')
console.error('')
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.id} ${v.label}]  "${v.text}"`)
}
console.error('')
console.error('None of the claims in docs/10-claims-register.md are SUBSTANTIATED and')
console.error('none is cleared for use. Remove the claim, or have Marketing + Legal')
console.error('substantiate it with a basis, an as-at date and a named approver first.')
process.exit(1)
