# DecodeQrCode

QR code decoder for static images. Accepts images via file picker or drag-and-drop, decodes any QR codes found, and displays the results inline.

**File**: `app/components/02.molecules/qr-code/DecodeQrCode.vue`

## Prerequisites

The `nuxt-qrcode` Nuxt module must be registered in the consuming app's `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-qrcode"],
});
```

No camera permission is required — this component works entirely with uploaded or dropped image files.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.decode-qr-code` | root | always present |
| `.qr-code-capture` | file input | the `QrcodeCapture` file-picker element |
| `.qr-code-dropzone` | drop zone | the `QrcodeDropZone` drag-and-drop area |
| `.scanned-results` | inner | shown when at least one code has been decoded |

## Behaviour

- Two input methods are rendered side by side: a file picker (`.qr-code-capture`) and a drag-and-drop zone (`.qr-code-dropzone`)
- Both share the same `onDetect` handler — results are displayed in the same `.scanned-results` list regardless of input method
- Detected QR codes replace the previous results — each decode is a fresh result set
- If the decoded array is empty, `.scanned-results` is hidden
- The drop zone has a dashed border and minimum height by default — style with `.qr-code-dropzone` to customise

## Usage

Drop in where image-based QR decoding is needed:

```vue
<DecodeQrCode />
```

With styling:

```vue
<DecodeQrCode style-class-passthrough="my-decoder" />
```

## CSS override

```css
.my-decoder.decode-qr-code {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.my-decoder .qr-code-dropzone {
  min-height: 12rem;
  border-radius: 1rem;
  border-color: var(--theme-input-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-decoder .scanned-results {
  margin-block-start: 1.6rem;
  font-size: 1.4rem;
}
```

## Notes

- Like `CaptureQrCode`, results are rendered inline and not emitted. To act on results in a parent, extend the component or use `nuxt-qrcode`'s `QrcodeCapture` / `QrcodeDropZone` primitives directly.
- The component renders both input methods unconditionally. If only one is needed, use the underlying `QrcodeCapture` or `QrcodeDropZone` primitives directly.
