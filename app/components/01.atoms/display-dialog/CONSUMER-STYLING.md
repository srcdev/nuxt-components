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
| `--display-dialog-inner-border` | `0.1rem solid light-dark(var(--slate-10), var(--slate-02))` | Panel border shorthand |
| `--display-dialog-inner-outline` | `0.1rem solid light-dark(var(--slate-10), var(--slate-00))` | Panel outer outline (sits outside the border) |
| `--display-dialog-inner-background` | `light-dark(var(--slate-00), var(--slate-10))` | Panel background colour |

### Header

| Token | Default | Controls |
|---|---|---|
| `--display-dialog-header-padding` | `1.2rem` | Header area padding |
| `--display-dialog-header-button-margin` | `0` | Close button margin |
| `--display-dialog-header-button-padding` | `0.4rem` | Close button padding |
| `--display-dialog-header-button-border` | `0.1rem solid transparent` | Close button border (resting) |
| `--display-dialog-header-button-border-radius` | `0.4rem` | Close button corner rounding |
| `--display-dialog-header-button-outline` | `0.1rem solid transparent` | Close button outline (resting) |
| `--display-dialog-header-button-border-hover` | `0.1rem solid light-dark(var(--slate-08), var(--slate-04))` | Close button border on hover/focus |
| `--display-dialog-header-button-outline-hover` | `0.1rem solid light-dark(var(--slate-08), var(--slate-04))` | Close button outline on hover/focus |
| `--display-dialog-header-button-icon-color` | `light-dark(var(--slate-09), var(--slate-02))` | Close button icon colour |
| `--display-dialog-header-button-icon-size` | `2.4rem` | Close button icon size |

### Content & footer

| Token | Default | Controls |
|---|---|---|
| `--display-dialog-content-padding` | `1.2rem` | Content area padding |
| `--display-dialog-footer-gap` | `1.2rem` | Gap between footer action buttons |
| `--display-dialog-footer-padding` | `1.2rem` | Footer area padding |

---

## Global theming — recommended approach

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

## Per-variant overrides

The `fullscreen` variant bypasses `--_inner-border-radius`, `--_inner-border`, and
`--_inner-outline` directly (setting them to `0`/`none`). To restyle the fullscreen panel,
target the private tokens on `.inner.fullscreen`:

```css
.display-dialog {
  .inner {
    &.confirm {
      /* e.g. constrain confirm panel width further */
      max-width: 40rem;
    }

    &.alert {
      --display-dialog-inner-border: 0.2rem solid var(--color-danger);
    }

    &.fullscreen {
      /* private tokens are the only lever here */
      --_inner-background: var(--brand-surface-alt);
    }
  }
}
```

---

## Section targeting

Target `.header`, `.dialog-content`, and `.footer` directly to adjust layout within the panel:

```css
.display-dialog {
  .header {
    border-bottom: 0.1rem solid var(--brand-border);
  }

  .dialog-content {
    /* content area uses --display-dialog-content-padding */
  }

  .footer {
    border-top: 0.1rem solid var(--brand-border);
    justify-content: space-between; /* override default flex-end */
  }
}
```

---

## Page-scoped overrides

Because `<DisplayDialog>` renders inside the page's DOM tree (even though it is `position: fixed`),
you can scope overrides to a specific page without affecting the rest of the site:

```css
/* In the consuming page's unscoped <style> block */
.checkout-page {
  .display-dialog {
    --display-dialog-inner-border-radius: 0;
    --display-dialog-backdrop-background: rgba(0, 0, 0, 0.8);

    .footer {
      justify-content: stretch;
    }
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS for dialogs. When a single instance genuinely
needs a different look, pass a modifier class and target it alongside `.display-dialog`:

```vue
<DisplayDialog :style-class-passthrough="['danger-dialog']" ...>
```

```css
.display-dialog.danger-dialog {
  --display-dialog-backdrop-background: rgba(180, 0, 0, 0.4);

  .inner {
    --display-dialog-inner-border: 0.2rem solid var(--color-danger);
  }
}
```
