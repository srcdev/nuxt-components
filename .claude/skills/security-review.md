# Security Review

## Overview

Spawn a subagent to inspect recently written or modified code for security issues and report findings back before handoff to dev. Run this after code is written and ready for review.

## When to invoke

Invoke this skill (`/security-review`) after completing any of:
- A new component that accepts user input or renders external data
- A significant edit to an existing component
- A new composable that handles URLs, tokens, or external data
- Any code that constructs URLs, HTML, or interacts with browser APIs

## Steps

### 1. Identify files to review

Collect the list of files changed in this conversation. If unclear, run `git diff --name-only HEAD` to get recently modified files.

### 2. Spawn the security review subagent

Use the Agent tool with `subagent_type: "general-purpose"` and the following prompt, substituting `{FILE_LIST}` with the actual file paths:

---

**Subagent prompt template:**

```
You are a Vue 3 / Nuxt security reviewer. Inspect the following files for security vulnerabilities and produce a concise report.

Files to review:
{FILE_LIST}

Read each file in full, then check for the following issues. Report only issues that are actually present — do not flag hypothetical problems.

─── XSS / Injection ─────────────────────────────────────────────
□ `v-html` used with any non-static string (potential XSS — must be sanitised before use)
□ Template literals passed to `v-html` or `innerHTML`
□ User-controlled data rendered without escaping
□ `eval()`, `new Function()`, or `setTimeout(string)` usage

─── URL / Redirect Safety ───────────────────────────────────────
□ `href` or `src` built from user-supplied data without validation (open redirect / javascript: injection)
□ Dynamic `<script src>` or `<link href>` construction
□ `window.location` assignment from unvalidated input

─── Data Exposure ───────────────────────────────────────────────
□ Secrets, API keys, or tokens hardcoded or logged to console
□ Sensitive data stored in `localStorage` / `sessionStorage` without encryption
□ `useRuntimeConfig()` public keys that expose values that should be private (server-only)
□ Props or emits that inadvertently expose internal state to the DOM (e.g. `data-*` attributes)

─── Component / Props ───────────────────────────────────────────
□ `inheritAttrs: true` on components that accept `href` / `src` — an attacker can pass arbitrary attributes through
□ Props that accept raw HTML strings without a sanitisation step
□ Dynamic `is` prop on `<component>` bound to user-controlled data (component injection)

─── Event Handling ──────────────────────────────────────────────
□ `@click.native` or direct DOM event listeners on user-supplied elements
□ `postMessage` handlers without origin validation
□ Clipboard API writes of unvalidated data

─── Dependencies / Imports ──────────────────────────────────────
□ Dynamic `import()` paths constructed from user input
□ Imports from non-registry URLs (e.g. raw GitHub, CDN) rather than npm packages

─── Nuxt-specific ───────────────────────────────────────────────
□ Server routes or API handlers that trust client-sent data without validation
□ `useFetch` / `$fetch` URLs built from user input without sanitisation
□ `definePageMeta` `middleware` bypassed by conditional rendering
□ SSR hydration mismatches caused by client-only globals accessed during render

─── Report format ───────────────────────────────────────────────
For each issue found, output:

**File:** `path/to/file.vue` (line N)
**Issue:** One-sentence description of the vulnerability
**Severity:** Low / Medium / High / Critical
**Fix:** Concrete code change or approach to resolve it

Group findings by file. If no issues are found in a file, skip it.
End the report with a one-line summary: total issues found, breakdown by severity.
```

---

### 3. Review the report

Read the subagent's findings. For each **Critical** or **High** severity issue:
- Apply the fix immediately if it is clear-cut and does not change behaviour
- Flag it to the user with the suggested fix if it requires a design decision

For **Medium** and **Low** severity issues, present them as a list for the user to decide on.

### 4. Confirm completion

After applying any fixes, re-run the subagent on the modified files to confirm no new issues were introduced.

## Notes

- This skill is read-only when used via the subagent — it does not edit files directly. Edits are made by the main agent after reviewing the report.
- Report only issues that are actually present in the code — do not flag theoretical future vulnerabilities.
- The subagent uses `subagent_type: "general-purpose"` so it has access to all tools (Read, Grep, Glob) needed to inspect the files.
- Run alongside `/performance-review` — both can be spawned in parallel as independent subagents.
