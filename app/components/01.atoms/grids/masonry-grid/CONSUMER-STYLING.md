# MasonryGrid — Consumer Styling Guide

## Public token API

| Token | Falls back to | Controls |
|---|---|---|
| `--masonry-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--masonry-grid-item-padding` | `1.2rem` | Inner padding of each item |

Column width and gap are controlled via props (`item-min-width`, `gap`, `unit`), not CSS custom
properties — they drive the CSS column layout directly and need JS-computed values, so they aren't
part of the public token API. See the props table in `.claude/skills/components/masonry-grid.md`.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --masonry-grid-item-border-colour: var(--rose-05);
  --masonry-grid-item-padding: 1.6rem;
}
```

---

## Per-instance overrides

```vue
<MasonryGrid style="--masonry-grid-item-border-colour: var(--gold-04);">
  ...
</MasonryGrid>
```
