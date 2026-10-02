---
description: Bring one component up to the current compliance standard (tier, styling doc, tokens, tests, story, skill doc, snippet)
---

Migrate a single existing component to full compliance with the standard in
`.claude/skills/component-compliance-checklist.md` and CLAUDE.md (Development
Workflow, Styling Methodology, Vue Template Conventions) — see also `project_component_compliance_standard`
and `feedback_private_token_convention_clarified` in memory for the token rule specifically.

## 1. Pick the component

If the user gave an argument (a component name or path — e.g. `/migrate-component input-copy`),
resolve it against `app/components/` (match on folder name or `.vue` filename, case-insensitively).
If it doesn't resolve uniquely, ask which one they meant.

**Check before you migrate.** Whenever a component was named explicitly — or the user's wording is
a status question ("is X done?", "check X", "does X still need work?") rather than an instruction
to migrate — run `node .claude/component-ledger/build.mjs` and look up that component's row in
`.claude/component-ledger/audit.json` first:

- **Already fully compliant** (`score: 5`, placed in a real tier, `variants: false`,
  `legacy_props: false`, `story_args_bug: false`, `eslint_issues: false`,
  `redundant_priv_tokens: false`, `styling_doc_outdated: false`): skip straight to
  reporting — state its ledger row (tier, score, and confirmation the six non-scored checks are
  also clean) and stop. Don't run step 2's `AskUserQuestion` or the step 3 checklist for a
  component that already passes every check; that flow is for when there's actual work to decide
  about.
- **Not fully compliant, or the user asked to migrate/fix it outright** (not just check): proceed
  to step 2 as normal.

Otherwise, auto-pick the next worst offender:

1. Run `node .claude/component-ledger/build.mjs` to refresh the audit data.
2. Read `.claude/component-ledger/audit.json`. Pick in this priority order, first match wins:
   - Any group with `"tier": "NONE"` (unplaced) — pick the one with the lowest `score`, ties broken alphabetically by `compdir`.
   - Else any group with `"variants": true` — same tie-break.
   - Else any group with `"legacy_props": true` (still options-style `defineProps({...})`, not
     `defineProps<Props>()`) — same tie-break. This one doesn't move the 5-point `score`, so it
     would otherwise hide forever behind an already-complete-looking component.
   - Else any group with `"story_args_bug": true` (a story destructures/refs Storybook's `args` at
     setup-time — see compliance checklist item 6a) — same tie-break. Also doesn't move the 5-point `score`,
     for the same reason as `legacy_props`.
   - Else any group with `"eslint_issues": true` (`npx eslint` reports at least one error or
     warning on a `.vue` file in the group) — same tie-break. Also doesn't move the 5-point
     `score`, for the same reason as `legacy_props`/`story_args_bug`. Run
     `npx eslint <files in the group>` to see the actual finding(s) before deciding the fix — don't
     guess. A common one: `const props = withDefaults(defineProps<Props>(), {...})` where nothing
     ever reads `.props` because the template uses Vue's automatic prop-shorthand binding
     (`:id`, `:name`, etc. resolve directly, no destructuring needed) — fix by dropping the
     `props =` assignment, not by inventing a use for it. Another common one on this specific
     ruleset: `vue/require-default-prop` firing on a `defineModel()`-declared prop — this is a
     known false positive (the rule predates `defineModel` and has no way to exempt model props);
     the fix is `defineModel<T>({ required: true })` where the native element genuinely can't be
     meaningfully empty (see `InputRangeCore`/`InputRangeDefault`), not a blanket rule disable and
     not an artificial default value that would change real behaviour.
   - Else any group with `"redundant_priv_tokens": true` (a `--_` token that's declared but never
     read, or is a single-use 1:1 copy of a public token — see compliance checklist item 3) — same tie-break.
     Also doesn't move the 5-point `score`. Run
     `node .claude/component-ledger/fix-private-tokens.mjs <file.vue>` for the list.
   - Else any group with `"styling_doc_outdated": true` (its `CONSUMER-STYLING.md` exists but has
     no `## Local overrides` section, so it predates the fixed layout in compliance checklist item 4) — same
     tie-break. Also doesn't move the 5-point `score`. Usually a doc-only pass: restructure the
     existing doc to the layout, checking the rest of the checklist as normal while you're there.
   - Else the lowest `score` overall — same tie-break.
3. State which component was picked and why in one line (e.g. "Picked `input-select` — unplaced isn't the issue here, it forks a `variants/` subfolder and scores 2/5.") before doing anything else, so the user can redirect you if they'd rather do a different one next.

## 2. Confirm it's still wanted

Before starting the checklist, confirm with the user that this component should actually be
migrated — a low score isn't proof it's still needed. Use AskUserQuestion with these options:

- **Migrate it** (recommended default) — proceed to step 3.
- **Leave it untouched** — skip it this run. If it was auto-picked, say so and go back to step 1
  to pick the next worst offender instead; if the user named it explicitly, just stop.
- **Delete it** — it's unused, superseded by another component, or otherwise no longer wanted.
  Run the `check-component-usage` skill against the component's name first, across every consumer
  repo, and report the results before deleting anything. A clean scan is good evidence, not proof
  (see the skill's own caveat on dynamic `:is` usage etc.) — if it finds a real consumer, surface
  that back to the user with an `AskUserQuestion` rather than auto-aborting or auto-proceeding;
  the user may still want it deleted (e.g. the consumer repo is itself defunct or being retired).
  Once confirmed, delete the component file(s) and every trace this command would otherwise have
  created or touched for it — tests, stories, `CONSUMER-STYLING.md`, skill doc, VS Code snippet,
  any `.claude/skills/index.md` entry, and any direct references elsewhere in the repo (e.g. a
  `MIGRATION.md` row) — then skip the rest of this command for that component.

## 3. Work the checklist

Work through every item in `.claude/skills/component-compliance-checklist.md`, including the
notes marked **Existing component** (tier move, `variants/` flattening, suffix rename). Read the
file each run rather than working from memory; it is shared with `/new-component` and gets new
items. Skip an item only when it genuinely doesn't apply, and say why briefly.

## 4. Wrap up

- Run the relevant test file(s), `npx eslint <touched files>`, and `npx vue-tsc` (or the project's
  usual type-check command) to confirm nothing broke.
- If you renamed, added or removed any component `.vue` file (compliance checklist item 13, a flattened
  `variants/` folder, a new wrapper), run `npm run prepare` to regenerate `.nuxt/components.d.ts`
  and tell the user to restart Storybook. A running Storybook keeps its startup component scan, so
  a renamed component silently renders as an empty unknown element there, while Vitest (fresh Nuxt
  each run) still passes.
- Summarize what changed and what you deliberately skipped (with reasons).
- Don't stage, commit, or push — that's the user's call. Mention that running
  `/create-commit-message` next will trigger the Component Ledger refresh automatically via the
  existing hook, since this touches `app/components/`.
