---
description: Bring one component up to the current compliance standard (tier, styling doc, tokens, tests, story, skill doc, snippet)
---

Migrate a single component to full compliance with the standard in CLAUDE.md (Development
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
  `legacy_props: false`, `story_args_bug: false`, `eslint_issues: false`): skip straight to
  reporting — state its ledger row (tier, score, and confirmation the four non-scored checks are
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
     setup-time — see checklist item 6a) — same tie-break. Also doesn't move the 5-point `score`,
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

Go through each point below. Skip a point only when it genuinely doesn't apply (state why,
briefly) — don't skip silently.

1. **Tier folder** — if the component lives outside `01.atoms`–`05.forms`, move it with `git mv`
   into the tier that fits (see `project_component_tiers` in memory for what each tier means).
   If none fits cleanly, ask the user rather than guessing.
2. **Props pattern** — confirm `interface Props` + `withDefaults(defineProps<Props>(), {...})`,
   not options-style `defineProps({...})`. Migrate if needed.
3. **CSS tokens** — audit every custom property in the component's `<style>` block against the
   corrected rule (consumer relevance, not reuse count):
   - A value a consumer could plausibly want to override — including a per-state variant like a
     hover-only width or a dark-theme colour — must be a **public** token (`--component-name-x`),
     consumed directly at its point of use, even if used only once.
   - A value with no plausible consumer relevance stays **private** (`--_x`), even if used only
     once — don't strip the prefix just because reuse is low.
   - Fix the actual bug class this catches: a consumer-relevant value that's currently private
     with no public fallback. That's the thing to promote, not every `--_` var you find.
4. **CONSUMER-STYLING.md** — create or update so every public token the component exposes is
   documented, with its default. Skip only if the component genuinely has no override surface at
   all (no CSS custom properties, no class passthrough).
5. **Tests** — create or bring up to date in `tests/`, following the Testing Requirements section
   (mountSuspended, fake-timer rules, etc.). Skip only for a trivial presentational component with
   no logic worth testing — say so explicitly if you skip.
6. **Storybook story** — create or update `stories/*.stories.ts` with controls for props/slots
   that warrant them (see `.claude/skills/storybook-add-story.md`).
6a. **Storybook Controls-panel reactivity** — check every story `Template`/`render` function in
    the component's `stories/*.stories.ts` files for this bug: `@storybook/vue3` mounts the story
    component **once** and, on every Controls-panel change, mutates the same reactive `args`
    object in place — it never re-runs `setup()`. A story that destructures or spreads `args` into
    local variables/a ref at setup-time (the tell-tale shape: `const { modelValue, ...otherArgs }
    = args;`, whether or not it's then fed into a `ref()`) takes a one-time snapshot, so most
    Controls silently stop updating the rendered story after first render — often alongside a
    prop-name typo in `argTypes` that compounds it (e.g. a control literally named differently
    from the real component prop it's meant to drive — check that too). Fix by binding the
    template directly to the live object (`v-model="args.modelValue"`, `v-bind="componentArgs"`
    where `componentArgs` is a `computed()` that strips only genuinely non-prop extra args) rather
    than copying values out in `setup()` — a destructure/spread from `args` is only safe when it's
    inside a `computed()`. The ledger's `story_args_bug` column flags this automatically (any
    `{...} = args;` spread not wrapped in a `computed()`); still eyeball each story file yourself,
    since a differently-shaped variant of the same mistake may not match that exact heuristic.
7. **Skill doc** — create or update `.claude/skills/components/<component-name>.md`. If the
   component still forks `variants/` files, fold each variant's behaviour into this doc as a
   "Variants" section per `feedback_variants_deprecated_as_own_skill_docs` — don't delete the
   variant files yourself without asking, since consumers may still import them directly; flag it
   to the user as a follow-up decision instead.
8. **VS Code snippet** — create or update `.vscode/srcdev-component-{name}.code-snippets`.
9. **Accessibility** — check for gaps beyond what already-passing tests would catch:
   - Interactive controls (buttons, toggles, custom form-like widgets) have an accessible name —
     visible text, `aria-label`, or `aria-labelledby`.
   - Keyboard behaviour matches what's actually implemented — no keydown case that only calls
     `event.preventDefault()` with a comment like "could add this later", and no screen-reader
     copy (visible or `sr-only`) that describes an interaction the component doesn't actually
     perform. Cross-check every claim in the copy against the handler that's supposed to back it.
   - Focus is visible (`:focus-visible`, not a suppressed outline) on anything focusable.
   - Live-updating or auto-advancing content (carousels, marquees, auto-dismissing toasts) has a
     way to pause it, per WCAG 2.2.2 — a visible control, or pause-on-hover/focus at minimum.
   - `prefers-reduced-motion` is respected for any animation that isn't purely decorative.
10. **Localisation (no hardcoded consumer-facing text)** — grep the template and script for
    user-visible string literals (button copy, `aria-label`/`aria-description` text, placeholder
    text, empty-state messages, etc.) that aren't already props. This library has no i18n
    framework dependency (see `MarqueeScroller`'s `playLabel`/`pauseLabel`/`ariaLabel`/
    `ariaDescription` for the pattern) — promote any hardcoded copy to a string prop with the
    existing English text as its default, so a consumer can pass translated strings from their own
    i18n solution. Icon-only controls should also get an icon-override prop or slot (see
    `playIcon`/`pauseIcon`/`toggle-icon`) alongside the label prop, not just the label.

## 4. Wrap up

- Run the relevant test file(s), `npx eslint <touched files>`, and `npx vue-tsc` (or the project's
  usual type-check command) to confirm nothing broke.
- Summarize what changed and what you deliberately skipped (with reasons).
- Don't stage, commit, or push — that's the user's call. Mention that running
  `/create-commit-message` next will trigger the Component Ledger refresh automatically via the
  existing hook, since this touches `app/components/`.
