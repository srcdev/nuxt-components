# AutoGrid — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--auto-grid-gap` | `1rem` | Gap between grid items |
| `--auto-grid-min-col-size-default` | `300px` | Minimum column width when `is-responsive` is off; the 768px+ step when it's on |
| `--auto-grid-min-col-size-small` | `250px` | Minimum column width below 768px container width (`is-responsive` only) |
| `--auto-grid-min-col-size-large` | `350px` | Minimum column width at 1024px+ container width (`is-responsive` only) |

Columns use `repeat(auto-fit, minmax(min(<min-col-size>, 100%), 1fr))`, so a column never
overflows a container narrower than the minimum. There is no column-count token: to fix the count,
override `grid-template-columns` directly (see Notes).

No private `--_` tokens.

> Changed 2026-09-27: the four tokens used to be declared on `.auto-grid` itself, so a value set
> on a page or section ancestor never landed (only a value set on the grid element itself did).
> The defaults now live as `var()` fallbacks at the point of use, so ancestor values inherit in.

---

## State hooks

| Hook | When | Effect |
|---|---|---|
| `.auto-grid` | Always | Root element |
| `.auto-grid.is-responsive` | `is-responsive` prop is `true` | Column minimum steps small → default → large via `@container` queries at 768px and 1024px |

The breakpoints are container queries, so `is-responsive` needs an ancestor with
`container-type: inline-size`. Without one, the small size applies at every width.

---

## Global theming

```css
:where(html) {
  --auto-grid-gap: 2.4rem;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<AutoGrid style="--auto-grid-min-col-size-default: 200px; --auto-grid-gap: 2rem;">
  ...
</AutoGrid>
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.auto-grid` element (the grid container
itself). It's the usual hook for per-instance token overrides or for replacing
`grid-template-columns` outright.

---

## Notes

- **Fixed column count**: there's no token for it. Override `grid-template-columns` on the root,
  e.g. `style="grid-template-columns: repeat(3, 1fr)"` or an unlayered rule on a passthrough class.
- AutoGrid adds no styling to slot content. Each named slot's root element becomes one grid item.
