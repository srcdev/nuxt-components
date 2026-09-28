# DisplayDialog — Consumer Styling Guide

## Public token API

All `--display-dialog-*` tokens are the stable override surface. Because dialogs are site-wide UI
elements — not inline components — the recommended approach is to set tokens once in a **global CSS
file** rather than per-instance via `styleClassPassthrough`.

### Overlay

| Token | Default | Controls |
|---|---|---|
| `--display-dialog-backdrop-blur` | `blur(0.5rem)` | CSS filter applied to content behind the overlay |
| `--display-dialog-backdrop-background` | `rgba(0, 0, 0, 0.5)` | Overlay scrim colour |
| `--display-dialog-z-index` | `999999` | Stacking order of the overlay |
| `--display-dialog-transition-duration` | `200ms` | Open/close transition speed (opacity, display, close-button hover) |

### Dialog panel

| Token | Default | Controls |
|---|---|---|
| `--display-dialog-inner-border-radius` | `0.8rem` | Panel corner rounding |
| `--display-dialog-inner-border` | `0.1rem solid var(--colour-text-default)` | Panel border shorthand |
| `--display-dialog-inner-outline` | `0.1rem solid var(--colour-text-default)` | Panel outer outline (sits outside the border) |
| `--display-dialog-inner-background` | `var(--page-bg)` | Panel background colour |

> Changed 2026-09-27: the four panel tokens are now resolved on `.display-dialog-inner` (they were
> resolved on the outer `.display-dialog`), so setting them on the panel itself, e.g. per variant
> with `.display-dialog-inner.alert`, now works. Colour defaults no longer call `light-dark()`
> (unsupported on older iPad Safari); they use the global scheme-aware `--colour-text-default` and
> `--page-bg` instead, so they still follow light/dark mode (dark panel is now `--slate-08`, was
> `--slate-10`).

### Header

| Token | Default | Controls |
|---|---|---|
| `--display-dialog-header-padding` | `1.2rem` | Header area padding |
| `--display-dialog-header-button-margin` | `0` | Close button margin |
| `--display-dialog-header-button-padding` | `0.4rem` | Close button padding |
| `--display-dialog-header-button-border` | `0.1rem solid transparent` | Close button border (resting) |
| `--display-dialog-header-button-border-radius` | `0.4rem` | Close button corner rounding |
| `--display-dialog-header-button-outline` | `0.1rem solid transparent` | Close button outline (resting) |
| `--display-dialog-header-button-border-hover` | `0.1rem solid var(--colour-text-default)` | Close button border on hover/focus |
| `--display-dialog-header-button-outline-hover` | `0.1rem solid var(--colour-text-default)` | Close button outline on hover/focus |
| `--display-dialog-header-button-icon-color` | `var(--colour-text-default)` | Close button icon colour |
| `--display-dialog-header-button-icon-size` | `2.4rem` | Close button icon size |

### Content & footer

| Token | Default | Controls |
|---|---|---|
| `--display-dialog-content-padding` | `1.2rem` | Content area padding |
| `--display-dialog-footer-gap` | `1.2rem` | Gap between footer action buttons |
| `--display-dialog-footer-padding` | `1.2rem` | Footer area padding |

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `[open]` | `.display-dialog` | Dialog is open |
| `[justify-dialog="start|center|end"]` | `.display-dialog` | Horizontal placement of the panel |
| `[align-dialog="start|center|end"]` | `.display-dialog` | Vertical placement of the panel |
| `.dialog`, `.modal`, `.confirm`, `.alert`, `.fullscreen` | `.display-dialog-inner` | The resolved `variant` |
| `[data-theme]` | `.display-dialog-header` | A `theme` is set: adds a `--theme-accent` bottom border and title colour |
| `.allow-content-scroll` | `.display-dialog-content` | `allow-content-scroll` is on |

Inner classes: `.display-dialog-inner` (panel), `.display-dialog-header`,
`.display-dialog-col-left` (title), `.display-dialog-col-right`, `.display-dialog-close`,
`.display-dialog-content`, `.display-dialog-footer`.

> Changed 2026-08-22: these used to be bare generic names (`.inner`, `.header`, `.footer`,
> `.col-left`, `.col-right`, `.dialog-content`). The dialog renders inline, not teleported, so a
> consumer's own unlayered `.header`/`.footer` CSS silently restyled it. Update any overrides
> written against the old names.

---

## Global theming

Create `assets/styles/setup/07.components/display-dialog.css` in the consuming app and set tokens
on `:root`. This applies to every `DisplayDialog` across the site.

```css
/* assets/styles/setup/07.components/display-dialog.css */
:root {
  --display-dialog-backdrop-background: rgba(0, 0, 0, 0.6);
  --display-dialog-inner-border-radius: 1.2rem;
  --display-dialog-inner-background: var(--brand-surface);
  --display-dialog-inner-border: 0.1rem solid var(--brand-border);
  --display-dialog-inner-outline: none;
  --display-dialog-transition-duration: 250ms;

  --display-dialog-header-button-icon-color: var(--brand-text-muted);
  --display-dialog-footer-gap: 0.8rem;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Per variant

The panel tokens resolve on `.display-dialog-inner`, so set them on the variant class:

```css
.display-dialog {
  .display-dialog-inner {
    &.confirm {
      max-width: 40rem;
    }

    &.alert {
      --display-dialog-inner-border: 0.2rem solid var(--color-danger);
    }

    &.fullscreen {
      --display-dialog-inner-background: var(--brand-surface-alt);
    }
  }
}
```

**Caveat:** `fullscreen` forces its radius, border and outline to `0`/`none` on the panel itself,
so `--display-dialog-inner-border-radius`, `-border` and `-outline` have no effect on that variant
(its background still follows `--display-dialog-inner-background`).

### Page or section

Because `<DisplayDialog>` renders inside the page's DOM tree (even though it is `position: fixed`),
you can scope overrides to a specific page without affecting the rest of the site:

```css
/* In the consuming page's unscoped <style> block */
.checkout-page {
  .display-dialog {
    --display-dialog-inner-border-radius: 0;
    --display-dialog-backdrop-background: rgba(0, 0, 0, 0.8);

    .display-dialog-footer {
      justify-content: stretch;
    }
  }
}
```

### One instance

Use sparingly — prefer global or page-scoped CSS for dialogs. When a single instance genuinely
needs a different look, pass a modifier class and target it alongside `.display-dialog`:

```vue
<DisplayDialog :style-class-passthrough="['danger-dialog']" ...>
```

```css
.display-dialog.danger-dialog {
  --display-dialog-backdrop-background: rgba(180, 0, 0, 0.4);

  .display-dialog-inner {
    --display-dialog-inner-border: 0.2rem solid var(--color-danger);
  }
}
```

---

## Recipe: section targeting

Target `.display-dialog-header`, `.display-dialog-content`, and `.display-dialog-footer` directly to adjust layout within the panel:

```css
.display-dialog {
  .display-dialog-header {
    border-bottom: 0.1rem solid var(--brand-border);
  }

  .display-dialog-content {
    /* content area uses --display-dialog-content-padding */
  }

  .display-dialog-footer {
    border-top: 0.1rem solid var(--brand-border);
    justify-content: space-between; /* override default flex-end */
  }
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `<dialog class="display-dialog">`, so tokens
set on a passthrough class land for the whole dialog (see **One instance** above).
