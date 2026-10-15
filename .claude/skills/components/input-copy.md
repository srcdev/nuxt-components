# InputCopy Component

## Overview

`InputCopy` renders a readonly text input with a copy-to-clipboard button (an inline `InputButton`), with optional description text below. After a successful copy the button shows `copiedText` and `copiedIcon` for `copiedDuration` ms, a visually hidden status region announces `copiedText`, and the button stays focusable but `aria-disabled` so repeat clicks are ignored without losing focus. Emits `copy` and `copied` for consumer-side toast/feedback handling.

**Location**: `app/components/02.molecules/input-copy/InputCopy.vue`

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                 | Default            | Notes |
| -------------------------- | -------------------- | ------------------ | ----- |
| `:value`                   | `string`             | (required)         | The text copied to the clipboard. |
| `:id`                      | `string`             | auto-generated     | Id on the input. Only pass one if something needs to target it. |
| `:name`                    | `string`             | falls back to `id` | Name on the input. |
| `:label`                   | `string`             | `undefined`        | Accessible name for the input (not rendered visibly) and part of the default button aria-label. |
| `:aria-label`              | `string`             | `undefined`        | Accessible name for the input; overrides `label`. |
| `:description`             | `string`             | `undefined`        | Helper text below the input, linked with `aria-describedby`. |
| `:button-text`             | `string`             | `"Copy"`           | Button label. |
| `:copied-text`             | `string`             | `"Copied!"`        | Button label and status announcement after a copy. |
| `:button-aria-label`       | `string`             | `"Copy <label> to clipboard"` | Accessible name for the button. Pass translated copy in non-English apps. |
| `:icon`                    | `string`             | `"lucide:copy"`    | Iconify name for the resting icon. |
| `:copied-icon`             | `string`             | `"lucide:check"`   | Iconify name shown after a copy. |
| `:copied-duration`         | `number`             | `2000`             | Milliseconds the copied state lasts. |
| `:is-disabled`             | `boolean`            | `false`            | Disables the copy button. |
| `:style-class-passthrough` | `string \| string[]` | `[]`               | Extra classes on the root element. |

---

## Events

| Event    | Payload         | Notes |
| -------- | --------------- | ----- |
| `copy`   | `value: string` | Emitted after the clipboard write succeeds. |
| `copied` | `value: string` | Emitted straight after `copy`, same payload. Neither fires if the write fails (it logs `console.error`). |

---

## Slots

None.

---

## Styling

Tokens are `--input-copy-*` (layout gap, input, button, description including `--input-copy-description-line-clamp`), defaulting from `--theme-*`. Full list and defaults in `CONSUMER-STYLING.md` next to the component. The root is an inline-size container: below `48rem` of its own width the button shows only its icon.

---

## Usage examples

### License key display

```vue
<InputCopy
  :value="licenseKey"
  label="License key"
  description="Your license key is ready to use. Copy it to embed in your application."
  @copied="showSuccessToast('License key copied!')"
/>
```

### Translated copy

```vue
<InputCopy
  :value="apiToken"
  :label="t('account.apiToken.label')"
  :description="t('account.apiToken.description')"
  :button-text="t('common.copy')"
  :copied-text="t('common.copied')"
  :button-aria-label="t('account.apiToken.copyAriaLabel')"
/>
```

### Disabled state

```vue
<InputCopy
  :value="temporaryCode"
  label="Temporary code"
  button-text="Unavailable"
  :is-disabled="isGenerating"
  description="Code is being generated. Please wait."
/>
```

### Page-scoped styling

```css
.account-page .input-copy {
  --input-copy-input-border: 0.2rem solid var(--theme-border);
  --input-copy-button-bg: var(--theme-surface-inverted);
}
```

---

## Accessibility

- The input's accessible name comes from `aria-label` or `label`; `description` is linked with `aria-describedby`.
- The button's accessible name is `buttonAriaLabel`, defaulting to "Copy [label] to clipboard". It's set as `aria-label`, so it overrides the visible label.
- A visually hidden `role="status"` region announces `copiedText` after a copy (the button's aria-label doesn't change, so screen readers wouldn't otherwise hear it).
- During the copied state the button is `aria-disabled`, not `disabled`, so keyboard focus stays on it.
- Visible `:focus-visible` rings on the input and the button.

---

## Notes

- **Clipboard API**: uses `navigator.clipboard.writeText()`, which needs a secure context. A failure logs to the console and leaves the resting state.
- **No toast built-in**: listen to `@copied` and use the app's own toast (e.g. `DisplayToastProvider`).
- 2026-10-15 migration: raw `<button>` replaced with `InputButton variant="inline"`; new `buttonAriaLabel`, `icon`, `copiedIcon` props; status announcement, `aria-describedby`, copied state via `aria-disabled` instead of `disabled`; theme colour defaults and readable font sizes; container query replaces the 480px viewport media query; `.input-copy__button-text` became InputButton's `.button-text`; StressTest story and `--input-copy-description-line-clamp`.
