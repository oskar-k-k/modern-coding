const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const root = path.resolve(__dirname, "../frontend");
const ts = createRequire(path.join(root, "package.json"))("typescript");
const cache = new Map();

function load(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  if (filename.endsWith(".json")) return JSON.parse(fs.readFileSync(filename, "utf8"));
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const requireLocal = name => {
    assert(name.startsWith("."), "Only local analysis data dependencies expected");
    const resolved = path.resolve(path.dirname(filename), name);
    return load(fs.existsSync(resolved) ? resolved : resolved + ".ts");
  };
  vm.runInNewContext(code, { module, exports: module.exports, require: requireLocal }, { filename });
  return module.exports;
}

const { analyses } = load(path.join(root, "app/architecture-data.ts"));
for (const analysis of analyses) {
  for (const framework of analysis.frameworks) {
    assert.equal(new Set(framework.topics.map(topic => topic.id)).size, framework.topics.length);
    assert(!framework.topics.some(topic => topic.id === "patterns"));
    for (const topic of framework.topics) {
      for (const row of topic.rows) {
        assert.equal(row.scores.reduce((sum, value) => sum + value, 0), 100, row.name);
      }
    }
  }
}
const globalTopics = analyses.find(item => item.kind === "global").frameworks[0].topics;
const architecture = globalTopics.find(topic => topic.id === "architecture");
const paradigms = globalTopics.find(topic => topic.id === "paradigms");
assert.deepEqual(Array.from(globalTopics, topic => topic.label), [
  "Sprache & Typen", "Programmierparadigmen", "Architektur & Struktur", "Code-Design",
  "Daten & Persistenz", "Framework & Laufzeit", "Qualität & Sicherheit",
]);
assert.equal(architecture.label, "Architektur & Struktur");
assert.equal(paradigms.label, "Programmierparadigmen");
assert(architecture.rows.some(row => row.name === "Vertical Slices"));
assert(architecture.rows.some(row => row.name === "Featureorientierte Paketstruktur"));
assert(!architecture.rows.some(row => row.name === "Objektorientierung"));
assert(paradigms.rows.some(row => row.name === "Objektorientierung"));
assert(paradigms.rows.some(row => row.name === "Funktionale Programmierung"));
assert(!paradigms.rows.some(row => row.name === "Vertical Slices"));
const allRows = globalTopics.flatMap(topic => topic.rows);
assert.equal(allRows.length, 62);
assert.equal(new Set(allRows.map(row => row.name)).size, 62);
assert(globalTopics.find(topic => topic.id === "design").rows.some(row => row.name === "Komposition"));
assert(globalTopics.find(topic => topic.id === "persistence").rows.some(row => row.name === "Lokales SQL-Mapping"));
const { backendTopicForRow } = load(path.join(root, "app/backend-topics.ts"));
assert.equal(backendTopicForRow("BaseController / BaseService"), "design");
assert.equal(backendTopicForRow("Große Business-Lambdas"), "language");
console.log("Analysis loads with repository evidence; taxonomy, unique topics and score totals verified.");
