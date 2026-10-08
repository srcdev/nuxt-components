# DisplayToast / DisplayToastProvider — Consumer Styling Guide

Both render the toast body with `AlertContent` (or `AlertMaskedContent` when `masked`), so the
card's colours, radius and accent bar come from `--alert-content-*` tokens: see
`02.molecules/alert-content/CONSUMER-STYLING.md`. The tokens below cover the toast's own shell.

## Public token API

### DisplayToast (standalone)

| Token | Default | Description |
|---|---|---|
| `--display-toast-z-index` | `999999` | Stacking order (see Stacking order). |
| `--display-toast-max-width` | `min(48rem, 100% - 2 * gutter)` | Maximum toast width. Ignored when `fullWidth` is set. |
| `--display-toast-progress-colour` | `var(--theme-accent)` | Auto-dismiss progress bar colour. |
| `--display-toast-focus-ring-colour` | `var(--theme-ring)` | Keyboard focus outline colour. |

### DisplayToastProvider (queue)

| Token | Default | Description |
|---|---|---|
| `--display-toast-provider-z-index` | `999999` | Stacking order (see Stacking order). |
| `--display-toast-provider-max-width` | `min(48rem, 100% - 2 * gutter)` | Maximum width of the toast stack. Ignored when `fullWidth` is set. |
| `--display-toast-provider-progress-colour` | `var(--theme-accent)` | Auto-dismiss progress bar colour. |
| `--display-toast-provider-focus-ring-colour` | `var(--theme-ring)` | Keyboard focus outline colour. |

The gutter is `12px` below `600px` viewport width, `24px` above.

> Changed 2026-10-08: the max-width tokens are new. The standalone centred toast used
> `width: max-content` with no cap, so long text made it wider than the screen; right/left-aligned
> toasts and the provider stack could stretch almost the full viewport on wide screens. Both now
> cap at `48rem`. Set the max-width token to `none` (with the gutter still applying) to undo that.
> The progress and focus-ring colour tokens are also new; they used to read `--theme-accent` and
> `--theme-ring` directly.

Private tokens, not public API: `--_toast-gutter` and `--_gutter` (the responsive gutter), and the
provider's `--_reveal` / `--_duration` (set inline per toast from its config).

## State hooks

| Hook | Where | Meaning |
|---|---|---|
| `[data-position="top\|bottom"]` | `.display-toast`, `.display-toast-provider` | Vertical position. |
| `[data-alignment="left\|center\|right\|full-width"]` | `.display-toast`, `.display-toast-provider` | Horizontal alignment; `full-width` when `fullWidth` is set. Below `600px` every toast is centred. |
| `[data-state="show\|hide"]` | `.display-toast` | Entering or leaving (standalone only; the provider uses `TransitionGroup`'s `v-enter-*`/`v-leave-*` classes). |
| `[data-paused]` | `.display-toast`, `.display-toast-provider-item` | Auto-dismiss is paused (hovered, or keyboard focus on or inside the toast). Freezes the progress bar. |
| `[data-theme]` | `.display-toast`, `.display-toast-provider-item` | The toast's semantic theme. |

Inner elements: `.display-toast-progress`, `.display-toast-provider-item`,
`.display-toast-provider-progress`.

> Changed 2026-10-08: position, alignment and state were bare classes (`.top`, `.left`, `.center`,
> `.full-width`, `.show`, `.hide`). The toast is teleported into `<body>`, so a consumer's own
> utility classes with those names (a `.hide { display: none }` especially) could match it. They're
> `data-*` attributes now; update any selector that used the old classes. The keyframes were
> renamed for the same reason (`show`, `progress`, `hideTop`, … are now `display-toast-*` and
> `display-toast-provider-*`).

## Stacking order

Both z-index tokens default to `999999`, matching `DisplayDialog`'s `--display-dialog-z-index`. A
toast is meant to float above ordinary page chrome (headers, sticky nav). If a toast appears behind
your site header, your header's z-index is at or above `999999`: raise the toast's token, or (more
robust) lower the header's z-index. If a `DisplayDialog` and a toast are visible at once, they tie
on paint order, an acceptable edge case for a transient notification.

## Motion

Toasts slide in and out over `behavior.revealDuration` (default `550ms`). Under
`prefers-reduced-motion: reduce` they fade instead, with no slide; the progress bar still runs
because it shows how long is left.

Auto-dismiss pauses while the pointer is over a toast, or while keyboard focus is on it or inside
it, and resumes with the time that was left (WCAG 2.2.2). The toast moves focus to itself when
shown; that only pauses it when the user was using a keyboard (`:focus-visible`), so mouse users
still get auto-dismiss.

## Global theming

```css
/* e.g. assets/styles/setup/07.components/display-toast.css */
:where(html) {
  --display-toast-provider-max-width: min(36rem, 100% - 48px);
  --display-toast-provider-progress-colour: var(--brand-accent);
}
```

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** both components teleport to `<body>`, so they aren't inside your page or section
elements and can't inherit tokens from them. Set toast tokens globally (`:root` or `:where(html)`),
or on `DisplayToast` itself via `:style-class-passthrough` (the class lands on the toast element).
`DisplayToastProvider` has no passthrough, so style it globally or with a `.display-toast-provider`
selector.

## Class passthrough

`DisplayToast`'s `styleClassPassthrough` adds classes to the teleported `.display-toast` element, so
it's the way to style one toast instance. `DisplayToastProvider` has none.
