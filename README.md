# fail-closed-compilation

A regeneration step is still code, and code still breaks — the question is
what happens when it does. Silently shipping a degraded result is worse than
not running at all, because it looks like success. This repo is a minimal,
runnable demonstration of the other option: **abort and log, don't overwrite
what's already trusted.**

## The scenario

A compile step reads a source log, extracts lines starting with `RULE:`, and
writes a compact output file. The realistic failure mode isn't a crash — it's
upstream format drift. Someone changes the logging convention (bullets
instead of the `RULE:` prefix, say) without updating the extractor, and
suddenly a source full of real rules looks nearly empty to the parser.

```bash
npm start
```

Actual output from this repo's own code:

```
--- Run 1: healthy source ---
✓ PASS — 7 rules extracted, wrote compiled-rules.md

compiled-rules.md now contains 7 lines.

--- Run 2: upstream format drifted (the real-world failure mode) ---
✗ ABORTED — Only 1 rules extracted (minimum 5) — aborting without writing output
  compiled-rules.md left untouched.

compiled-rules.md is IDENTICAL to what Run 1 wrote.
The drifted source never touched the trusted output — it only wrote a FAIL line to compile-log.jsonl.
```

## The mechanism

```
new source → extract → count rules
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          count ≥ MIN_RULES      count < MIN_RULES
                 │                     │
                 ▼                     ▼
          write new output       ABORT — log FAIL,
          log PASS               old output untouched
```

One threshold (`MIN_RULES`, set to 5 in this demo), one branch. No partial
writes, no "mostly updated" state. The old file is either fully replaced by
something that cleared the bar, or it's exactly what it was yesterday.

## Why this matters

Shadow-mode gating (a different pattern — see
[shadow-mode-verdict-gate](https://github.com/singhjitesh889-blip/shadow-mode-verdict-gate))
is about new logic earning the right to act for the first time. This is a
different problem: an *existing, already-trusted* artifact, and a refresh
step that might degrade it. The two failure modes aren't symmetric — trusting
something too early is a different mistake from destroying something that
was already working — and a system that only guards against the first one
still loses its knowledge base to a quiet parser regression nobody notices
until someone asks why the AI stopped knowing things it used to know.

In the system this pattern is drawn from, this exact gate runs on every
session close: fewer than a hard minimum number of extracted rules, and the
compile aborts without writing, logs a structured failure line, and leaves
the previous day's file exactly as it was.
