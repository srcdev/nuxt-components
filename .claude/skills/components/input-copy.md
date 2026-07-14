# InputCopy Component

## Overview

`InputCopy` renders a readonly text input with a copy-to-clipboard button. Displays a copyable value (e.g., license key, API token) with optional description text below. Shows visual feedback ("Copied!") in the button after a successful copy. Emits `copy` and `copied` events for consumer-side toast/feedback handling.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                   | Default          | Notes                                                        |
| -------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------ |
| `:value`                   | `string`               | (required)       | The text to copy to clipboard (e.g., license key, API token).|
| `:label`                   | `string`               | (optional)       | Short label for the field; used in aria-label if ariaLabel not set. |
| `:aria-label`              | `string`               | (optional)       | Custom aria-label for the input; overrides label.           |
| `:description`             | `string`               | (optional)       | Helper text displayed below the input.                       |
| `:button-text`             | `string`               | `"Copy"`         | Label on the copy button.                                    |
| `:copied-text`             | `string`               | `"Copied!"`      | Text shown in button after copy succeeds.                    |
| `:copied-duration`         | `number`               | `2000`           | Milliseconds the "Copied!" state persists before resetting.  |
| `:is-disabled`             | `boolean`              | `false`          | Disables the copy button.                                    |
| `:style-class-passthrough` | `string \| string[]`   | `[]`             | Extra CSS classes applied to the root element.              |

---

## Events

| Event    | Payload              | Notes                                                      |
| -------- | -------------------- | ---------------------------------------------------------- |
| `copy`   | `value: string`      | Emitted when the copy button is clicked (before clipboard write). |
| `copied` | `value: string`      | Emitted after successful clipboard write; fires after `copy`. |

---

## Slots

None. Use events to customize feedback behavior.

---

## CSS Token Customization

All `--input-copy-*` tokens can be overridden at global, page, or instance scope. See `CONSUMER-STYLING.md` in the component directory for full token documentation and examples.

**Common tokens:**
- `--input-copy-input-bg` — input field background
- `--input-copy-input-border` — input field border
- `--input-copy-button-bg` — copy button background
- `--input-copy-button-bg-hover` — button background on hover
- `--input-copy-description-color` — description text color

---

## Usage Examples

### License key display (most common)

```vue
<InputCopy
  :value="licenseKey"
  label="License key"
  description="Your license key is ready to use. Copy it to embed in your application."
  @copied="showSuccessToast('License key copied!')"
/>
```

### API token with custom button text

```vue
<InputCopy
  :value="apiToken"
  label="API token"
  description="Do not share this token with anyone."
  button-text="Copy token"
  copied-text="Token copied!"
  @copy="logCopy"
  @copied="logCopied"
/>
```

### Disabled state (e.g., loading or error)

```vue
<InputCopy
  :value="temporaryCode"
  label="Temporary code"
  button-text="Unavailable"
  :is-disabled="isGenerating"
  description="Code is being generated. Please wait."
/>
```

### With custom styling via CSS tokens

```vue
<InputCopy
  :value="shareLink"
  label="Share link"
  description="Share this link with others"
  style="
    --input-copy-input-bg: #f0f0f0;
    --input-copy-button-bg: var(--brand-primary);
    --input-copy-button-text-color: white;
  "
/>
```

### With page-scoped styling

In your page's `<style>` block:

```css
.success-page .input-copy {
  --input-copy-input-border: 2px solid var(--success-color);
  --input-copy-button-bg: var(--success-color);
  --input-copy-description-color: var(--slate-06);
}
```

Then in the template:

```vue
<div class="success-page">
  <InputCopy
    :value="licenseKey"
    label="Your license key"
    description="Copy this key to activate the component in your application."
  />
</div>
```

### With toast feedback (consumer-side)

```vue
<template>
  <InputCopy
    :value="apiKey"
    label="API key"
    @copied="handleCopied"
  />
</template>

<script setup>
const handleCopied = (value: string) => {
  // Use your app's toast library
  useToast().success(`Copied: ${value.slice(0, 8)}...`);
};
</script>
```

---

## Accessibility

- Input always has `aria-label` set from `label` or `aria-label` prop
- Button has descriptive aria-label: "Copy [label] to clipboard"
- Button is disabled during the "Copied!" feedback window to prevent repeated clicks
- Icon-only display on mobile (<480px); text shown on desktop for clarity
- Readonly input has `readonly` attribute; not editable

---

## Notes

- **Clipboard API**: Uses native `navigator.clipboard.writeText()`. Fails silently if unavailable (e.g., insecure context).
- **Button text hide on mobile**: By default, only the copy icon displays on screens <480px. Text appears on desktop (≥480px).
- **No toast built-in**: This component does not show toasts. Listen to `@copied` event and use your app's toast library for feedback.
- **Manual reset**: The "Copied!" state automatically resets after `copied-duration` milliseconds. No manual reset needed.
