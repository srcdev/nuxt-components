// Finds redundant private (`--_`) CSS tokens in a .vue file (pitfall #20, second half):
//   - "unused":      declared but never read anywhere in the file.
//   - "passthrough": declared once, its whole value is a single `var(--public-token, ...)`, and
//                    it's read exactly once — a 1:1 copy of an existing public token with no
//                    composition or state swap behind it. Inline the public token instead.
// A passthrough is `safe` to inline mechanically when it's declared on the component's root rule
// (no state/media/variant selector in the chain) and read in that rule or a descendant of it.
// Anything else is reported with `safe: false` for a manual look.
// Used by build.mjs (ledger column) and fix-private-tokens.mjs (the mechanical fix).

export function parseStyle(css) {
  const decls = [];
  const stack = [];
  let buf = "";
  let bufStart = 0;
  let depth = 0;
  let quote = null;
  const flush = (end) => {
    const text = buf;
    const m = text.match(/^(\s*)(--[\w-]+)\s*:\s*([\s\S]*?)\s*$/);
    if (m) {
      decls.push({
        prop: m[2],
        value: m[3],
        chain: stack.slice(),
        start: bufStart + m[1].length,
        end,
      });
    } else {
      const d = text.match(/^\s*[\w-]+\s*:\s*([\s\S]*?)\s*$/);
      if (d) decls.push({ prop: null, value: d[1], chain: stack.slice(), start: bufStart, end });
    }
  };
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === quote && css[i - 1] !== "\\") quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "/" && css[i + 1] === "*") {
      const close = css.indexOf("*/", i + 2);
      const end = close === -1 ? css.length : close + 2;
      if (!buf.trim()) {
        buf = "";
        bufStart = end;
      } else buf += " ".repeat(end - i);
      i = end - 1;
      continue;
    } else if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (depth === 0 && c === "{") {
      stack.push(buf.trim());
      buf = "";
      bufStart = i + 1;
      continue;
    } else if (depth === 0 && (c === ";" || c === "}")) {
      if (buf.trim()) flush(c === ";" ? i + 1 : i);
      if (c === "}") stack.pop();
      buf = "";
      bufStart = i + 1;
      continue;
    }
    buf += c;
  }
  return decls;
}

const isRootChain = (chain) => {
  const sel = chain.filter((p) => !p.startsWith("@layer"));
  return sel.length === 1 && /^\.[\w-]+$/.test(sel[0]);
};

const isSingleVar = (value) => {
  if (!/^var\(--(?!_)/.test(value)) return false;
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "(") depth++;
    else if (value[i] === ")" && --depth === 0) return i === value.length - 1;
  }
  return false;
};

// Names read (`var(--_x`) in a file that never declares them: a parent sets them for a child
// component to read, so they're skipped wherever they're declared.
export function orphanPrivateReads(sources) {
  const orphans = new Set();
  for (const src of sources) {
    const declared = new Set([...src.matchAll(/(--_[\w-]+)\s*:/g)].map((x) => x[1]));
    for (const r of src.matchAll(/var\(\s*(--_[\w-]+)/g)) if (!declared.has(r[1])) orphans.add(r[1]);
  }
  return orphans;
}

export function findRedundantPrivateTokens(source, orphanReads = new Set()) {
  const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
  const outsideStyle = source.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");
  const results = [];
  for (const s of styles) {
    const css = s[1];
    const offset = s.index + s[0].indexOf(css);
    const decls = parseStyle(css);
    const privDecls = decls.filter((d) => d.prop?.startsWith("--_"));
    const names = [...new Set(privDecls.map((d) => d.prop))];
    for (const name of names) {
      const own = privDecls.filter((d) => d.prop === name);
      const useRe = new RegExp(`var\\(\\s*${name}\\s*[,)]`, "g");
      const uses = decls.filter((d) => useRe.test(d.value) && ((useRe.lastIndex = 0), true));
      const useCount = decls.reduce((n, d) => n + (d.value.match(useRe) || []).length, 0);
      if (new RegExp(`${name}(?![\\w-])`).test(outsideStyle) || orphanReads.has(name)) continue;
      if (useCount === 0) {
        results.push({ name, kind: "unused", safe: true, decls: own, offset });
        continue;
      }
      if (own.length !== 1 || useCount !== 1 || !isSingleVar(own[0].value)) continue;
      const decl = own[0];
      const use = uses[0];
      const safe =
        isRootChain(decl.chain) &&
        use.chain.length >= decl.chain.length &&
        decl.chain.every((p, i) => use.chain[i] === p);
      results.push({ name, kind: "passthrough", safe, decls: own, use, value: decl.value, offset });
    }
  }
  return results;
}
