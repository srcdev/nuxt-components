# useSlidingIndicator

## Overview

Positions one or more sliding indicators (a highlight or underline that moves between items) inside
a container, with a stretch-then-catch-up motion: the edge in the direction of travel moves first
and the trailing edge follows one duration later. Used by `useTabs` (TabbedContent) and
`SlidingToggle`. Lives in `app/composables/useSlidingIndicator.ts`, auto-imported.

## API

```ts
const { place, reset } = useSlidingIndicator(containerRef, { axis?: "x" | "y", duration });
```

| Param | Type | Notes |
|---|---|---|
| `containerRef` | `Ref<HTMLElement \| null>` | The positioned element the indicators sit in. The CSS variables are written on it. |
| `axis` | `MaybeRefOrGetter<"x" \| "y">` | Default `"x"`. |
| `duration` | `MaybeRefOrGetter<number>` | Slide length per edge, in ms. Invalid or negative values count as `0`. |

`place(name, target, animate)` measures `target` (its `offsetLeft`/`offsetTop` and size against the
container's client size) and writes, on the container:

- `--_{name}-start` / `--_{name}-end` — insets from the container's start and end edges, in px;
- `--_{name}-duration`, `--_{name}-start-delay`, `--_{name}-end-delay`.

It returns the transition length in ms, or `null` when the container or target is missing (nothing
written). The first placement of a name, `animate: false`, and `prefers-reduced-motion` all snap
(duration `0ms`).

`reset(name)` forgets the last position, so the next placement snaps instead of sliding in from
wherever the indicator last was (use it when an indicator is hidden).

## CSS side

```css
.my-indicator {
  position: absolute;
  left: var(--_my-thing-active-start, 0px);
  right: var(--_my-thing-active-end, 100%);
  transition:
    left var(--_my-thing-active-duration, 0ms) ease var(--_my-thing-active-start-delay, 0ms),
    right var(--_my-thing-active-duration, 0ms) ease var(--_my-thing-active-end-delay, 0ms);
}
```

Use physical `left`/`right` (and `top`/`bottom` for `"y"`): the measurements are physical, so this
also works in right-to-left layouts.

## Rules

- Prefix the `name` with the component (`"sliding-toggle-active"`), so a component nested inside
  another that uses the composable can't inherit its values (pitfall #26). `useTabs` keeps the
  historic `"active"`/`"hovered"` names that TabbedContent's CSS reads.
- Re-place with `animate: false` when the container or any measured item resizes, and when items
  are added or removed (`measured-layout-observers.md`). Don't observe `style` changes: the
  composable writes inline styles on the container.
- Keep the indicators hidden until the first placement (SlidingToggle's `data-ready`), and give the
  selected item its own fallback background for SSR and first paint.
