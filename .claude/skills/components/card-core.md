# CardCore Component

## Overview

`CardCore` is a generic card container that renders dynamic named slots as stacked rows. It
supports four visual variants, an optional blurred backdrop layer, and a full CSS custom property
API for global and per-instance theming.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write
> camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `tag` | `"div" \| "section" \| "article" \| "aside" \| "main" \| "nav"` | `"div"` | Root element tag |
| `variant` | `"solid" \| "subtle" \| "soft" \| "outline"` | `"solid"` | Visual style variant |
| `has-dividers` | `boolean` | `false` | Adds a border between each card row |
| `no-outline` | `boolean` | `false` | Removes border and box-shadow |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

---

## Slots

Named slots are rendered as rows. Any slot name is valid — each becomes a
`.card-row.card-row-{name}` div.

```vue
<CardCore variant="solid">
  <template #header>Header content</template>
  <template #body>Body content</template>
  <template #footer>Footer content</template>
</CardCore>
```

Rendered structure:

```html
<div class="card-core solid">
  <div class="card-row card-row-header">...</div>
  <div class="card-row card-row-body">...</div>
  <div class="card-row card-row-footer">...</div>
</div>
```

---

## Public CSS token API

Set `--card-core-*` tokens at `:root` (global), a page wrapper (scoped), or inline (per-instance).

| Token | Default | Controls |
|---|---|---|
| `--card-core-row-gap` | `1rem` | Gap between card rows |
| `--card-core-inner-padding` | `1rem` | Available for row-level padding (not applied by the component itself) |
| `--card-core-border-radius` | `0.5rem` | Corner rounding |
| `--card-core-border` | `0.2rem solid var(--slate-08)` | Full border shorthand |
| `--card-core-box-shadow` | `0.1rem 0.1rem 0.4rem oklch(from var(--slate-08) l c h / 0.45)` | Box shadow shorthand |
| `--card-core-background-color` | `transparent` | Main background colour |
| `--card-core-background-image` | `none` | Main background image |
| `--card-core-lower-background-color` | `transparent` | Blurred backdrop layer colour |
| `--card-core-lower-background-image` | `none` | Blurred backdrop layer image |
| `--card-core-lower-background-position` | `center` | Backdrop image position |
| `--card-core-lower-background-blur` | `16px` | Backdrop blur amount |
| `--card-core-lower-scale` | `1.1` | Backdrop scale (hides blur-edge artefact) |

> **Variant note**: `solid`, `subtle`, `soft`, and `outline` variants override the internal
> `--_card-background-color` and `--_card-border` tokens directly, bypassing the public tokens
> for those properties. Override variant colours by targeting the variant class (see below).

---

## Global theming — consuming app setup file

Create `assets/styles/setup/07.components/card-core.css` in the consuming app:

```css
/* assets/styles/setup/07.components/card-core.css */
:root {
  --card-core-border-radius: 1rem;
  --card-core-border: 0.1rem solid var(--brand-border);
  --card-core-box-shadow: 0 0.2rem 1.2rem rgb(0 0 0 / 8%);
  --card-core-row-gap: 0;
}

/* variant colour overrides */
.card-core {
  &.solid {
    --_card-background-color: var(--brand-surface);
    --_card-border: 0.1rem solid var(--brand-border);
  }

  &.outline {
    --_card-border: 0.15rem solid var(--brand-primary);
  }
}
```

---

## Blurred backdrop pattern

`--card-core-lower-*` tokens drive a `::before` pseudo-element behind all card content. Use it
for image-backed cards with a frosted/blurred layer effect.

```css
.card-core {
  &.hero-card {
    --card-core-lower-background-image: url("/images/hero.jpg");
    --card-core-lower-background-blur: 24px;
    --card-core-lower-scale: 1.15;
    --card-core-lower-background-color: rgb(0 0 0 / 30%);
    --card-core-background-color: transparent;
  }
}
```

Or inline:

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

```css
/* Unscoped <style> block in the consuming page */
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

## Per-instance override via styleClassPassthrough

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

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- The `::before` backdrop layer sits at `z-index: 0`; all slot content is lifted to `z-index: 1`
  automatically via the `> *` selector.
- `--card-core-inner-padding` is available as a token but the component does not apply it to rows
  — the consuming app is expected to set padding on `.card-row-*` selectors directly.
- See `CONSUMER-STYLING.md` in the component source folder for the full override reference.
