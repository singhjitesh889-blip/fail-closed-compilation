#!/usr/bin/env node
// compile.mjs — the fail-closed gate. A regeneration either produces at
// least MIN_RULES, and writes, or it produces fewer and ABORTS without
// writing anything -- the old, known-good output stays exactly as it was.
// The failure is logged, not silent.

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs'
import { extractRules } from './extract-rules.mjs'

const MIN_RULES = 5
const OUTPUT_PATH = new URL('../data/compiled-rules.md', import.meta.url)
const LOG_PATH = new URL('../data/compile-log.jsonl', import.meta.url)

function appendLog(entry) {
  appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n')
}

export function compile(sourcePath) {
  const source = readFileSync(sourcePath, 'utf-8')
  const rules = extractRules(source)
  const timestamp = new Date().toISOString()

  if (rules.length < MIN_RULES) {
    const entry = {
      timestamp,
      gate: 'compile',
      result: 'FAIL',
      reason: `Only ${rules.length} rules extracted (minimum ${MIN_RULES}) — aborting without writing output`,
    }
    appendLog(entry)
    console.log(`✗ ABORTED — ${entry.reason}`)
    console.log(`  ${OUTPUT_PATH.pathname.split('/').pop()} left untouched.`)
    return { wrote: false, count: rules.length }
  }

  writeFileSync(OUTPUT_PATH, rules.map(r => `- ${r}`).join('\n') + '\n')
  const entry = {
    timestamp,
    gate: 'compile',
    result: 'PASS',
    reason: `${rules.length} rules extracted, wrote compiled-rules.md`,
  }
  appendLog(entry)
  console.log(`✓ PASS — ${entry.reason}`)
  return { wrote: true, count: rules.length }
}

const sourceArg = process.argv[2]
if (sourceArg) {
  compile(new URL(`../data/${sourceArg}`, import.meta.url))
}
