// Inlines passthrough private tokens and deletes unused ones (see private-tokens.mjs).
// Usage: node .claude/component-ledger/fix-private-tokens.mjs [--write] [file.vue ...]
// Without --write it's a dry run. Without files it scans every .vue under app/components.
// Tokens reported as "REVIEW" are only touched with --include-review, after checking by hand that
// the element reading the token is inside the element declaring it.
import fs from "node:fs";
import path from "node:path";
import { findRedundantPrivateTokens, orphanPrivateReads } from "./private-tokens.mjs";

const args = process.argv.slice(2);
const write = args.includes("--write");
const includeReview = args.includes("--include-review");
let files = args.filter((a) => !a.startsWith("--"));

const all = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(vue|css|ts)$/.test(p) && !/\/tests\/|\.stories\.ts$/.test(p)) all.push(p);
  }
})("app");
const orphans = orphanPrivateReads(all.map((o) => fs.readFileSync(o, "utf8")));
if (!files.length) files = all.filter((f) => f.startsWith("app/components/") && f.endsWith(".vue"));

for (const f of files) {
  let src = fs.readFileSync(f, "utf8");
  const found = findRedundantPrivateTokens(src, orphans);
  if (!found.length) continue;
  console.log(`\n${f}`);
  const edits = [];
  for (const t of found) {
    const where = t.use ? ` (use in: ${t.use.chain.filter((p) => !p.startsWith("@layer")).join(" > ")})` : "";
    const declAt = t.decls.map((d) => d.chain.filter((p) => !p.startsWith("@layer")).join(" > ")).join(" | ");
    console.log(`  ${t.safe ? "fix   " : "REVIEW"} ${t.kind.padEnd(11)} ${t.name}  [decl: ${declAt}]${t.safe ? "" : where}`);
    if (!t.safe && !includeReview) continue;
    for (const d of t.decls) edits.push({ type: "delete", start: t.offset + d.start, end: t.offset + d.end });
    if (t.kind === "passthrough") {
      // Replace the whole read, including any fallback of its own: the token is always set, so
      // that fallback could never apply.
      const vStart = t.offset + t.use.start;
      const seg = src.slice(vStart, t.offset + t.use.end);
      const at = seg.search(new RegExp(`var\\(\\s*${t.name}\\s*[,)]`));
      let depth = 0;
      let end = at;
      for (; end < seg.length; end++) {
        if (seg[end] === "(") depth++;
        else if (seg[end] === ")" && --depth === 0) break;
      }
      edits.push({ type: "replace", start: vStart + at, end: vStart + end + 1, text: t.value });
    }
  }
  if (!write || !edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  for (const e of edits) {
    if (e.type === "replace") src = src.slice(0, e.start) + e.text + src.slice(e.end);
    else {
      const lineStart = src.lastIndexOf("\n", e.start - 1);
      const lineEnd = src.indexOf("\n", e.end);
      const onlyThis = !src.slice(lineStart + 1, e.start).trim() && !src.slice(e.end, lineEnd).trim();
      src = onlyThis ? src.slice(0, lineStart) + src.slice(lineEnd) : src.slice(0, e.start) + src.slice(e.end);
    }
  }
  src = src.replace(/(\{\n)(?:[ \t]*\n)+/g, "$1").replace(/\n(?:[ \t]*\n){2,}/g, "\n\n");
  fs.writeFileSync(f, src);
}
