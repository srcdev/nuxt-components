# DisplayPrompt — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-prompt-transition-duration` | `200ms` | Collapse/fade duration when the prompt closes (off under `prefers-reduced-motion: reduce`) |

Everything visual inside the prompt (surface, text, accent strip, icon, dismiss button) is rendered
by `AlertContent`, or `AlertMaskedContent` with `masked`, and styled by their tokens. See
`02.molecules/alert-content/CONSUMER-STYLING.md` and `02.molecules/alert-masked-content/CONSUMER-STYLING.md`.
The palette comes from the `data-theme` attribute on `.display-prompt-wrapper` (`--theme-*` tokens).

> Changed 2026-09-28: `--display-prompt-transition-duration` is new (the transition was a hardcoded
> `all 200ms`), and the transition now respects reduced motion.

No private `--_` tokens.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `.closed` | `.display-prompt` (root) | Dismissed without a parent `v-model`; the root is also `inert` |
| `[data-theme="info\|success\|warning\|error"]` | `.display-prompt-wrapper` | The resolved `theme` |

> Changed 2026-09-28: root class renamed from `.display-prompt-core`. A closed prompt is now `inert`
> (its dismiss button used to stay in the tab order while invisible), and the root is only focusable
> (`tabindex="-1"`) when `use-auto-focus` is on.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** `data-theme` on `.display-prompt-wrapper` re-declares the `--theme-*` palette on that
element, so to recolour one prompt set `--theme-*` on the wrapper itself (e.g. via a passthrough
class), not on an ancestor.

---

## Class passthrough

`style-class-passthrough` adds classes to the inner `.display-prompt-wrapper`, not the root. Reactive
after mount.
