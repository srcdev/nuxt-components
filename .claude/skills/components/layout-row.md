# LayoutRow Component

## Overview

`LayoutRow` is a CSS grid-based layout wrapper that controls how wide its content sits within the page. It uses a named-column grid system (full → popout → content → inset-content) so you can precisely place content at different widths without writing custom CSS. It is the primary layout primitive for page sections.

## Before Adding to a Page

Always ask the user for the following before placing the component:

1. **`variant`** — how wide should this row be? (required — see variant guide below)
2. **`tag`** — what semantic element? (`div` | `section` | `article` | `aside` | `header` | `footer` | `main` | `nav` | `ul` | `ol`) — default is `div`
3. **`id`** — does this section need an anchor ID for navigation or skip-links?
4. **`isLandmark`** — should this be a focusable ARIA landmark? (default `false`)
5. **`styleClassPassthrough`** — any extra utility classes for spacing, background, etc.?

Do not assume a variant — always confirm width intent with the user.

## Choosing a Variant

The grid has four named tracks. Ask the user which fits their intent:

| Variant | Max width | Description |
|---------|-----------|-------------|
| `inset-content` | **840px** | Narrower readable column — ideal for long-form text, articles, forms |
| `content` | **1064px** | Standard content width — most common choice for sections |
| `popout` | **1400px** | Wider than content — good for cards, media, feature rows |
| `full` | **100vw** | Edge-to-edge — heroes, full-bleed images, backgrounds |
| `full-width` | **100vw** | Alias for `full` |
| `full-content` | **100vw** | Full width with `--minimum-content-padding` applied inline |
| `full-content-nopad` | **100vw** | Full width, no padding at all |

### Start/end variants

Each track also has `-start` and `-end` variants that anchor to one side of the grid (useful for asymmetric layouts):

- `full-start` / `full-end`
- `popout-start` / `popout-end`
- `content-start` / `content-end`
- `inset-content-start` / `inset-content-end`

### Suggesting a variant based on context

Look at the surrounding page or parent component before suggesting:

- If the parent is a **hero or banner** → `full` or `full-content`
- If the parent is a **page body / article** → `content` or `inset-content`
- If placing a **card grid or media feature** → `popout`
- If the component fills a **sidebar or aside** → `inset-content`
- If there is already a `LayoutRow` parent → the inner row's variant is relative to the parent's inner column width, not the full page — clarify with the user if nesting is intentional

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `variant` | see variant list above | — | **yes** |
| `tag` | `"div" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | no |
| `id` | `string` | `null` | no |
| `isLandmark` | `boolean` | `false` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |
| `dataTestid` | `string` | `"layout-row"` | no |

## Basic Usage

```vue
<LayoutRow variant="content" tag="section">
  <p>Content sits within the 1064px content track.</p>
</LayoutRow>
```

## Common Patterns

### Full-bleed hero with inner content width

```vue
<LayoutRow variant="full" tag="section">
  <!-- Background spans full viewport -->
  <!-- Place a nested LayoutRow or constrained div inside for text -->
  <LayoutRow variant="content">
    <HeroText tag="h1" :textContent="[{ text: 'Welcome' }]" />
  </LayoutRow>
</LayoutRow>
```

### Article / long-form body

```vue
<LayoutRow variant="inset-content" tag="article">
  <p>Comfortable reading width at 840px max.</p>
</LayoutRow>
```

### Feature section (wider than body)

```vue
<LayoutRow variant="popout" tag="section">
  <!-- Card grid, image gallery, etc. -->
</LayoutRow>
```

### Full width with safe padding (e.g. coloured band)

```vue
<LayoutRow variant="full-content" tag="section" :styleClassPassthrough="['bg-brand']">
  <p>Edge-to-edge background, content padded by --minimum-content-padding.</p>
</LayoutRow>
```

## CSS Custom Properties

Override these in your consuming app to adjust the grid track sizes:

| Property | Default | Controls |
|----------|---------|---------|
| `--popout-max-width` | `1400px` | Maximum width of the popout track |
| `--content-max-width` | `1064px` | Maximum width of the content track |
| `--inset-content-max-width` | `840px` | Maximum width of the inset-content track |
| `--minimum-content-padding` | `1rem` | Minimum padding either side at small viewports |

## Notes

- The component is auto-imported in Nuxt — no import needed.
- `LayoutRow` wraps content in an inner `.layout-row-inner` div with `container-type: inline-size`, so children can use container queries.
- `isLandmark` adds `tabindex="0"` and a generic `aria-label` — only use this when the row represents a true navigational landmark. Prefer a meaningful `tag` (e.g. `section`, `main`) over `isLandmark` where possible.
- Nesting `LayoutRow` inside another `LayoutRow` is valid but the inner grid resets relative to the inner container width — this is intentional for full-bleed sections with constrained inner content.
