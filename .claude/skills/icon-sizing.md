# Sizing `<Icon>` Components

## Rule

Size an `@nuxt/icon` `<Icon>` with **`font-size`**, never `width`/`height`:

```css
/* ✅ */
.my-component-icon {
  font-size: var(--my-component-icon-size, 2rem);
}

/* ❌ silently ignored inside @layer components */
.my-component-icon {
  width: var(--my-component-icon-size, 2rem);
  height: var(--my-component-icon-size, 2rem);
}
```

If a public size token already exists (e.g. `--input-checked-icon-size`), keep the token and only
change the property it feeds: `font-size: var(--token)`.

## Why: cascade layers, not specificity

`@nuxt/icon` defaults to `mode: "css"`. Each icon renders as a `<span class="iconify i-set:name">`,
styled by a rule the module injects at runtime:

```css
:where(.i-material-symbols\:check-small) {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  mask-image: var(--svg);
  /* ... */
}
```

This repo doesn't set `@nuxt/icon`'s `cssLayer` option, so that rule is **unlayered**. All
component CSS lives in `@layer components`, and **unlayered declarations always beat layered ones,
regardless of specificity**. The icon rule's `:where()` has zero specificity and still wins. In
DevTools, your `width`/`height` show struck through under "Layer components" with no obvious
reason.

`font-size` works because the icon rule never sets it, so there's nothing competing, and its own
`width: 1em; height: 1em` then resolves against your `font-size`.

Found 2026-09-25 in `InputCheckboxRadioCore`, whose `--input-checked-icon-size` token did nothing
until it was moved from `width`/`height` to `font-size`.

## Related notes

- **No `line-height` needed when the icon is a flex or grid item.** A flex/grid child is
  laid out as a block, so no line box and no baseline gap. `line-height: 1` (or `display: block` on the
  icon) only matters when the icon sits inline in running text inside a normal block.
- **Colour** works the same way: set `color` on the icon (or inherit it). The icon paints with
  `background-color: currentColor` through a mask, so `fill`/`stroke` do nothing in CSS mode.
- **Consumer-supplied icons** (via an icon slot) scale correctly with `font-size` too, as long as
  they're `<Icon>`s or other `em`-sized elements.
- **`mode="svg"`** icons render an `<svg>` with presentational `width`/`height` attributes that any
  CSS beats, so `width`/`height` would work there. Use `font-size` anyway, so one rule covers both
  modes.
- **Don't reach for `!important`** or move declarations out of `@layer components` to win. Both
  break the library's override model for consumers.

## Possible global fix (not applied)

`@nuxt/icon` accepts `icon: { cssLayer: "<name>" }` in `nuxt.config.ts`, which wraps the injected
rules in that layer. Adding e.g. `icons` to the declared order in
`app/assets/styles/setup/index.css` **before** `components`
(`@layer reset, colours, theming, form-tokens, typography, a11y, icons, components, utilities, consumer;`)
would make layered component `width`/`height` win again. Two caveats:

- The layer name must appear in that order statement. An unlisted layer first seen *after* it is
  appended last, i.e. with the highest priority, which is the opposite of what's wanted.
- Every `width`/`height` currently written against an icon, which does nothing today, would suddenly
  apply. Audit those sizes visually before switching this on.

Until then, `font-size` is the rule.
