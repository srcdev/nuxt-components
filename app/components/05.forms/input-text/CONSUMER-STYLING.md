# InputTextCore — Consumer Styling Guide

## Two override paths

Before 2026-08-22, `.input-text-wrapper` read the global `--theme-*` tokens directly
(`--theme-input-surface`, `--theme-border`, `--theme-border-focus`, `--theme-input-surface-hover`).
Overriding those globally (e.g. in a consumer app's unlayered `:root` block) should always have
worked on pure CSS-cascade grounds — an unlayered `:root` declaration (specificity `0,1,0`) beats
the layer's own `:where(html, [data-theme], [data-invalid])` declaration (specificity `0`)
regardless of source/import order — but a consumer app hit a case where a global override wasn't
visibly landing and the root cause wasn't pinned down (see `nuxt-components`'s own git history
around the same date for a *different*, confirmed bug in a sibling app: wrapping consumer CSS in
`@layer consumer` broke in production because SSR-inlined per-chunk `<style>` tags fix layer
priority by first-reference document order, not the app's intended `@layer` statement order — sic
that isn't what was happening here, since the consumer app's CSS was already unlayered, but it's
the same class of "cascade behaves differently than a clean mental model predicts" issue).

Rather than leave global-token overrides as the only lever, `.input-text-wrapper` now also
exposes its own local tokens, one indirection step below the global ones:

```css
--_input-text-surface: var(--theme-input-surface);
--_input-text-surface-hover: var(--theme-input-surface-hover);
--_input-text-border: var(--theme-border);
--_input-text-border-focus: var(--theme-border-focus);
```

- **Global override** (affects every themed component, not just this one): redeclare
  `--theme-input-surface` / `--theme-border` / `--theme-border-focus` / `--theme-input-surface-hover`
  at whatever scope you'd normally set theme tokens (`:root`, `[data-theme]`, a page wrapper).
- **Local override** (this component only, guaranteed to win — it's the last declaration before
  the property that consumes it, no global-token indirection to reason about):

```css
/* Unscoped consumer CSS, no :deep() needed */
.input-text-wrapper {
  --_input-text-border: var(--slate-06);
  --_input-text-border-focus: var(--slate-04);
  --_input-text-surface: var(--slate-01);
}
```

Prefer the local override when you only want to change this one component's look, or when you've
hit a case (like the one above) where a global-token change isn't landing and you don't have time
to dig into why — the local path is a strictly simpler cascade to reason about.

---

## Other tokens

- `--input-icon-slot-gap`, `--input-padding-inline`, `--input-padding-block`, `--input-min-height`,
  `--input-font-size`, `--form-element-border-width`, `--form-input-border-radius`,
  `--form-element-border-bottom-width-underlined`, `--form-element-outline-width(-focus)`,
  `--form-element-outline-offset-focus` — all generic form-geometry tokens shared across every
  `05.forms` component, declared in `setup/04.elements/forms/*.css`. Not component-local, so
  overriding one affects every form element, not just `InputTextCore`.
- `--theme-input-text-color-normal`, `--theme-input-placeholder`,
  `--theme-input-placeholder-font-size` — still read directly from the global theme tokens, no
  local indirection yet. Follow the same pattern above (`--_input-text-*`) if a future consumer
  needs a local override for these.
