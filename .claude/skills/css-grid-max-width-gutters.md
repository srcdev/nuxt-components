# CSS Grid — Max Width via Growing Gutters

## Overview

A pattern for capping the width of a central grid column without breaking full-bleed backgrounds. Instead of capping the column with `max-width`, the gutters grow to enforce the constraint. The centre column stays `1fr` and the layout never breaks.

## The problem with capping the centre column

Using `minmax(0, 1064px)` on the centre column caps its width but doesn't distribute the leftover space — it simply goes unused. Full-bleed backgrounds on adjacent rows break, and you lose the ability to use `subgrid`.

## The pattern

Grow the gutters instead:

```css
grid-template-columns: max(MIN_GUTTER, (100% - MAX_WIDTH) / 2) 1fr max(MIN_GUTTER, (100% - MAX_WIDTH) / 2);
```

- When the container is **narrower** than `MAX_WIDTH`: `(100% - MAX_WIDTH) / 2` is negative, `max()` clamps back to `MIN_GUTTER`. Gutters hold their minimum.
- When the container is **wider** than `MAX_WIDTH`: gutters grow equally, enforcing the cap. The centre column never exceeds `MAX_WIDTH`.

## Start-aligned variant

When you want the content pinned to one side (e.g. left-aligned editorial layout):

```css
grid-template-columns: MIN_GUTTER minmax(0, MAX_WIDTH) 1fr;
```

Left gutter stays fixed, content column is capped at `MAX_WIDTH`, remaining space goes to the right.

## In Vue with a prop

Because `v-bind()` in `<style>` can't be nested inside CSS functions like `max()`, build the column string as a computed and bind the whole value:

```ts
// Props
interface Props {
  maxWidth?: string;        // e.g. "1064px"
  contentAlign?: "start" | "center";
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: undefined,
  contentAlign: "center",
});

// Computed column string
const gridColumns = computed(() => {
  if (!props.maxWidth) return "16px 1fr 16px";
  if (props.contentAlign === "start") return `16px minmax(0, ${props.maxWidth}) 1fr`;
  return `max(16px, (100% - ${props.maxWidth}) / 2) 1fr max(16px, (100% - ${props.maxWidth}) / 2)`;
});
```

```css
.component {
  display: grid;
  grid-template-columns: v-bind(gridColumns);
}
```

## Notes

- `subgrid` on child elements still works — the column count doesn't change, only the gutter widths.
- The minimum gutter (e.g. `16px`) is always enforced, so narrow viewports are safe without media queries.
- `contentAlign` has no effect when `maxWidth` is not set — fall through to the fixed-gutter default.
