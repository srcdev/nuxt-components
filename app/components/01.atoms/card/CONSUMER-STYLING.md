# CardCore — Consumer Styling Guide

## Public token API

All `--card-core-*` tokens are the stable override surface. Set them at any scope (global, page,
or instance) without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--card-core-row-gap` | `1rem` | Gap between card rows |
| `--card-core-inner-padding` | `1rem` | Internal padding (applied per row by the consumer) |
| `--card-core-border-radius` | `0.5rem` | Corner rounding |
| `--card-core-border` | `0.2rem solid var(--slate-08)` | Full border shorthand |
| `--card-core-box-shadow` | `0.1rem 0.1rem 0.4rem oklch(from var(--slate-08) l c h / 0.45)` | Box shadow shorthand |
| `--card-core-background-color` | `transparent` | Main background colour |
| `--card-core-background-image` | `none` | Main background image |
| `--card-core-lower-background-color` | `transparent` | Blurred backdrop layer colour |
| `--card-core-lower-background-image` | `none` | Blurred backdrop layer image |
| `--card-core-lower-background-position` | `center` | Backdrop image position |
| `--card-core-lower-background-blur` | `16px` | Backdrop blur amount |
| `--card-core-lower-scale` | `1.1` | Backdrop scale (zoom to hide blur edges) |

> **Variant note**: The `solid`, `subtle`, `soft`, and `outline` variants directly override the
> internal `--_card-background-color` and `--_card-border` tokens, bypassing the public tokens
> for those properties. To override a variant's colours, target the variant class directly (see
> [Per-variant overrides](#per-variant-overrides) below).

---

## Global theming — app-level CSS file

Create `assets/styles/setup/07.components/card-core.css` in the consuming app and set tokens on
`:root`. These values apply to every `CardCore` instance across the site.

```css
/* assets/styles/setup/07.components/card-core.css */
:root {
  --card-core-border-radius: 1rem;
  --card-core-border: 0.1rem solid var(--brand-border);
  --card-core-box-shadow: 0 0.2rem 1.2rem rgb(0 0 0 / 8%);
  --card-core-row-gap: 0;
}
```

---

## Per-variant overrides

Variants override internal tokens directly, so target the variant class to change their colours:

```css
/* assets/styles/setup/07.components/card-core.css */
:root {
  /* shared geometry */
  --card-core-border-radius: 0.8rem;
}

/* variant colour overrides — set on the variant class, not :root */
.card-core {
  &.solid {
    --_card-background-color: var(--brand-surface);
    --_card-border: 0.1rem solid var(--brand-border);
  }

  &.subtle {
    --_card-background-color: color-mix(in oklab, var(--brand-surface) 50%, transparent);
    --_card-border: 0.1rem solid var(--brand-border);
  }

  &.outline {
    --_card-border: 0.15rem solid var(--brand-primary);
  }
}
```

---

## Blurred backdrop pattern

Set `--card-core-lower-background-image` and `--card-core-lower-background-color` to create a
blurred translucent layer behind the card content. The `::before` pseudo-element handles the blur
and the scale hides the blur-edge artefact.

```css
.card-core {
  &.hero-card {
    --card-core-lower-background-image: url("/images/hero.jpg");
    --card-core-lower-background-blur: 24px;
    --card-core-lower-scale: 1.15;
    --card-core-lower-background-color: rgb(0 0 0 / 30%); /* tint over image */
    --card-core-background-color: transparent;
  }
}
```

Or inline for a single instance:

```vue
<CardCore
  variant="solid"
  style="
    --card-core-lower-background-image: url('/images/hero.jpg');
    --card-core-lower-background-blur: 20px;
  "
>
  ...
</CardCore>
```

---

## Page-scoped overrides

When a card appears in a specific page context, scope overrides under the page wrapper. No
`:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.services-page {
  .card-core {
    --card-core-border-radius: 1.2rem;
    --card-core-row-gap: 0;

    &.solid {
      --_card-background-color: var(--brand-surface-alt);
    }
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

```vue
<CardCore :style-class-passthrough="['featured']">
  ...
</CardCore>
```

```css
.card-core {
  &.featured {
    --card-core-border: 0.2rem solid var(--brand-primary);
    --card-core-box-shadow: 0 0.4rem 2rem rgb(0 0 0 / 15%);
    --card-core-border-radius: 1.6rem;
  }
}
```

---

## Card row targeting

Slot content is wrapped in `.card-row.card-row-{name}`. Target rows for padding, borders, or
backgrounds without modifying the component:

```css
.card-core {
  .card-row-header {
    padding: 1.6rem;
    background-color: var(--brand-primary);
    color: white;
  }

  .card-row-body {
    padding: 1.6rem;
  }

  .card-row-footer {
    padding: 1.2rem 1.6rem;
    border-top: 0.1rem solid var(--brand-border);
  }
}
```
