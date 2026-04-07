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

─── Broken Access Control (OWASP A01) ───────────────────────────
□ `v-if` used as the sole gate for sensitive UI — this is cosmetic only, not a real access check
□ Route middleware (`definePageMeta({ middleware })`) that can be bypassed by navigating directly
□ Server routes or API handlers that trust `event.context.auth` / headers set by the client
□ Permissions or roles derived solely from client-side reactive state with no server validation

─── Cryptographic Failures (OWASP A02) ──────────────────────────
□ `Math.random()` used to generate tokens, IDs, or nonces (not cryptographically secure — use `crypto.randomUUID()` or `crypto.getRandomValues()`)
□ `btoa()` / `atob()` used to "encode" sensitive values (this is encoding, not encryption)
□ Sensitive values hashed with MD5 or SHA-1 (use SHA-256+ or bcrypt/argon2 for passwords)
□ Passwords or secrets stored in plain text in state, localStorage, or cookies

─── Security Misconfiguration (OWASP A05) ───────────────────────
□ `nuxt.config.ts` missing security headers (`Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`)
□ CORS configured with `origin: "*"` on routes that return sensitive data
□ Verbose error messages or stack traces returned to the client from server routes
□ `devtools: true` or debug flags that could be active in production builds
□ `runtimeConfig` values that mix public/private — anything in `public:` is exposed to the client bundle

─── Authentication Failures (OWASP A07) ─────────────────────────
□ Auth tokens stored in `localStorage` or `sessionStorage` (vulnerable to XSS — prefer `httpOnly` cookies)
□ Auth state held only in client-side reactive state (`useState`, `ref`) with no server-side verification
□ JWTs decoded client-side without signature verification before trusting claims
□ Session IDs or tokens exposed in URL query parameters or `data-*` attributes
□ No expiry enforced on tokens or session state

─── Software & Data Integrity (OWASP A08) ───────────────────────
□ `JSON.parse()` called on untrusted/external data without a validation step (schema check or try/catch with type guard)
□ `Object.assign({}, userInput)` or `{ ...userInput }` spread onto internal objects — risk of prototype pollution if input is not sanitised
□ External `<script>` tags added via `useHead` without a `crossorigin` and `integrity` (SRI) attribute
□ Dynamic `import()` resolved from user-supplied strings (supply chain / path traversal risk)

─── Logging & Monitoring (OWASP A09) ────────────────────────────
□ `console.log` / `console.error` statements that output tokens, passwords, or PII
□ Error handlers that re-throw raw server errors (including DB messages) to the client response
□ Caught exceptions silently swallowed with no logging — makes incidents invisible

─── Server-Side Request Forgery (OWASP A10) ─────────────────────
□ `$fetch` / `useFetch` / `ofetch` called server-side with a URL constructed from user input (SSRF — attacker can target internal services)
□ Proxy or redirect endpoints that forward to a caller-supplied URL without an allowlist check
□ `useAsyncData` key derived from user input used to construct a server-side fetch URL

─── CSRF ────────────────────────────────────────────────────────
□ State-mutating server routes (POST/PUT/DELETE) that rely solely on cookies without a CSRF token or `SameSite=Strict`
□ Forms that submit to API routes with no CSRF protection and no `Content-Type: application/json` enforcement (which prevents simple-form cross-origin attacks)

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
