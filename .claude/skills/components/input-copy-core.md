# InputCopyCore

Readonly input that displays a value with a one-click copy-to-clipboard button. Intended for license keys, API tokens, share URLs, etc.

**File**: `app/components/forms/input-copy/InputCopyCore.vue`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | required | `id` attribute on the `<input>` |
| `value` | `string` | required | Text to display and copy |
| `copy-label` | `string` | `"Copy"` | Button label before copying |
| `copied-label` | `string` | `"Copied!"` | Button label after a successful copy |
| `feedback-duration` | `number` | `2000` | ms to show the copied state before resetting |
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

## Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `copy` | `value: string` | Fires on successful clipboard write |

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Optional icon shown to the left of the button label (passes through to InputButtonCore `#left`) |

## Behaviour

- Calls `navigator.clipboard.writeText(value)` on button click
- On success: adds `.copied` class to root, shows `copiedLabel`, emits `copy`
- After `feedbackDuration` ms: removes `.copied` class, reverts button label
- Clipboard failure is caught silently — no `.copied` state is set

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.input-copy-core` | root | always present |
| `.copied` | root | present during feedback window |
| `.input-copy-field` | `<input>` | the readonly text field |
| `.input-copy-button` | button | extra class added to InputButtonCore root |

## Usage

```vue
<InputCopyCore
  id="license-key-input"
  value="sk_live_abc123def456"
  copy-label="Copy key"
  copied-label="Copied!"
  :feedback-duration="2000"
/>
```

With icon slot (e.g. using a Radix icon):

```vue
<InputCopyCore id="api-key" value="sk_live_abc123def456">
  <template #icon>
    <Icon name="radix-icons:clipboard" class="icon" />
  </template>
</InputCopyCore>
```
