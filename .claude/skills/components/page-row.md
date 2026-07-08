# PageRow Component

## Overview

`PageRow` is a page layout primitive built on CSS Grid named lines. Each `PageRow` is
simultaneously a CSS grid container (for its children) and a grid item (when nested inside another
`PageRow`). Compose full-width backgrounds with constrained inner content by nesting PageRows —
no extra wrapper divs needed.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write
> camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `tag` | `"div" \| "section" \| "article" \| "header" \| "footer" \| "main" \| "nav"` | `"div"` | Root element tag |
| `variant` | `"full" \| "popout" \| "content" \| "inset-content"` | `"content"` | Grid column track this element occupies when nested in another PageRow |
| `align` | `"start" \| "end"` | — | Bleeds one side to the viewport edge while respecting the variant boundary on the other |
| `id` | `string` | — | `id` attribute on the root element |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

---

## Track widths

| Variant | Max width | Typical use |
|---|---|---|
| `full` | 100vw (1fr gutters) | Full-bleed backgrounds, hero sections |
| `popout` | 1400px | Imagery, callouts that break the text column |
| `content` | 1064px | Body text, standard page content (default) |
| `inset-content` | 840px | Focused reading, narrower prose or forms |

All widths are overridable via CSS tokens — see [Consumer styling](#consumer-css-token-api).

---

## Core composition pattern

Nest a `variant="full"` outer PageRow (for backgrounds / borders) with inner PageRows at narrower
variants. Direct non-PageRow children inherit the outer row's variant as their default grid column.

```vue
<!-- Full-width section background, constrained content -->
<PageRow tag="section" variant="full" style="background: var(--brand-surface); padding-block: 6rem;">
  <h1>Heading</h1>        <!-- spans full track -->
  <p>Body copy</p>        <!-- spans full track -->

  <!-- Break out to a narrower inner width -->
  <PageRow variant="content">
    <p>Constrained to 1064px</p>
  </PageRow>
</PageRow>
```

---

## Align prop — edge bleed

Combine `variant` with `align` to bleed one side to the viewport edge while keeping the opposite
boundary at the track line. Useful for asymmetric imagery, pull-quotes, or decorative panels.

```vue
<!-- Bleeds left to viewport edge, right boundary at content-end -->
<PageRow>
  <PageRow variant="content" align="start" style="background: var(--brand-tint);">
    <p>full-start → content-end</p>
  </PageRow>
</PageRow>

<!-- Bleeds right to viewport edge, left boundary at content-start -->
<PageRow>
  <PageRow variant="content" align="end" style="background: var(--brand-tint);">
    <p>content-start → full-end</p>
  </PageRow>
</PageRow>
```

`align` has no effect on `variant="full"` (already edge-to-edge).

---

## Accessibility — aria-labelledby

When `tag` is `section`, `article`, or `aside`, `PageRow` automatically generates an
`aria-labelledby` attribute pointing to the first heading inside. **You must bind the
`headingId` slot prop to that heading's `id`** — `PageRow` cannot verify you did this, since the
slot content is arbitrary. If you forget, the section gets an `aria-labelledby` pointing at an id
that exists nowhere in the DOM, which accessibility audits (WAVE, axe) flag as a broken ARIA
reference. A console warning fires in the browser (from `useAriaLabelledById`) the moment a
mounted instance is missing its matching heading — check the console if you see this warning.

```vue
<PageRow tag="section">
  <template #default="{ headingId }">
    <h2 :id="headingId">Section title</h2>
    <p>Section content</p>
  </template>
</PageRow>
```

`tag="main"` is deliberately **not** auto-labelled — a `<main>` landmark doesn't need an
accessible name unless a page has more than one. Other non-landmark tags (`div`, `header`,
`footer`, `nav`) also do not receive `aria-labelledby`. The `headingId` slot prop is still
provided in both cases but can be ignored.

See [component-aria-landmark.md](../component-aria-landmark.md) for the full pattern and the
list of components that share it.

---

## Consumer CSS token API

Set `--page-row-*` tokens at `:root` (global), a page wrapper (scoped), or inline (per-instance).

| Token | Default | Controls |
|---|---|---|
| `--page-row-minimum-content-padding` | `1rem` | Minimum gutter at narrow viewports |
| `--page-row-popout-max-width` | `1400px` | Max width of the popout track |
| `--page-row-content-max-width` | `1064px` | Max width of the content track |
| `--page-row-inset-content-max-width` | `840px` | Max width of the inset-content track |

### Global override

```css
/* assets/styles/setup/07.components/page-row.css */
:root {
  --page-row-minimum-content-padding: 1.6rem;
  --page-row-content-max-width: 960px;
}
```

### Page-scoped override

```css
/* Unscoped <style> in the consuming page */
.landing-page {
  .page-row {
    --page-row-content-max-width: 800px;
  }
}
```

### Per-instance override

```vue
<PageRow variant="content" style="--page-row-content-max-width: 720px;">
  ...
</PageRow>
```

See `CONSUMER-STYLING.md` in the component source folder for the full override reference.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- The component applies no padding, margin, or background — these are always set by the consuming
  app on the PageRow element or its children.
- `container-type: inline-size` is set on every `.page-row`, so `@container` queries on children
  respond to the PageRow's own width, not the viewport.
- Track widths are derived with `calc()` from the four tokens — adjusting one token shifts all
  related tracks proportionally.
