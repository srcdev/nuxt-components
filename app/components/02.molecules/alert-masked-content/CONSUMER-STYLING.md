# AlertMaskedContent — Consumer Styling Guide

`AlertMaskedContent` is `AlertContentInner` (icon, title, body, dismiss button) wrapped in
`AlertMaskCore`'s SVG mask: an accent-coloured border drawn as a cut-out, and a translucent fill,
so whatever sits behind the alert stays visible. It's the variant `DisplayToast`
(`appearance.masked`) and `DisplayPrompt` (`masked`) swap in.

## Public token API

### Mask colours

| Token | Default | Controls |
|---|---|---|
| `--alert-masked-content-border-colour` | `var(--theme-accent)` | Border colour (6px accent bar on the left, 1px elsewhere). |
| `--alert-masked-content-background` | `color-mix(in oklab, var(--theme-surface-subtle) 80%, transparent)` | Translucent fill behind the content: the theme's own surface colour at 80%, so text contrast matches `AlertContent` in light and dark mode. |

These reach the SVG as `fill` styles, so they resolve like any inherited custom property. A
`maskConfig.borderColour` / `maskConfig.backgroundColour` prop value replaces the token entirely
for that instance.

### Mask geometry

Radius and border thickness aren't tokens: `AlertMaskCore` computes the SVG path from them in JS.
Set them with the `maskConfig` prop (`AlertMaskConfig`). Defaults: `radiusLeft: 8`,
`radiusRight: 4`, `borderLeft: 6`, `borderTop`/`borderRight`/`borderBottom: 1`.

### Content

Icon, text and dismiss button styling come from `AlertContentInner` and follow the `data-theme`
set on the root (`--theme-text`, `--theme-border`, etc.).

### Private tokens

None of its own. `AlertMaskCore`'s `--_height` / `--_inset-*` are measured plumbing, not public API.

## State hooks

- `data-theme="info" | "success" | "warning" | "error"` on the root `.alert-masked-content`,
  from the `theme` prop. Drives `--theme-accent` and the content colours.
- Inner classes: `.alert-mask-core` > `.alert-mask-decorator` (the SVG) + `.alert-mask-content` >
  `.alert-content-inner` > `.alert-content-icon`, `.alert-content-body` (`.title`, `.content`),
  `.alert-content-dismiss`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a plain `class` on
`<AlertMaskedContent>`, which falls through to the root since there's no passthrough prop): they
inherit down into the component. Keep the block **unlayered** (no `@layer` wrapper) so it beats the
library's `@layer components`. If your own file uses `<style scoped>`, tokens set on your element
still work, but selectors that reach inside the component need `:deep()`. Patterns and examples:
`.claude/skills/component-local-style-override.md`.

**Caveat:** the root sets `--alert-content-inner-background: transparent` on itself, so an
ancestor value of that token never reaches the masked variant. That's deliberate: an opaque inner
background would hide the mask. Change the fill with `--alert-masked-content-background` instead.

## Class passthrough

There's no `styleClassPassthrough` prop. A plain `class` attribute falls through to the root
`.alert-masked-content` element.

## Notes

- The default fill is the theme's own surface (`--theme-surface-subtle`) at 80%, matching the
  surface `--theme-text` is designed for, so contrast holds in light and dark mode. Lowering the
  percentage shows more backdrop but costs contrast; check it over your real imagery.
