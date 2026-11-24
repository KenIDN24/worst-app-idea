import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const LINE =
  "Meet Blink: a wearable that vibrates every time you blink, so you can finally track your blink-rate in real time and get a weekly Blink Score, benchmarked against other blinkers in your area.";

const MAX_CHARS = 240;

function fail(message: string): never {
  throw new Error(message);
}

// Gate 1: length 1-240 chars (sealed scorer).
if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`entry must be 1-${MAX_CHARS} characters, got ${LINE.length}`);
}
// Gate 2: single line, no leading/trailing whitespace.
if (LINE.includes("\n") || LINE !== LINE.trim()) {
  fail("entry must be a single line with no surrounding whitespace");
}
// Gate 3: exactly one sentence — one sentence-terminating period at the end, none inside.
const body = LINE.slice(0, -1);
if (!LINE.endsWith(".") || body.includes(".")) {
  fail("entry must be exactly one sentence");
}
// Gate 4: the pitch must name the product and its useless function.
if (!LINE.startsWith("Meet Blink:") || !LINE.includes("blink-rate")) {
  fail("entry must pitch Blink and its blink-rate tracking");
}
// Gate 5 (judge-aligned): one clean sentence, one idea only — no second
// product or second idea crowding it, and the specific useless metric must
// be present so the picture stays vivid, not generic.
if (!LINE.includes("weekly Blink Score")) {
  fail("entry must name its specific useless metric (weekly Blink Score)");
}
if (/and also|second app|another app/i.test(LINE)) {
  fail("entry must pitch exactly one app idea");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

// Round-trip check: what was written must be byte-identical to the line.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== LINE) {
  fail("round-trip check failed: written file differs from the entry");
}

console.log(`entry ok: ${LINE.length} chars, 1 line`);
