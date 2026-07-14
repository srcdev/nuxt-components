# InputCopy — Consumer Styling Guide

## Public token API

All `--input-copy-*` tokens are the stable override surface. Set them at any scope (global, page,
or instance) without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--input-copy-input-bg` | `var(--slate-00)` | Input field background colour |
| `--input-copy-input-border` | `1px solid var(--slate-03)` | Input field border |
| `--input-copy-input-border-radius` | `0.4rem` | Input field corner rounding |
| `--input-copy-input-padding` | `0.8rem 1rem` | Input field padding |
| `--input-copy-input-text-color` | `#333` | Input text colour |
| `--input-copy-input-placeholder-color` | `#999` | Placeholder text colour |
| `--input-copy-input-font-size` | `0.95rem` | Input field font size |
| `--input-copy-button-bg` | `var(--theme-button-primary-surface)` | Copy button background |
| `--input-copy-button-bg-hover` | `var(--theme-button-primary-surface-hover)` | Copy button background on hover |
| `--input-copy-button-text-color` | `var(--theme-button-primary-text)` | Copy button text colour |
| `--input-copy-button-padding` | `0.8rem 1.2rem` | Copy button padding |
| `--input-copy-button-border-radius` | `0.4rem` | Copy button corner rounding |
| `--input-copy-button-gap` | `0.6rem` | Gap between icon and text in button |
| `--input-copy-description-color` | `#666` | Description text colour |
| `--input-copy-description-font-size` | `0.85rem` | Description font size |
| `--input-copy-description-margin` | `0.6rem 0 0 0` | Description margin |

---

## Global theming — app-level CSS file

Create `assets/styles/setup/07.components/input-copy.css` in the consuming app and set tokens on
`:root`. These values apply to every `InputCopy` instance across the site.

```css
/* assets/styles/setup/07.components/input-copy.css */
:root {
  --input-copy-input-border-radius: 0.6rem;
  --input-copy-input-padding: 1rem 1.2rem;
  --input-copy-button-border-radius: 0.6rem;
  --input-copy-button-gap: 0.8rem;
  --input-copy-description-color: var(--slate-06);
}
```

---

## Per-instance overrides via inline styles

Override tokens directly on a single InputCopy instance:

```vue
<InputCopy
  value="sk_live_abc123"
  label="API key"
  style="
    --input-copy-input-border-radius: 0.8rem;
    --input-copy-button-bg: var(--brand-success);
  "
/>
```

---

## Page-scoped overrides

When input-copy appears in a specific page context (e.g., checkout success page), scope overrides
under the page wrapper:

```css
/* In the consuming page's unscoped <style> block */
.success-page {
  .input-copy {
    --input-copy-input-bg: var(--brand-surface-light);
    --input-copy-input-border: 2px solid var(--brand-primary);
    --input-copy-button-bg: var(--brand-primary);
    --input-copy-button-bg-hover: var(--brand-primary-hover);
  }
}
```

---

## License key display pattern

Typical usage on a success page or dashboard to display a license key:

```vue
<InputCopy
  :value="licenseKey"
  label="License key"
  description="Your license key is ready to use. Copy it and add to your component."
  buttonText="Copy"
  copiedText="Copied!"
  @copied="showFeedback"
/>
```

```css
.success-page {
  .input-copy {
    max-width: 500px;

    --input-copy-input-bg: #f9f9f9;
    --input-copy-input-border: 1px solid var(--slate-02);
    --input-copy-input-text-color: var(--slate-09);
  }
}
```

---

## Readonly input styling

The input field is always readonly to prevent accidental edits. Style it distinctly if needed:

```css
.input-copy {
  .input-copy__input {
    background-color: var(--slate-00);
    color: var(--slate-09);
    cursor: default;
  }
}
```

---

## Button text visibility on small screens

By default, the button text is hidden on screens < 480px. Override for always-visible text:

```css
.input-copy__button-text {
  display: inline !important;
}
```

Or show only the icon on mobile and text on desktop (default behavior):

```css
/* Default: button shows only icon on mobile, icon + text on desktop (480px+) */
/* No override needed; this is the built-in behavior */
```
