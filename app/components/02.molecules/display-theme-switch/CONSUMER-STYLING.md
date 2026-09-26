# DisplayThemeSwitch — Consumer Styling Guide

## No tokens of its own — delegates entirely to TripleToggleSwitchCore

`DisplayThemeSwitch` is a thin wrapper around `TripleToggleSwitchCore` (see
`app/components/05.forms/triple-toggle-switch/CONSUMER-STYLING.md`) and declares no
`--display-theme-switch-*` tokens of its own. Every colour token documented there
(`--triple-toggle-switch-surface`, `--triple-toggle-switch-border`, `--triple-toggle-switch-marker-surface`,
etc.) applies unchanged, since `DisplayThemeSwitch` renders that component directly with no
intermediate styling layer.

---

## `small` class — compact sizing

Pass `"small"` via `styleClassPassthrough` for a more compact gap/padding/icon-size, useful in a
tight header/nav slot:

```vue
<DisplayThemeSwitch style-class-passthrough="small" />
```

This sets `TripleToggleSwitchCore`'s public `--triple-toggle-switch-gap`/`-padding`/
`-option-padding`/`-icon-size` tokens to smaller values (`0.2rem`/`0.2rem`/`0.2rem`/`1.6rem` vs the
default `0.4rem`/`0.4rem`/`0.4rem`/`2rem` — both already more compact than `TripleToggleSwitchCore`'s
own defaults of `1rem`/`0.6rem`/`0.5rem`/`2rem`). Override any of the four directly for a custom
size instead of using `small`:

```vue
<DisplayThemeSwitch style="--triple-toggle-switch-icon-size: 2.4rem;" />
```

---

## Local overrides

There are no public tokens, so override the classes above with direct properties, scoped to an
element you own (a page or section class, or a class added with `:style-class-passthrough`). Keep
the block **unlayered** (no `@layer` wrapper) so it beats the library's `@layer components`. If your
own file uses `<style scoped>`, selectors that reach inside the component need `:deep()`. Patterns
and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the colour tokens (`--triple-toggle-switch-surface`, `-border`, ...) work from any
ancestor, but the four sizing tokens (`--triple-toggle-switch-gap`, `-padding`, `-option-padding`,
`-icon-size`) are declared on this component's own root (that's how its default and `small` sizes
work), so an ancestor value never reaches the toggle. Set those on the root itself: a class from
`style-class-passthrough`, or inline `style` as shown above.

---

## Class passthrough

`styleClassPassthrough` also accepts any other class for layout purposes, alongside or instead of
`small`.

