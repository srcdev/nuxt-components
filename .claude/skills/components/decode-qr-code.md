# DecodeQrCode

QR code decoder for static images. Accepts images via file picker or drag-and-drop, decodes any QR codes found, and displays the results inline.

**File**: `app/components/02.molecules/qr-code/DecodeQrCode.vue`

> **Changed 2026-09-28:** `.qr-code-capture`, `.qr-code-dropzone`, `.scanned-results` → `.decode-qr-code-capture`, `-dropzone`, `-results`. The file input now has a visible label and the drop zone instruction text (both props); the root is no longer forced to `aspect-ratio: 1 / 1`.

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
| `upload-label` | `string` | `"Upload a QR code image"` | Visible label wrapping the file input (its accessible name) |
| `drop-label` | `string` | `"Or drop a QR code image here"` | Instruction text inside the drop zone |
| `style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

## CSS classes

| Class | Where | Description |
|-------|-------|-------------|
| `.decode-qr-code` | root | always present |
| `.decode-qr-code-capture` | file input | the `QrcodeCapture` file-picker element |
| `.decode-qr-code-dropzone` | drop zone | the `QrcodeDropZone` drag-and-drop area |
| `.decode-qr-code-upload` | label | wraps `.decode-qr-code-upload-label` and the file input |
| `.decode-qr-code-dropzone.is-dropping` | drop zone | an image is being dragged over it |
| `.decode-qr-code-results` | inner | polite live region, always rendered; its `<ul>` appears once a code is decoded |

## Behaviour

- Two input methods are rendered side by side: a file picker (`.decode-qr-code-capture`) and a drag-and-drop zone (`.decode-qr-code-dropzone`)
- Both share the same `onDetect` handler — results are displayed in the same `.decode-qr-code-results` list regardless of input method
- Detected QR codes replace the previous results — each decode is a fresh result set
- If the decoded array is empty, the results `<ul>` isn't rendered (the live-region wrapper stays)
- The drop zone has a dashed border and minimum height by default — style with `.decode-qr-code-dropzone` to customise

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

.my-decoder .decode-qr-code-dropzone {
  min-height: 12rem;
  border-radius: 1rem;
  border-color: var(--theme-input-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-decoder .decode-qr-code-results {
  margin-block-start: 1.6rem;
  font-size: 1.4rem;
}
```

## Notes

- Like `CaptureQrCode`, results are rendered inline and not emitted. To act on results in a parent, extend the component or use `nuxt-qrcode`'s `QrcodeCapture` / `QrcodeDropZone` primitives directly.
- The component renders both input methods unconditionally. If only one is needed, use the underlying `QrcodeCapture` or `QrcodeDropZone` primitives directly.
