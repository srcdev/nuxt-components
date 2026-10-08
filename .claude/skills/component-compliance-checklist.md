# Component compliance checklist

The definition of done for every component in this library. It is shared by two commands:

- `/new-component` uses it as the build spec for a component that doesn't exist yet.
- `/migrate-component` uses it to bring an existing component up to standard.

Item numbers are stable and are referenced elsewhere ("checklist item 4", the ledger columns, memory
notes), so add new items at the end rather than renumbering.

Go through every item. Skip one only when it genuinely doesn't apply, and say why briefly; don't
skip silently. Notes marked **Existing component** only apply when migrating.

A component passes when its Component Ledger row (`node .claude/component-ledger/build.mjs`, then
`.claude/component-ledger/audit.json`) shows `score: 5`, a real tier, and `variants`, `legacy_props`,
`story_args_bug`, `eslint_issues`, `redundant_priv_tokens`, `styling_doc_outdated` and `missing_stress_story`
all `false`.
The ledger can't see items 9, 10, 11 and 14, so check those by hand.

## The checklist

1. **Tier folder** — the component lives in one of `01.atoms`–`05.forms` (see
   `project_component_tiers` in memory for what each tier means), in its own kebab-case folder:
   `app/components/<tier>/<family>/`. If none fits cleanly, ask the user rather than guessing.
   **Existing component:** if it lives outside a tier, move it with `git mv`.
2. **Props pattern** — `interface Props` + `withDefaults(defineProps<Props>(), {...})`, never
   options-style `defineProps({...})`. Include `styleClassPassthrough` and wire it through
   `useStyleClassPassthrough()`. Consumer-facing data-shape types go in
   `app/types/components/<component-name>.d.ts` and are exported from `app/types/components/index.ts`
   (see `component-export-types.md`), not left inline in the `.vue` file.
3. **CSS tokens** — audit every custom property in the component's `<style>` block against the
   rule in CLAUDE.md's "Public token pattern" (consumer relevance, not reuse count):
   - A value a consumer could plausibly want to override — including a per-state variant like a
     hover-only width or a dark-theme colour — must be a **public** token (`--component-name-x`),
     consumed directly at its point of use, even if used only once.
   - A value with no plausible consumer relevance stays **private** (`--_x`), even if used only
     once — don't strip the prefix just because reuse is low.
   - Fix the actual bug class this catches: a consumer-relevant value that's currently private
     with no public fallback. That's the thing to promote, not every `--_` var you find.
   - Remove redundant private tokens (the other half of pitfall #20): a `--_` token declared but
     never read, or one whose whole value is a single `var(--public-token, fallback)` and which is
     read exactly once, is pure duplication. Delete the unread ones; inline the public token at
     the single point of use for the rest. Keep a private token that's read in more than one
     place, is composed (`calc()`, `v-bind()`, several `var()`s), or is re-declared by a
     state/variant selector. `node .claude/component-ledger/fix-private-tokens.mjs <file.vue>`
     lists them (dry run); `--write` applies the ones marked `fix`. A `REVIEW` item is declared
     somewhere other than the root rule or read outside its subtree: check the element that
     reads it sits inside the one that declares it before adding `--include-review`, or fix it by
     hand. Afterwards, update any CONSUMER-STYLING.md or skill doc line that names the removed
     tokens, and delete comments left describing them.
   - Colours default from `--theme-*` tokens through the component's own public tokens, never by
     reading a global `--theme-*` token bare at the point of use (pitfall #14). Pair a dark/bold
     surface with `--theme-on-surface`, not `--theme-text` (pitfall #13). For a card or panel
     background default to `--theme-surface-subtle` (the surface `--theme-text` sits on);
     `--theme-surface` and `--theme-border` are bold steps meant for buttons and focus, and make a
     card a solid block of theme colour.
   - Style rules sit in `@layer components`, with child selectors nested inside the root block
     using native nesting (`& .block__child`), never Sass `&__child` concatenation
     (`css-nesting-conventions.md`).
4. **CONSUMER-STYLING.md** — create or update so every public token the component exposes is
   documented, with its default. Skip only if the component genuinely has no override surface at
   all (no CSS custom properties, no class passthrough). Use this fixed layout, in this order:
   - `## Public token API` — token tables (split into `###` groups by element when there are
     several), each token with its default; list any private `--_` tokens as "not public API", or
     say there are none.
   - `## State hooks` — `data-*` attributes / state selectors and the inner element class names.
     Omit only if the component has neither.
   - Component-specific reference sections (motion, sizing model, etc.) may follow here.
   - `## Global theming` — optional. Include a `:where(html) { ... }` block only when there's
     something worth showing (e.g. a common site-wide tweak); don't pad it out.
   - `## Local overrides` — required heading (the ledger's `styling_doc_outdated` check looks for
     it). The mechanics are the same for every component and live in
     `.claude/skills/component-local-style-override.md`, so don't write bespoke examples by
     default. Write one standard paragraph (copy it from any migrated doc, e.g.
     `05.forms/form-field/CONSUMER-STYLING.md`): set tokens on an element you own (page/section
     class, or a `:style-class-passthrough` class, or a plain `class` that falls through when there's
     no passthrough prop); keep the block unlayered; from a **consumer's** `<style scoped>` file,
     tokens on their own element still work but selectors reaching inside need `:deep()` (this
     library's own styles are never scoped); link the guide. Then add a **Caveat** only where this
     component breaks that model, most often a token it re-declares on its own elements (so an
     ancestor value never lands, e.g. `DisplayThemeSwitch`'s sizing tokens, `ServiceSummary`'s
     `--display-pill-*`, `InputError`'s `data-theme`), or a wrapper that doesn't forward
     passthrough. Check with a grep for `^\s*--<name>-[\w-]+\s*:` in the component's `<style>`.
     Existing examples can stay as `###` subsections (`Page or section`, `One instance`).
   - `## Recipe: <name>` — optional, for component-specific patterns that need several tokens
     working together (e.g. InputDescription's panel/callout).
   - `## Class passthrough` — what `style-class-passthrough` targets and whether it's actually
     reachable in normal use.
   - `## Notes` — optional, last.

   Dated "Changed YYYY-MM-DD" migration notes go as blockquotes inside the relevant section.
5. **Tests** — create or bring up to date in `tests/`, following the Testing Requirements section
   of CLAUDE.md (mountSuspended, fake-timer rules, etc.). Skip only for a trivial presentational
   component with no logic worth testing — say so explicitly if you skip. If anything is derived
   from slots, test it by toggling a `v-if`'d slot in a host component after mount (pitfall #25).
6. **Storybook story** — create or update `stories/*.stories.ts` with controls for props/slots
   that warrant them (see `.claude/skills/storybook-add-story.md`). The story title uses the tier
   name directly. A component whose layout responds to its container gets the `CanvasSwitcher`
   decorator (see `PageRow.stories.ts` or `GoogleReviews.stories.ts`, which also shows a per-story
   starting canvas via `parameters.initialCanvas`) rather than a hand-sized wrapper or a width arg.
   If other components render this one inside them (it's a child or building block of theirs),
   each story gets a short note that explains the relationship and links to the parent's story
   (`storybook-add-story.md`, "Link to the stories of components that use this one").
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
6b. **Stress-test story** — add a `StressTest` story ("Stress Test (Worst-Case Data)") that
    feeds the component the most hostile data a QA tester could think of, and fix whatever it
    breaks. Go through every prop, slot and data field and ask what would break it, for example:
    - very long text, and long **unbroken** strings (no spaces, a long URL) in every text field,
      including labels and copy props (long translated copy, e.g. German)
    - empty strings, missing optional fields, a single character, a single item, the maximum
      number of items
    - emoji (including at the start of anything that takes initials or first letters), HTML-like
      text (must render as text), right-to-left text
    - out-of-range or odd numbers (0, negative, above the maximum, fractional, very large)
    - broken image or link URLs
    Describe what to check in the story's docs description, and look at it at every
    `CanvasSwitcher` width. Fixes usually mean `overflow-wrap: anywhere`, `min-inline-size: 0` on
    flex/grid children, `Array.from(str)` instead of `str[0]`, and `clamp()` on values
    derived from data. Give each text element a consumer might want to shorten (names, titles,
    descriptions, body text) a line-clamp token, `--<component>-<element>-line-clamp`, which
    covers ellipsis too (`1` is single-line ellipsis). Default it to `none` unless the layout
    clearly needs a cap, and never clamp text that must stay readable (legal or attribution text,
    link text that names its destination). Shape and rules: `theming-component-token-pattern.md`,
    "Line-clamp tokens". Give each line-clamp token a Controls-panel select in the stories (set on
    a wrapper `:style`, stripped from the component's args), labelled as a story-only CSS token so
    nobody mistakes it for a prop: `storybook-add-story.md`, "Label token controls as story-only".
    Add a unit test for any logic fix. A component that takes no data or copy
    (e.g. a pure layout wrapper) still gets one with oversized slot content.
7. **Skill doc** — create or update `.claude/skills/components/<component-name>.md`, following the
   pattern of an existing one. A labelled `<Name>Field` wrapper (or any other wrapper) is documented
   in its control's doc under a "Variants" section, not in a doc of its own
   (`feedback_variants_deprecated_as_own_skill_docs`). **Existing component:** if you find a
   `variants/` subfolder, flatten it into the parent folder (`git mv` the `.vue` files plus their
   stories/tests up one level, fix relative imports); `pathPrefix: false` keeps the auto-import
   names unchanged. All existing `variants/` folders were flattened 2026-09-25.
8. **VS Code snippet** — create or update `.vscode/srcdev-component-{family}.code-snippets`,
   covering the control and its Field wrapper in one file.
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
   - A component with a `tag` prop that can render a landmark uses `useAriaLabelledById`
     (`component-aria-landmark.md`), unless it falls back to `aria-label` when no heading is
     given: the composable can't do that and warns whenever a landmark has no heading. Then label
     it directly with `useId()` (`aria-labelledby` when the heading slot is filled, `aria-label`
     otherwise, both decided by a function called from the template, per pitfall #25), as
     `GoogleReviews` does.
10. **Localisation (no hardcoded consumer-facing text)** — grep the template and script for
    user-visible string literals (button copy, `aria-label`/`aria-description` text, placeholder
    text, empty-state messages, etc.) that aren't already props. This library has no i18n
    framework dependency (see `MarqueeScroller`'s `playLabel`/`pauseLabel`/`ariaLabel`/
    `ariaDescription` for the pattern) — promote any hardcoded copy to a string prop with the
    existing English text as its default, so a consumer can pass translated strings from their own
    i18n solution. Icon-only controls should also get an icon-override prop or slot (see
    `playIcon`/`pauseIcon`/`toggle-icon`) alongside the label prop, not just the label. Default
    copy follows the em dash ban for visitor-facing text.
11. **No `light-dark()` CSS function in the component's own values** — grep the `<style>` block
    (and any `v-bind()`-fed script constants) for `light-dark(`. Older iPads/Safari versions don't
    support it, so this library's own default values must never rely on it — use the existing
    `--theme-*` token convention (pitfall #14) where one already fits. Where none fits and you're
    replacing a literal `light-dark(light-value, dark-value)` call directly, keep the **light**
    value only — don't invent a dark-mode fallback scheme, and don't ask which of the two to keep.
    The mechanism stays available for consumers: a consumer app is free to define its own public
    token overrides using `light-dark()` inside its own CSS, since that's their own browser-support
    decision to make, not this library's default. The global token layer (`03.theming`, `a11y/_variables.css`) is light-only too since 2026-10-04, so `--theme-*` tokens are safe to consume.
12. **Add the component to the Migrated Fields Form story** — once the component reaches 5/5,
    add one field for it to
    `app/components/05.forms/patterns/stories/MigratedFieldsForm.stories.ts` (import the
    component, add a field to the demo form, wire minimal state/error handling matching the
    existing fields). This story is a living migration-progress tracker, not just a demo — its own
    top-of-file comment lists which components are currently included and must be updated too
    (add the new component to the list, bump the "As of `<date>`" note). Skip only if the
    component's shape genuinely doesn't fit a form field (anything outside `05.forms`, or a
    non-input `05.forms` helper component) — state why if you skip.
13. **Naming** — bare control `<Name>`, labelled wrapper `<Name>Field`, root DOM class following
    the name (`.input-number`, `.input-number-field`), per `.claude/skills/component-naming.md`.
    Multi-word, never a native or plausibly-future HTML element name, and not a bare common word
    a consuming app is likely to define itself (the Nuxt-layer collision caveat).
    **Existing component:** if it (or its wrappers) still uses a `Core`, `Default` or `WithLabel`
    suffix, rename it. The doc's backlog table gives the proposed name and which consumer repos
    use the old one. Rows marked **decide** (collision-prone generic names like `Card`/`Tabs`)
    need an `AskUserQuestion` before renaming. Follow the doc's rename procedure (including
    updating consumer repos) and tick the row off. Do this as the last checklist step, so the
    earlier steps' edits don't have to track a mid-flight rename.
14. **Known pitfalls** — check the component against the CLAUDE.md pitfalls that recur in new
    code (the ledger can't see any of these):
    - Every structural class name is prefixed with the component name (`.display-dialog-header`,
      not `.header`), since the component renders inside the consumer's DOM (pitfall #16).
    - A `position: fixed`/`sticky` overlay exposes a public z-index token defaulting to `999999`
      (pitfall #17).
    - No utility class from `06.utility-classes` in the component's own markup unless it's used
      for what that class actually means (pitfall #18, `mi-12`).
    - Nothing load-bearing relies on a CSS feature WebKit lacks (pitfall #19).
    - No `computed()` over `useSlots()`; use a function called from the template (pitfall #25).
    - Values derived from props are `computed()`, not plain consts frozen at mount.
    - Explicit closing tags (no self-closing non-void elements), hyphenated props in templates, no
      manual Vue imports in components.
    - `NuxtImg` gets explicit `width` and `height`; a `<video>` uses a `<source :src>` child with
      `:key` and `.load()` (pitfall #12).
    - No `#components` import (breaks Storybook); use `resolveComponent()`.
