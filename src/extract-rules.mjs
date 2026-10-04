// extract-rules.mjs — deliberately simple: looks for lines starting with
// "RULE:". Realistic failure mode: if the upstream logging convention
// drifts (bullets instead of the RULE: prefix, say), this extractor finds
// almost nothing -- not because the rules are gone, but because the format
// moved and nobody updated the parser. That's the scenario this repo guards
// against, not a hypothetical.

export function extractRules(sourceText) {
  return sourceText
    .split('\n')
    .filter(line => line.trim().startsWith('RULE:'))
    .map(line => line.trim().slice('RULE:'.length).trim())
}
