const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");

const root = path.resolve(__dirname, "..");
const ts = createRequire(path.join(root, "frontend/package.json"))("typescript");
const filename = path.join(root, "frontend/app/global-frontend-data.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const dataModule = { exports: {} };
vm.runInNewContext(compiled, { module: dataModule, exports: dataModule.exports }, { filename });
const topics = dataModule.exports.globalFrontendTopics;
assert.equal(topics.length, 8);
assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length);
const rows = topics.flatMap(topic => topic.rows);
assert.equal(rows.length, 60);
assert.equal(new Set(rows.map(row => row.name)).size, rows.length);
let comparisons = 0;
for (const row of rows) {
  assert.equal(row.scores.length, 3);
  assert(row.scores.every(score => Number.isInteger(score) && score >= 0 && score <= 100));
  assert.equal(row.scores.reduce((sum, score) => sum + score, 0), 100, row.name);
  assert(row.explanation.length >= 80 && row.reason.length >= 80, row.name);
  assert(row.recommendedParts.length && row.recommendedExample, row.name);
  assert(!row.currentSource && !row.occurrence, "Global assessments must not invent repository evidence");
  if (row.scores[2] <= Math.max(row.scores[0], row.scores[1])) {
    assert(row.currentParts?.length && row.currentExample, `Missing comparison: ${row.name}`);
    comparisons++;
  }
  for (const part of [...(row.currentParts ?? []), ...row.recommendedParts]) {
    assert(part.file && part.description.length >= 30 && part.code.trim(), row.name);
    assert(!part.source, "Illustrations are not repository sources");
  }
  for (const ref of row.references) {
    assert(new URL(ref.url).protocol === "https:");
    assert(ref.title);
  }
}
const originalKeys = ["Server Components", "Client Components", "Route Handler als BFF", "Server Actions", "Rewrites zum Backend", "Frontend-eigene Domänenlogik"];
assert.equal(topics[0].id, "next-runtime");
for (const name of originalKeys) assert(topics[0].rows.some(row => row.name === name), `Preserve voting key: ${name}`);
console.log(`8 global frontend topics, ${rows.length} decisions, ${comparisons} comparisons: scores, examples and existing vote keys verified.`);
