# Performance Review

## Overview

Spawn a subagent to inspect recently written or modified code for performance issues and report findings back before handoff to dev. Run this after code is written and ready for review.

## When to invoke

Invoke this skill (`/performance-review`) after completing any of:
- A new component
- A significant edit to an existing component
- A new composable
- A test file that exercises heavy setup

## Steps

### 1. Identify files to review

Collect the list of files changed in this conversation. If unclear, run `git diff --name-only HEAD` to get recently modified files.

### 2. Spawn the performance review subagent

Use the Agent tool with `subagent_type: "general-purpose"` and the following prompt, substituting `{FILE_LIST}` with the actual file paths:

---

**Subagent prompt template:**

```
You are a Vue 3 / Nuxt performance reviewer. Inspect the following files for performance issues and produce a concise report.

Files to review:
{FILE_LIST}

Read each file in full, then check for the following issues. Report only issues that are actually present — do not flag hypothetical problems.

─── Vue / Nuxt Reactivity ───────────────────────────────────────
□ Expensive operations inside computed properties (should be pure/cheap)
□ `watch` with no `{ immediate }` where it could cause double-execution on mount
□ Large objects stored in `ref()` where `shallowRef()` would suffice
□ Reactive state that is never mutated (should be a plain const)
□ Missing `watchEffect` cleanup / `onUnmounted` teardown for subscriptions or timers

─── Template Rendering ──────────────────────────────────────────
□ `v-for` without a stable `:key` (or using array index as key on mutable lists)
□ Heavy inline expressions in templates (should be computed properties)
□ `v-if` + `v-for` on the same element (use a wrapping element or computed filter)
□ Components mounted unconditionally that could be `v-if`-deferred until needed
□ Missing `v-once` on truly static subtrees
□ Transitions on elements that trigger layout (width/height) rather than transform/opacity

─── CSS / Styling ───────────────────────────────────────────────
□ CSS custom properties defined but never consumed (dead tokens)
□ Expensive selectors: deep descendant chains, universal selectors inside scoped blocks
□ `transition: all` (transitions every property — prefer explicit property list)
□ Animations that animate layout properties (top/left/width/height) instead of transform
□ `v-bind()` in CSS used for values that never change (should be a static custom property)

─── Images / Assets ─────────────────────────────────────────────
□ `NuxtImg` without explicit `width` and `height` (causes layout shift + Vercel width fallback)
□ Images without `loading="lazy"` where above-the-fold loading is not required
□ First image in a list-rendered component missing `fetchpriority="high"` (LCP candidate — see `performance-lcp-image-priority.md`)
□ Large inline SVGs that could be icon components

─── Bundle / Imports ────────────────────────────────────────────
□ Manual imports of Vue internals (`ref`, `computed`, etc.) — these are auto-imported in Nuxt
□ Entire libraries imported where only specific named exports are needed
□ Unused imports left in the file

─── Data & Logic ────────────────────────────────────────────────
□ Large static data arrays defined inside `<script setup>` (re-created on every HMR — move outside the component or to a separate module)
□ Nested loops or O(n²) logic in computed properties or render functions
□ Repeated `.find()` / `.filter()` calls on the same array within a single render — consolidate into one computed
□ `setTimeout` / `setInterval` not cleared in `onUnmounted`

─── Report format ───────────────────────────────────────────────
For each issue found, output:

**File:** `path/to/file.vue` (line N)
**Issue:** One-sentence description of the problem
**Impact:** Low / Medium / High
**Fix:** Concrete code change or approach to resolve it

Group findings by file. If no issues are found in a file, skip it.
End the report with a one-line summary: total issues found, breakdown by impact level.
```

---

### 3. Review the report

Read the subagent's findings. For each **High** or **Medium** impact issue:
- Apply the fix immediately if it is straightforward and does not change behaviour
- Flag it to the user with the suggested fix if it requires a design decision

For **Low** impact issues, present them as a list for the user to decide on.

### 4. Confirm completion

After applying any fixes, re-run the subagent on the modified files to confirm no new issues were introduced.

## Notes

- This skill is read-only when used via the subagent — it does not edit files directly. Edits are made by the main agent after reviewing the report.
- Focus on issues that are actually present in the code — do not pre-emptively flag patterns that might become a problem.
- The subagent uses `subagent_type: "general-purpose"` so it has access to all tools (Read, Grep, Glob) needed to inspect the files.
