# Sizing `<Icon>` Components

## Rule

Since 2026-09-28 the library puts `@nuxt/icon`'s injected CSS in its own `icons` cascade layer,
ordered before `components`. Component CSS can size an `<Icon>` with `width`/`height` **or**
`font-size`, and both work:

```css
.my-component-icon {
  width: var(--my-component-icon-size, 2rem);
  height: var(--my-component-icon-size, 2rem);
}
```

`font-size` is still the neater choice when the icon should scale with surrounding text, because
the icon's own `width: 1em; height: 1em` resolves against it.

## How it's wired

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

Two settings keep it below component CSS:

- `nuxt.config.ts`: `icon: { cssLayer: "icons" }` wraps the injected rules in `@layer icons`.
- `app/assets/styles/setup/index.css`: the layer order statement lists `icons` before `components`
  (`@layer reset, colours, theming, form-tokens, typography, a11y, icons, components, utilities, consumer;`).

**Keep `icons` in that order statement.** A layer that isn't named there and first appears after it
is appended last, i.e. with the highest priority, which would put the icon rule back on top.

## History

Before 2026-09-28 `cssLayer` wasn't set, so the icon rule was **unlayered**. Unlayered declarations
beat every layered one regardless of specificity, so any `width`/`height` in `@layer components`
on an icon showed struck through in DevTools and did nothing, and the rule was "use `font-size`".
When the layer was added, the `width`/`height` declarations written against icons at the time
(CanvasSwitcher, DisplayTooltip, PopOver, InputCopy, SelectMenu, CarouselFlip, ResponsiveHeader,
ServiceDetail, InputSelectCore) started applying for the first time. If an icon in one of those
looks a different size than it used to, that's the cause.

## Related notes

- **No `line-height` needed when the icon is a flex or grid item.** A flex/grid child is
  laid out as a block, so no line box and no baseline gap. `line-height: 1` (or `display: block` on the
  icon) only matters when the icon sits inline in running text inside a normal block.
- **Colour** works via `color` on the icon (or inherited). The icon paints with
  `background-color: currentColor` through a mask, so `fill`/`stroke` do nothing in CSS mode.
- **`mode="svg"`** icons render an `<svg>` with presentational `width`/`height` attributes that any
  CSS beats.
- **Consumer apps**: a consumer's own *unlayered* CSS still beats everything here. A consumer's
  *layered* CSS on icons now also wins over the icon rule, where it previously didn't.
- **Don't reach for `!important`** or move declarations out of `@layer components`. Both break the
  library's override model for consumers.
