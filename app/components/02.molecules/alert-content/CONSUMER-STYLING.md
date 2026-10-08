# AlertContent — Consumer Styling Guide

Covers `AlertContent` and its inner `AlertContentInner`. The inner tokens also apply inside
`AlertMaskedContent`, which has its own guide for its outer shape.

## Public token API

### Outer shape (`.alert-content`)

| Token | Default | Controls |
|---|---|---|
| `--alert-content-accent` | `var(--theme-accent)` | Accent stripe colour (the root's background, showing at the left edge) |
| `--alert-content-accent-width` | `0.6rem` | Accent stripe width |
| `--alert-content-border` | `0.1rem solid var(--theme-border)` | Border (shorthand) |
| `--alert-content-border-radius-start` | `0.8rem` | Left-hand corner radii (also rounds the inner panel) |
| `--alert-content-border-radius-end` | `0.4rem` | Right-hand corner radii |

### Inside (`.alert-content-inner`)

| Token | Default | Controls |
|---|---|---|
| `--alert-content-inner-background` | `var(--theme-surface-subtle)` | Panel background |
| `--alert-content-text-colour` | `var(--theme-text)` | Text colour (icon, title, message and dismiss inherit it) |
| `--alert-content-padding` | `1.2rem 1.5rem` | Panel padding |
| `--alert-content-gap` | `1.2rem` | Gap between icon, message column and dismiss button |
| `--alert-content-icon-colour` | `currentColor` | Theme icon colour |
| `--alert-content-icon-size` | `2.5rem` | Theme icon size (`font-size`) |
| `--alert-content-body-gap` | `0.4rem` | Gap between title and message |
| `--alert-content-title-font-size` | `var(--step-4)` | Title size |
| `--alert-content-text-font-size` | `var(--step-3)` | Message size |
| `--alert-content-title-line-clamp` | `none` | Max title lines before an ellipsis (`1` = single-line ellipsis, `none` = show everything) |
| `--alert-content-text-line-clamp` | `none` | Max message lines before an ellipsis. Leave it at `none` for messages people must read in full (errors, consent text): clamped text is still read by screen readers but hidden from sighted users |
| `--alert-content-actions-spacing` | `1.2rem` | Space between the message and the actions row |
| `--alert-content-actions-gap` | `0.8rem` | Gap between action controls |
| `--alert-content-actions-justify` | `flex-end` | Horizontal alignment of the actions row (`justify-content`) |

### Dismiss button

| Token | Default | Controls |
|---|---|---|
| `--alert-content-dismiss-border-colour` | `var(--theme-border)` | Button border |
| `--alert-content-dismiss-icon-size` | `1.5rem` | Close icon size |
| `--alert-content-dismiss-background-hover` | `var(--theme-surface-hover)` | Background on hover/focus |
| `--alert-content-dismiss-colour-hover` | `var(--theme-on-surface)` | Icon colour on hover/focus |
| `--alert-content-dismiss-ring` | `var(--theme-ring)` | Focus/hover outline colour |

> **Changed 2026-10-08**: added the two line-clamp tokens. The title and message now wrap long
> unbroken strings (`overflow-wrap: anywhere`) instead of being clipped at the alert's edge.

> **Changed 2026-09-27**: every value above except `--alert-content-inner-background` was hardcoded
> (or read a `--theme-*` token directly, CLAUDE.md pitfall #14). Defaults are unchanged apart from
> the px radii and stripe width, which are now the same sizes in rem. The icon and dismiss colours now
> inherit the text colour (still `--theme-text` by default) so one token recolours all of it.

Private tokens (not public API): `--_radius-start`/`--_radius-end` on `.alert-content`, resolving the
radius tokens once for the four corners.

## State hooks

- `data-theme` on `.alert-content`, from the required `theme` prop. It sets the `--theme-*` tokens
  that every default above reads, so it drives all the colours, in light and dark mode.
- Classes: `.alert-content` > `.alert-content-inner` > `.alert-content-icon` (when `showIcon`),
  `.alert-content-main` > (`.alert-content-body` > `.alert-content-title`, `.alert-content-text`) +
  `.alert-content-actions` (when the `#actions` slot is used), then `.alert-content-dismiss`
  (when `dismissible`).
- `data-test-id`: `alert-icon`, `alert-title`, `alert-content`, `alert-actions`, `alert-dismiss`.

> **Changed 2026-09-27**: `.title`/`.content` renamed to `.alert-content-title`/`.alert-content-text`
> (generic names collide with site CSS when the alert renders inline). The body and new actions row
> are wrapped in `.alert-content-main`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a `:style-class-passthrough`
class on the component, which lands on the root `.alert-content`): they inherit down into the component.
Keep the block **unlayered** (no `@layer` wrapper) so it beats the library's `@layer components`. If
your own file uses `<style scoped>`, tokens set on your element still work, but selectors that reach
inside the component need `:deep()`. Patterns and examples:
`.claude/skills/component-local-style-override.md`.

**Caveat:** `.alert-content` sets `data-theme` on itself, so `--theme-*` values set on an ancestor
don't reach it: the alert always uses its own `theme` prop's palette. Override the `--alert-content-*`
tokens instead. When it's rendered by `DisplayToast`/`DisplayToastProvider` it's teleported to
`<body>`, so set tokens globally or through the toast's own hooks rather than on a page wrapper.

**Caveat:** `.alert-content-actions` sets `--input-button-text-white-space: normal`, so an
`InputButton` in the `#actions` slot wraps a long label instead of spilling out of the alert. A value
for that token set on an ancestor doesn't reach buttons inside the actions row; set it on the button
itself (its own `style-class-passthrough` class) if you need `nowrap` there.

## Class passthrough

`style-class-passthrough` adds classes to the root `.alert-content`, so it's the hook for setting tokens
on one instance. A plain `class` attribute lands there too (single root). Components that render
`AlertContent` for you (`DisplayToast`, `DisplayPrompt`, `CookieConsentBanner`) don't forward it.

> **Changed 2026-10-08**: added the prop. Before this, a plain `class` was the only option.
