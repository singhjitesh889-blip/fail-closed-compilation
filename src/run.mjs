#!/usr/bin/env node
import { readFileSync, existsSync, rmSync } from 'node:fs'
import { compile } from './compile.mjs'

const OUTPUT_PATH = new URL('../data/compiled-rules.md', import.meta.url)
const LOG_PATH = new URL('../data/compile-log.jsonl', import.meta.url)

if (existsSync(OUTPUT_PATH)) rmSync(OUTPUT_PATH)
if (existsSync(LOG_PATH)) rmSync(LOG_PATH)

console.log('--- Run 1: healthy source ---')
compile(new URL('../data/source-log-good.md', import.meta.url))
const afterGood = readFileSync(OUTPUT_PATH, 'utf-8')
console.log(`\ncompiled-rules.md now contains ${afterGood.trim().split('\n').length} lines.\n`)

console.log('--- Run 2: upstream format drifted (the real-world failure mode) ---')
compile(new URL('../data/source-log-drifted.md', import.meta.url))

const afterDrifted = readFileSync(OUTPUT_PATH, 'utf-8')
console.log(`\ncompiled-rules.md is ${afterDrifted === afterGood ? 'IDENTICAL' : 'DIFFERENT'} to what Run 1 wrote.`)
console.log('The drifted source never touched the trusted output — it only wrote a FAIL line to compile-log.jsonl.')
