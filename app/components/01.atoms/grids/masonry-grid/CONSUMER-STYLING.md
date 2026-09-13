# MasonryGrid — Consumer Styling Guide

## Public token API

| Token | Falls back to | Controls |
|---|---|---|
| `--masonry-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--masonry-grid-item-padding` | `1.2rem` | Inner padding of each item |
| `--masonry-grid-transition-duration` | `0.3s` | How long an item takes to slide into its new position on resize (respects `prefers-reduced-motion`) |

Column width, gap, fixed-width mode, and alignment are controlled via props (`item-min-width`,
`gap`, `fixed-width`, `justify`), not CSS custom properties — column count and item positions are
computed in JS from measured pixel values. See `.claude/skills/components/masonry-grid.md`.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --masonry-grid-item-border-colour: var(--rose-05);
  --masonry-grid-item-padding: 1.6rem;
  --masonry-grid-transition-duration: 0.5s;
}
```

---

## Per-instance overrides

```vue
<MasonryGrid style="--masonry-grid-item-border-colour: var(--gold-04);">
  ...
</MasonryGrid>
```
