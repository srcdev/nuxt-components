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
The ledger can't see items 6c, 9, 10, 11 and 14, so check those by hand.

## The checklist

1. **Tier folder** — the component lives in one of `01.atoms`–`05.forms` (see
   `project_component_tiers` in memory for what each tier means), in its own kebab-case folder:
   `app/components/<tier>/<family>/`. If none fits cleanly, ask the user rather than guessing.
   **Existing component:** if it lives outside a tier, move it with `git mv`.
2. **Props pattern** — `interface Props` + `withDefaults(defineProps<Props>(), {...})`, never
   options-style `defineProps({...})`. Include `styleClassPassthrough` and wire it through
   `useStyleClassPassthrough()`, with a `watch` that calls `resetElementClasses` so it reacts to prop
   changes. A Field wrapper applies its passthrough to its own root only: forwarding the same prop
   to the inner control as well puts one consumer class on two elements (`InputNumberField`,
   `InputRangeField`, fixed 2026-10-16). Consumer-facing data-shape types go in
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
   Sample copy in stories, and examples in the skill doc, use placeholders (a name like "Alex
   Morgan", a town like "Northtown"), never a real client's name, town, business or site: the
   stories and docs ship in the public package. **Existing component:** check for, and replace, any
   copy lifted from a consumer app (`ProfileSection` had both), in the stories, the snippet and the
   skill doc (`InputCopy` had one in a story and one in a snippet).
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
    inside a `computed()`. Binding raw `args` (`v-bind="args"`) when the meta has story-only args is the
    same bug class in a different shape: the extras land on the root as HTML attributes (`ActionMenu`'s
    `itemcount="5"`, 2026-10-20), and the ledger doesn't see it. The ledger's `story_args_bug` column flags the destructure case automatically (any
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
    - out-of-range or odd numbers (0, negative, above the maximum, fractional, very large). A
      count prop used as a `v-for` range (`itemCount`) needs flooring and clamping in a
      `computed()`: Vue renders nothing for a fractional or negative range and only warns in dev
      (`StepperList`, 2026-10-15)
    - broken image or link URLs
    - an empty list where script loops over the data: a `while` loop that walks or cycles the
      items must still terminate, and an async loop must await something on every pass, or the
      tab freezes. `SamaritanPromptMixed` (empty `messageConfigs` with `introDelay: 0`) and
      `CarouselFlip` (empty `carouselDataIds`) both did, fixed 2026-10-21. Grep the script for
      `while (` and check each one with zero and one item
    - data a third-party child can't handle: a library that throws while rendering (an encoder, a
      parser) breaks the whole page render. Catch it with `onErrorCaptured` and render a fallback
      (`DisplayQrCode` threw "Data too long" on an over-capacity value until 2026-10-19). Check story
      control ranges against the library's real range too: its `radius` control ran to 20 while the
      library clamps to 0-1
    Describe what to check in the story's docs description, and look at it at every
    `CanvasSwitcher` width. Fixes usually mean `overflow-wrap: anywhere`, `min-inline-size: 0` on
    flex/grid children, `Array.from(str)` instead of `str[0]`, and `clamp()` on values
    derived from data. Give each text element a consumer might want to shorten (names, titles,
    descriptions, body text) a line-clamp token, `--<component>-<element>-line-clamp`, which
    covers ellipsis too (`1` is single-line ellipsis). Default it to `none` unless the layout
    clearly needs a cap, and never clamp text that must stay readable (legal or attribution text,
    link text that names its destination). Only text the component renders itself (props and data) needs a token: text that arrives
    through a slot is the consumer's own markup, so they clamp it directly and the component adds
    no token for it (`ProfileSection` is all slots and has none). Shape and rules: `theming-component-token-pattern.md`,
    "Line-clamp tokens". Give each line-clamp token a Controls-panel select in the stories (set on
    a wrapper `:style`, stripped from the component's args), labelled as a story-only CSS token so
    nobody mistakes it for a prop: `storybook-add-story.md`, "Label token controls as story-only".
    Add a unit test for any logic fix. A grid or layout component still gets one with oversized
    slot content (an unbroken string in one cell finds `min-inline-size` overflow bugs). Components
    with nothing to stress (animation wrappers, decorative containers that only take a slot and
    tag/variant props, Storybook tooling) are exempt: they are listed in `stressStoryExempt` in
    `.claude/component-ledger/build.mjs`; add a new one there rather than writing a padding story.
6c. **Storybook docs page** — every story file gets a generated Docs page: `tags: ["autodocs"]` is
    set globally in `.storybook/preview.ts` (since 2026-10-14), so don't repeat it in the meta.
    Open the component's Docs page and check that it reads well:
    - A `parameters.docs.description.component` in the meta says what the component is for and
      names its main props/slots/events. Per-story `docs.description.story` text explains what
      that story shows (the Docs page is the only place either is visible).
    - The props table is accurate. Every story-only arg has a `description` and a category, and
      CSS-token args are labelled story-only (6b).
    - Every story renders inline. A story that misbehaves on the shared page (fixed/sticky
      overlays, `layout: "fullscreen"` canvases, dialogs, toasts, scroll effects, heavy stress
      data) gets `parameters.docs.story: { inline: false, height: "<px>" }` so it renders in its
      own iframe. Don't drop it from the page.
    - A story file that isn't a component reference (Storybook tooling, a file that already has an
      attached `.mdx` page) opts out with `tags: ["!autodocs"]`. `ColourRamps.stories.ts` does this.
    See `storybook-add-story.md`, "Docs page".
7. **Skill doc** — create or update `.claude/skills/components/<component-name>.md`, following the
   pattern of an existing one. A labelled `<Name>Field` wrapper (or any other wrapper) is documented
   in its control's doc under a "Variants" section, not in a doc of its own
   (`feedback_variants_deprecated_as_own_skill_docs`). **Existing component:** check every
   behavioural claim (event order and timing, what's disabled when, breakpoints) against the code,
   not just the props table: `InputCopy`'s doc said `copy` fired before the clipboard write. **Existing component:** if you find a
   `variants/` subfolder, flatten it into the parent folder (`git mv` the `.vue` files plus their
   stories/tests up one level, fix relative imports); `pathPrefix: false` keeps the auto-import
   names unchanged. All existing `variants/` folders were flattened 2026-09-25.
8. **VS Code snippet** — create or update `.vscode/srcdev-component-{family}.code-snippets`,
   covering the control and its Field wrapper in one file. For a teleported component, a CSS
   override scaffold must not nest its selector under a page class: it never matches (the
   `DisplayToast` snippet did, fixed 2026-10-16). A tab stop with a default value is `${3:8}`:
   `$38` is read as tab stop 38 and the default never appears (`AlertMask`, fixed 2026-10-17).
9. **Accessibility** — check for gaps beyond what already-passing tests would catch:
   - Interactive controls (buttons, toggles, custom form-like widgets) have an accessible name —
     visible text, `aria-label`, or `aria-labelledby`.
   - A `<ul>`/`<ol>` styled with `list-style: none` gets `role="list"`, or Safari/VoiceOver stops
     announcing it as a list (`StepperList`, 2026-10-15).
   - Keyboard behaviour matches what's actually implemented — no keydown case that only calls
     `event.preventDefault()` with a comment like "could add this later", and no screen-reader
     copy (visible or `sr-only`) that describes an interaction the component doesn't actually
     perform. Cross-check every claim in the copy against the handler that's supposed to back it.
   - A toast, banner or status message doesn't `.focus()` itself when it appears (rule
     `consumer/a11y-no-focus-steal.md`).
   - Focus is visible (`:focus-visible`, not a suppressed outline) on anything focusable.
   - An element hidden visually but kept in the DOM (zero width, `opacity: 0`, kept as an anchor)
     also leaves the tab order and the accessibility tree (`tabindex="-1"`, `aria-hidden`), or it's
     an invisible tab stop (`DisplayTooltip`'s `hideTrigger`, fixed 2026-10-18).
   - `aria-invalid` is bound as `fieldHasError ? 'true' : undefined`, never the boolean itself:
     `:aria-invalid="fieldHasError"` renders `aria-invalid="false"` on every valid field
     (`InputTextarea`, `ToggleSwitch`, fixed 2026-10-16). Same for an empty `aria-describedby`.
   - A checkbox drawn as an on/off switch has `role="switch"`, and its decorative track is
     `aria-hidden` (`ToggleSwitch`, 2026-10-16).
   - Live-updating or auto-advancing content (carousels, marquees, auto-dismissing toasts) has a
     way to pause it, per WCAG 2.2.2 — a visible control, or pause-on-hover/focus at minimum.
   - Pause-on-focus listens for `focusin`/`focusout` on the root (with a `relatedTarget`
     containment check), not `focus`/`blur`, which don't bubble: focusable content inside an
     `aria-hidden` moving track otherwise gets focus while still hidden and moving. A looping
     duplicate copy gets `inert`, and a focus-caused pause must not undo a pause the user chose
     (`MarqueeScroller`, 2026-10-18).
   - `prefers-reduced-motion` is respected for any animation that isn't purely decorative.
   - A mode that hides a native control's own indicator (a range thumb, a checkbox box, a caret)
     draws its own visible state for the current value, and its interactive area isn't shrunk to a
     sliver. `InputRange`'s markers mode hid the thumb with nothing in its place and left only a
     2px line clickable, from its first commit until 2026-10-16; its 5/5 score didn't show it.
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
      for what that class actually means (pitfall #18, `mi-12`). And no class the layer doesn't
      define at all: `DisplayTooltipRich` carried `subtitle-sm`, `body-sm` and `input-value`, which
      did nothing here but would pick up a consumer's own CSS (removed 2026-10-18). Grep
      `app/assets/styles` for each non-prefixed class.
    - A class this component styles that another component also styles (a class passed to a child,
      or a child's class the parent restyles): compare the two selectors' specificity. An `all: unset`
      in the higher one silently resets every layout property the other sets: `DisplayTooltip`'s
      close-button reset stretched `DisplayTooltipRich`'s right-aligned button full width for six
      weeks (fixed 2026-10-18).
    - A `v-for` over consumer or CMS data is keyed on something guaranteed unique; a data field
      that can repeat (`href`, `to`, a label) is combined with the index (rule
      `consumer/vfor-keys-from-data.md`).
    - Every raw `<button>` has an explicit `type` (ESLint `vue/html-button-has-type`, on since
      2026-10-18), or it submits any form a consumer renders it inside.
    - Nothing load-bearing relies on a CSS feature WebKit lacks (pitfall #19).
    - No `computed()` over `useSlots()`; use a function called from the template (pitfall #25).
    - Values derived from props are `computed()`, not plain consts frozen at mount.
    - Explicit closing tags (no self-closing non-void elements), hyphenated props in templates, no
      manual Vue imports in components.
    - `NuxtImg` gets explicit `width` and `height`; a `<video>` uses a `<source :src>` child with
      `:key` and `.load()` (pitfall #12).
    - No `#components` import (breaks Storybook); use `resolveComponent()`.
    - Layout breakpoints respond to the component's own width (`container: <name> / inline-size` on the
      root, `@container <name> (min-width: …)`), not the viewport, so it still works in a narrow
      column. **Existing component:** when converting a viewport `@media` breakpoint, grep consumer
      repos for `@media` overrides of the same element (they now switch at a different point) and list
      the edits in private memory. Note that an inline-size container can't size itself from its
      content: say so in `CONSUMER-STYLING.md` (`ProfileSection`).
    - Grid tracks that hold text are `minmax(0, …)` so an unbroken string can't widen the grid.
    - An `auto-fit` column minimum taken from a token or a measured width is wrapped in
      `min(100%, …)`, or one long item makes the column wider than its container.
    - A component whose root is a `<fieldset>` sets `min-inline-size: 0` on it: a native fieldset
      defaults to its min-content width and overflows a narrow column (`MultipleCheckboxes`,
      2026-10-16).
    - Element ids come from `useId()`, never from data values (rule `consumer/ids-from-useid.md`).
      Call `useId()` once at setup, never inside a `computed` (`DisplayTooltip`, `DisplayTooltipRich`,
      2026-10-18).
    - A wrapper forwards a slot to its child only when the consumer filled it
      (`<template v-if="slots[name]" #icon>`). An always-present `<template #icon>` replaces the child's
      fallback with nothing: `AccordionGroup` hid the panels' default caret this way until 2026-10-20.
    - A wrapper passes its child only props the child declares. Anything else falls through as an
      HTML attribute on the child's root: `InputTextField` put `label="…"` and
      `error-message="…"` on `.input-text-wrapper` (fixed 2026-10-16). Check the child root's
      attributes in a test.
    - A control styled with `all: unset` restores the UA defaults it depends on. On a `<textarea>`
      that reset `white-space: pre-wrap` (inherited, so it took the page's `normal`); set
      `white-space: pre-wrap` and `overflow-wrap: anywhere` explicitly (`InputTextarea`,
      2026-10-16).
    - A state rule (`[data-checked]`) written at the root level loses to deeper nested base rules
      for the same element. Nest it in the element's own block as `.root[data-x] & { … }`
      (`ToggleSwitch`, 2026-10-16; `css-nesting-conventions.md`). Same for hover and focus: keep
      both at the same nesting depth with focus after hover, or a deeper hover rule recolours the
      focus ring while both apply (`InputSelect`, 2026-10-17).
    - Step buttons and any other script that changes a number round to the step's precision
      (`toFixed`), clamp to `min`/`max`, and compare limits with `<=`/`>=`, never `===` (0.1 steps
      drift to 0.30000000000000004, and an overshoot past an `===` check never disables the button).
      Reference: `stepBy()` in `InputNumberField`.
    - Layout measured in script (connector lines, indicators) re-measures when any measured item
      resizes or changes class, not only when the container resizes (`measured-layout-observers.md`,
      pitfall #28). Prefer a CSS-only position when one exists (rule above, `SegmentedControl`).
    - Geometry drawn in script (SVG paths, canvas) is physical. Position content around it with
      physical properties (`margin-left`, not `margin-inline-start`), or right-to-left content
      overlaps a one-sided bar (`AlertMask`, 2026-10-17).
    - Action buttons are `InputButton` (`variant="inline"` when the wrapper styles them), not a raw
      `<button>` (`component-inline-button.md`, `component-inline-action-button.md`). The ledger
      doesn't check this, which is how `InputCopy` scored 5/5 with one (fixed 2026-10-15).
    - No `:deep()` in the component's `<style>`: these blocks are never scoped, so Vue leaves it
      as-is and the browser drops the whole rule (pitfall #27). Use a descendant selector, or set
      the child component's public tokens on an ancestor.
    - No `font-size` (or font-size token default) under `1rem`. `html` is `62.5%`, so `1rem` is
      10px, and values like `0.75rem`/`0.9rem` are almost always copied from a 16px-base design
      and render at 7.5-9px. `PricingCard` had both (fixed 2026-10-15); grep
      `font-size:\s*(var\([^,]+,\s*)?0?\.[0-9]+rem` to find them.
