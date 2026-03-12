# Prop-Driven Layout Variation via data-* + CSS @container

## Overview

How to vary CSS grid layout inside a `@container` query based on a component prop, using a `data-*` attribute as the CSS hook. Used in `ContentContainer` for the `justifyContent` prop.

## Pattern

### 1. Bind the prop as a class in the template

```vue
<div class="content-container" :class="justifyContent">
```

### 2. Use `&.class` selectors inside the `@container` query

```css
@container content-container (width >= 1092px) {
  /* default (center) */
  --gutter: 0;
  --content-max-width: 1064px;
  --justify-content: center;

  &.start {
    --gutter: 16px;
    --justify-content: start;
  }

  &.end {
    --gutter: 16px;
    --justify-content: end;
  }
}
```

The `&` selector inside a `@container` rule refers to the element that carries the class.

## Notes

- **Why not `v-bind()` in `<style>`?** `v-bind()` injects a CSS custom property at the root element — it can't be targeted with a selector. A bound class gives you selector-level control, which is necessary when different values need different combinations of CSS property overrides. Prefer `:class="propName"` over `data-*` attributes for this — it's simpler.
- **`grid-column: gutter` vs `grid-column: content` when gutter is 0**: When named grid column tracks are 0px wide, `gutter-start`/`gutter-end` and `content-start`/`content-end` resolve to the same positions. A child spanning `gutter` and one spanning `content` are visually identical. You can safely use `grid-column: content` uniformly and remove conditional `grid-column` overrides.
- This pattern works with standard CSS nesting — no preprocessor required.
