#!/usr/bin/env node
/**
 * Build: copy src/ to dist/.
 *
 * That is the whole build. There is no bundler, no framework and no
 * dependency, because DEC-002 (frontend approach) is undecided and DS-01 has
 * not confirmed the platform. Committing a toolchain now would decide DEC-002
 * by accident, which is how architecture gets chosen without anyone agreeing
 * to it.
 *
 * When DEC-002 lands, replace this file. Until then it stays deliberately dumb.
 */

import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'src'
const OUT = 'dist'

if (!existsSync(SRC)) {
  console.error(`FAIL: ${SRC}/ does not exist.`)
  process.exit(1)
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

cpSync(SRC, OUT, {
  recursive: true,
  filter: (source) => !source.endsWith('README.md'),
})

// The prototype must not be indexed. The governance repo already publishes an
// unapproved prototype on a public Pages site; this one does not repeat that.
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n')

// Marker so a downloaded artifact can never be mistaken for approved work.
writeFileSync(
  join(OUT, 'PROTOTYPE.txt'),
  [
    'UNAPPROVED PROTOTYPE',
    '',
    'Built under DES-WAIVER-001 while the approval gate is CLOSED.',
    'G-8 is Not met: no named FRS approver exists (DS-14 is OPEN).',
    '',
    'Resting on:',
    '  AS-011  placeholder design tokens - no approved palette exists (DS-05)',
    '  AS-012  DEC-001 Option A composition - not evidence-based (DS-02, DS-06)',
    '  AS-013  identifier search as primary above-fold action (unverified until T-23)',
    '',
    'Nothing here may be promoted to a requirement or deployed to production.',
    '',
    `Built: ${new Date().toISOString()}`,
    '',
  ].join('\n'),
)

function count(dir) {
  let files = 0
  let bytes = 0
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stats = statSync(full)
    if (stats.isDirectory()) {
      const nested = count(full)
      files += nested.files
      bytes += nested.bytes
    } else {
      files += 1
      bytes += stats.size
    }
  }
  return { files, bytes }
}

const { files, bytes } = count(OUT)
console.log(`Built ${OUT}/ - ${files} files, ${(bytes / 1024).toFixed(1)} kB total.`)
console.log('No dependencies, no bundler. DEC-002 remains open.')
