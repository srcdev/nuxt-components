# HeaderBlock — Consumer Styling Guide

## Public token API

`HeaderBlock` has no tokens of its own, public or private (`--_`). Its own style block only sets
`overflow-wrap: anywhere` on `.header-block`, so an unbroken word or URL wraps instead of
overflowing its column.

Visual size comes from one of six global `.page-heading-1`–`.page-heading-6` utility classes (the
`classLevel` prop), defined in
`app/assets/styles/setup/05.typography/02.utility-classes/_font-classes-page-heading.css`:

| Class | `font-size` |
|---|---|
| `.page-heading-1` | `var(--step-8)` |
| `.page-heading-2` | `var(--step-7)` |
| `.page-heading-3` | `var(--step-6)` |
| `.page-heading-4` | `var(--step-5)` |
| `.page-heading-5` | `var(--step-4)` |
| `.page-heading-6` | `var(--step-3)` |

All six also set `font-weight: 600`, `line-height: 1`, and reset `margin-block` and `padding-block`
to `0rem` instead of relying on the browser's per-level heading margins, which would fight
`classLevel` and `tagLevel` being independent. Add spacing in your own CSS:

```css
.my-page .page-heading-1 {
  margin-block: 2.4rem 1.6rem;
}
```

---

## State hooks

No state attributes. Classes on the root `<h1>`–`<h6>`:

| Class | Meaning |
|---|---|
| `.header-block` | Always present |
| `.page-heading-{1-6}` | The `classLevel` prop (out-of-range values fall back to `1`) |

> Changed 2026-10-19: `.header-block` is new. Before, the root carried only the
> `.page-heading-*` class and passthrough classes.

---

## Local overrides

There are no public tokens, so override with direct properties, scoped to an element you own (a
page or section class, or a class added with `:style-class-passthrough`). Keep the block
**unlayered** (no `@layer` wrapper) so it beats the library's `@layer components`. If your own file
uses `<style scoped>`, selectors that reach inside the component need `:deep()`. Patterns and
examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** size comes from the global `--step-*` type-scale tokens behind `.page-heading-*`.
Overriding a `--step-*` token on your own element changes every `page-heading-*` inside it, not just
this component's.

### One instance

```vue
<HeaderBlock :tag-level="2" :class-level="1" style-class-passthrough="hero-title">Big idea</HeaderBlock>
```

```css
.hero-title {
  font-size: 6rem;
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root heading element. Reactive after mount.

---

## Notes

- Text arrives through the default slot, so there's no line-clamp token: clamp it in your own
  markup if needed.
