// Regenerates .claude/component-ledger/audit.json (raw data) and output.html (ready to
// publish as the Component Ledger artifact) from the current state of the repo.
//
// Run from the repo root: node .claude/component-ledger/build.mjs
//
// Checked against the standard in memory (project_component_compliance_standard.md) and
// CLAUDE.md's Development Workflow / Styling Methodology sections.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../.."); // repo root
const componentsRoot = path.join(root, "app/components");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".vue")) out.push(full);
  }
  return out;
}

const vueFiles = walk(componentsRoot).filter(
  (f) => !f.split(path.sep).includes("tests") && !f.split(path.sep).includes("stories")
);

function toKebab(name) {
  return name.replace(/(?<!^)(?=[A-Z])/g, "-").toLowerCase();
}

const skillsDir = path.join(root, ".claude/skills/components");
const skills = new Set(
  fs.existsSync(skillsDir)
    ? fs.readdirSync(skillsDir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3))
    : []
);
const vscodeDir = path.join(root, ".vscode");
const snippets = fs.existsSync(vscodeDir)
  ? fs.readdirSync(vscodeDir).filter((f) => f.endsWith(".code-snippets"))
  : [];

const groups = new Map();
for (const vf of vueFiles) {
  const d = path.dirname(vf);
  const base = path.basename(d);
  const compdir = base === "variants" ? path.dirname(d) : d;
  if (!groups.has(compdir)) groups.set(compdir, []);
  groups.get(compdir).push(vf);
}

const rows = [];
for (const [compdir, files] of [...groups.entries()].sort()) {
  const relDir = path.relative(componentsRoot, compdir);
  const tierMatch = compdir.match(/app\/components\/(0\d\.\w+)\//);
  const tier = tierMatch ? tierMatch[1] : "NONE";
  const hasConsumerStyling = fs.existsSync(path.join(compdir, "CONSUMER-STYLING.md"));
  const hasTests =
    fs.existsSync(path.join(compdir, "tests")) && fs.statSync(path.join(compdir, "tests")).isDirectory();
  const hasStoriesDir =
    fs.existsSync(path.join(compdir, "stories")) && fs.statSync(path.join(compdir, "stories")).isDirectory();
  const hasStoriesFile = fs.readdirSync(compdir).some((f) => f.endsWith(".stories.ts"));
  const vueNames = files.map((f) => toKebab(path.basename(f, ".vue")));
  const kebabDir = path.basename(compdir);
  const skillHit = skills.has(kebabDir) || vueNames.some((v) => skills.has(v));
  const snippetHit = snippets.some((s) => s.includes(kebabDir) || vueNames.some((v) => s.includes(v)));
  let privCount = 0;
  for (const f of files) {
    const content = fs.readFileSync(f, "utf-8");
    const m = content.match(/--_[\w-]+/g);
    privCount += m ? new Set(m).size : 0;
  }
  const hasVariants = files.some((f) => path.basename(path.dirname(f)) === "variants");
  // Legacy options-style props: `defineProps({ ... })` rather than `defineProps<Props>(...)`.
  // A plain regex on `defineProps<` is enough to clear a file — anything calling defineProps
  // without that generic is assumed options-style.
  const hasLegacyProps = files.some((f) => {
    const content = fs.readFileSync(f, "utf-8");
    return /defineProps\s*\(/.test(content) && !/defineProps\s*<.+?>\s*\(/s.test(content);
  });
  rows.push({
    compdir: relDir,
    tier,
    n_vue: files.length,
    variants: hasVariants,
    legacy_props: hasLegacyProps,
    consumer_styling: hasConsumerStyling,
    tests: hasTests,
    stories: hasStoriesDir || hasStoriesFile,
    skill: skillHit,
    snippet: snippetHit,
    priv_tokens: privCount,
  });
}

rows.forEach((d) => {
  d.score = ["consumer_styling", "tests", "stories", "skill", "snippet"].filter((k) => d[k]).length;
});

const auditedAt = new Date().toISOString().slice(0, 10);
const payload = { auditedAt, rows };

fs.writeFileSync(path.join(here, "audit.json"), JSON.stringify(payload));

const template = fs.readFileSync(path.join(here, "template.html"), "utf-8");
const output = template.replace("__PAYLOAD__", JSON.stringify(payload));
fs.writeFileSync(path.join(here, "output.html"), output);

console.log(`Component Ledger rebuilt: ${rows.length} groups, ${rows.reduce((s, d) => s + d.n_vue, 0)} .vue files.`);
console.log(`Output: ${path.join(here, "output.html")}`);
